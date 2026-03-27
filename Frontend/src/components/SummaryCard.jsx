const colorMap = {
  balance: 'bg-indigo-50 text-indigo-600',
  income: 'bg-green-50 text-green-600',
  expense: 'bg-red-50 text-red-600',
};

export default function SummaryCard({ title, amount, type }) {
  const color = colorMap[type] ?? 'bg-gray-50 text-gray-600';

  return (
    <div className={`rounded-xl p-5 shadow-sm ${color}`}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-2xl font-bold mt-1">
        ₹{Number(amount ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}
