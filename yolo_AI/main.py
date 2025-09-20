import json, os, io, re, tempfile, uuid, asyncio
from pathlib import Path
from typing import List, Tuple

import cv2
import numpy as np
from ultralytics import YOLO
import torch
from shapely.geometry import Polygon
import easyocr

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- Configuration & Global Variables ---
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
MODELS_DIR = Path("models")
TEMP_DIR = Path("temp_processing")
TEMP_DIR.mkdir(exist_ok=True)

app = FastAPI(title="Parking Lot Detection API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

task_db = {}

# --- Model Loading ---
def load_models():
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[INFO] Using device: {device}")
    car_model = YOLO(MODELS_DIR / "yolov8n.pt").to(device)
    plate_model = YOLO(MODELS_DIR / "license_plate_detector.pt").to(device)
    ocr_reader = easyocr.Reader(["en"], gpu=torch.cuda.is_available())
    print("[INFO] All models loaded successfully.")
    return car_model, plate_model, ocr_reader, device

CAR_MODEL, PLATE_MODEL, OCR_READER, DEVICE = load_models()

# --- Core Logic Helpers ---
def save_slots(path, slots):
    with open(path, "w") as f:
        json.dump({"slots": slots}, f)

def load_slots(path):
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Annotation file not found: {path}")
    with open(path, "r") as f:
        data = json.load(f)
    return data.get("slots", [])

def occupancy_ratio(slot_polygon, car_box):
    slot_poly = Polygon(slot_polygon)
    if not slot_poly.is_valid or slot_poly.area < 1: return 0.0
    car_poly = Polygon([(car_box[0], car_box[1]), (car_box[2], car_box[1]), (car_box[2], car_box[3]), (car_box[0], car_box[3])])
    inter = slot_poly.intersection(car_poly).area
    return inter / slot_poly.area

# --- MODIFIED CORE FUNCTION ---
def process_frame(frame, slots, conf=0.35, classes=[2, 5, 7], occ_thr=0.55):
    # --- 1. Vehicle Detection (Logic remains, for calculation) ---
    car_results = CAR_MODEL(frame, imgsz=1280, conf=conf, classes=classes, verbose=False)
    cars = [{'box': tuple(map(int, box.xyxy[0])), 'plate': None, 'plate_text': None} for box in car_results[0].boxes]
    
    # --- 2. License Plate Detection & OCR ---
    plate_results = PLATE_MODEL(frame, imgsz=640, conf=0.4, verbose=False)
    plates_coords = [tuple(map(int, box.xyxy[0])) for box in plate_results[0].boxes]
    
    for car in cars:
        cx1, cy1, cx2, cy2 = car['box']
        for px1, py1, px2, py2 in plates_coords:
            if cx1 < (px1 + px2) / 2 < cx2 and cy1 < (py1 + py2) / 2 < cy2:
                car['plate'] = (px1, py1, px2, py2)
                plate_crop = frame[py1:py2, px1:px2]
                if plate_crop.size > 0:
                    ocr_result = OCR_READER.readtext(plate_crop, allowlist='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-')
                    if ocr_result:
                        best_result = max(ocr_result, key=lambda r: r[2], default=None)
                        # CHANGE 2: Increased confidence threshold from 0.3 to 0.65
                        # This makes the OCR text much more stable and accurate.
                        if best_result and best_result[2] > 0.65:
                           car['plate_text'] = best_result[1].strip().replace(" ", "")
                break 
    
    # --- 3. Occupancy Calculation (Remains the same) ---
    slot_status = []
    car_boxes = [c['box'] for c in cars]
    for slot in slots:
        occupied = any(occupancy_ratio(slot, box) >= occ_thr for box in car_boxes)
        slot_status.append(occupied)
    
    # --- 4. Drawing Results ---
    out_frame = frame.copy()
    for car in cars:
        # CHANGE 1: The line below, which draws the rectangle for the car, is now commented out.
        # cv2.rectangle(out_frame, (car['box'][0], car['box'][1]), (car['box'][2], car['box'][3]), (255, 200, 0), 2)
        
        # We still draw the plate and its text
        if car['plate']:
            cv2.rectangle(out_frame, (car['plate'][0], car['plate'][1]), (car['plate'][2], car['plate'][3]), (0, 255, 255), 2)
            if car['plate_text']:
                # Add a background rectangle for better text visibility
                (text_width, text_height), baseline = cv2.getTextSize(car['plate_text'], cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
                text_pos = (car['plate'][0], car['plate'][1] - 10)
                cv2.rectangle(out_frame, (text_pos[0], text_pos[1] - text_height - baseline), (text_pos[0] + text_width, text_pos[1] + baseline), (0, 255, 255), -1)
                cv2.putText(out_frame, car['plate_text'], text_pos, cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)

    # Drawing for slots remains the same
    for i, (slot, occupied) in enumerate(zip(slots, slot_status)):
        pts = np.array(slot, np.int32)
        color = (0, 0, 255) if occupied else (0, 255, 0)
        cv2.polylines(out_frame, [pts], isClosed=True, color=color, thickness=2)
        cv2.putText(out_frame, f"{i}", (pts[0][0], pts[0][1] - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        
    return out_frame


async def video_stream_generator(task_id: str, background_tasks: BackgroundTasks):
    """Generator that yields processed video frames as MJPEG."""
    task_info = task_db.get(task_id)
    if not task_info:
        print(f"Error: Task {task_id} not found in DB.")
        return

    input_video_path = task_info["input_path"]
    slots = task_info["slots"]

    background_tasks.add_task(os.remove, input_video_path)
    background_tasks.add_task(task_db.pop, task_id, None)

    cap = cv2.VideoCapture(str(input_video_path))
    if not cap.isOpened():
        print(f"Error: Could not open video file at {input_video_path}")
        return
        
    try:
        while True:
            ret, frame = cap.read()
            if not ret: break
            
            processed_frame = process_frame(frame, slots)
            _, buffer = cv2.imencode(".jpg", processed_frame)
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            await asyncio.sleep(0.01)
    finally:
        cap.release()
        print(f"Finished streaming and cleaned up for task: {task_id}")


# --- API Endpoints ---
class AnnotationPayload(BaseModel):
    location_name: str; slots: List[List[Tuple[int, int]]]

@app.post("/api/annotate")
async def create_annotations(payload: AnnotationPayload):
    sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '', payload.location_name)
    file_path = DATA_DIR / f"{sanitized_name}.json"
    save_slots(file_path, payload.slots)
    return {"message": f"Annotations for '{sanitized_name}' saved."}

@app.get("/api/locations")
async def get_locations(): return [f.stem for f in DATA_DIR.glob("*.json")]

@app.post("/api/detect")
async def detect_occupancy(location_name: str = Form(...), file: UploadFile = File(...)):
    sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '', location_name)
    slots = load_slots(DATA_DIR / f"{sanitized_name}.json")
    
    if file.content_type.startswith("image/"):
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        processed_img = process_frame(img, slots)
        _, buffer = cv2.imencode(".jpg", processed_img)
        headers = {'X-Media-Type': 'image'}
        return StreamingResponse(io.BytesIO(buffer), media_type="image/jpeg", headers=headers)

    elif file.content_type.startswith("video/"):
        task_id = str(uuid.uuid4())
        input_video_path = TEMP_DIR / f"{task_id}_input.mp4"
        with open(input_video_path, "wb") as buffer:
            buffer.write(await file.read())
        
        task_db[task_id] = {
            "input_path": str(input_video_path),
            "slots": slots
        }
        
        return JSONResponse(content={"task_id": task_id, "media_type": "video"})
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type.")


@app.get("/api/stream/{task_id}")
async def get_video_stream(task_id: str, background_tasks: BackgroundTasks):
    return StreamingResponse(
        video_stream_generator(task_id, background_tasks),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )