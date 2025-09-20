export default function TransactionsTable({ items = [] }) {
  return (
    <div className="p-5 rounded-xl bg-[#F8FAFC] shadow">
      <div className="mb-4 text-lg font-semibold text-[#0F172A]">Recent Transactions</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-[#64748B]">
              <th className="py-2">Time</th>
              <th className="py-2">Plate</th>
              <th className="py-2">Facility</th>
              <th className="py-2">Method</th>
              <th className="py-2">Minutes</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {items.map((t) => (
              <tr key={t._id} className="text-sm">
                <td className="py-3">{new Date(t.createdAt || Date.now()).toLocaleString()}</td>
                <td className="font-medium text-[#0F172A]">{t.plate || "-"}</td>
                <td>{t.facility?.name || "-"}</td>
                <td className="capitalize">{t.method || "-"}</td>
                <td>{t.minutes ?? "-"}</td>
                <td>{(t.amount ?? 0).toLocaleString("en-DZ")} DA</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      t.status === "succeeded"
                        ? "bg-[#D1FADF] text-[#22C55E]"
                        : t.status === "pending"
                        ? "bg-[#F97316]/20 text-[#F97316]"
                        : "bg-[#F43F5E]/20 text-[#F43F5E]"
                    }`}
                  >
                    {String(t.status || "unknown").toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
