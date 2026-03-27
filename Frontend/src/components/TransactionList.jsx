export default function TransactionList({ transactions }) {
  if (!transactions?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400 text-sm">
        No transactions available.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b">
        <h2 className="font-semibold text-gray-700">Recent Transactions</h2>
      </div>
      <ul className="divide-y">
        {transactions.slice(0, 5).map((tx) => (
          <li key={tx.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">{tx.note || tx.description || '—'}</p>
              <p className="text-xs text-gray-400">
                {tx.date ? new Date(tx.date).toLocaleDateString('en-IN') : '—'}
              </p>
            </div>
            <span
              className={`text-sm font-semibold ${
                tx.type === 'income' ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {tx.type === 'income' ? '+' : '-'}₹
              {Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
