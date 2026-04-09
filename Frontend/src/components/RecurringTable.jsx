import ToggleSwitch from './ToggleSwitch';

const FREQ_COLOR = {
  daily: 'bg-blue-100 text-blue-700',
  weekly: 'bg-purple-100 text-purple-700',
  monthly: 'bg-indigo-100 text-indigo-700',
  yearly: 'bg-pink-100 text-pink-700',
};

const SOURCE_LABEL = { online: 'Online', cash: 'Cash', credit_card: 'Credit Card' };

export default function RecurringTable({ rules, toggling, onEdit, onDelete, onToggle }) {
  if (rules.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400 text-sm">
        No recurring rules yet. Click &quot;+ Add Rule&quot; to get started.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Frequency</th>
            <th className="px-4 py-3 text-left">Next Run</th>
            <th className="px-4 py-3 text-left">Source</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rules.map((r) => (
            <tr key={r.id} className={`hover:bg-gray-50 ${!r.is_active ? 'opacity-60' : ''}`}>
              <td className="px-4 py-3 text-gray-700">{r.category_name ?? `#${r.category_id}`}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {r.type}
                </span>
              </td>
              <td
                className={`px-4 py-3 font-semibold ${
                  r.type === 'income' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {r.type === 'income' ? '+' : '-'}₹
                {Number(r.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    FREQ_COLOR[r.frequency] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {r.frequency}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">
                {r.next_run_date
                  ? new Date(r.next_run_date).toLocaleDateString('en-IN')
                  : '—'}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {SOURCE_LABEL[r.payment_source] ?? r.payment_source}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <ToggleSwitch
                    checked={r.is_active}
                    onChange={() => onToggle(r)}
                    disabled={toggling === r.id}
                  />
                  <span className="text-xs text-gray-500">
                    {toggling === r.id ? '…' : r.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button
                  onClick={() => onEdit(r)}
                  className="text-indigo-500 hover:text-indigo-700 text-xs font-medium mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(r)}
                  className="text-red-400 hover:text-red-600 text-xs font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
