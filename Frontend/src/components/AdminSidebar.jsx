const tabs = [
  { key: 'stats', label: '📊 System Stats' },
  { key: 'users', label: '👥 Users' },
  { key: 'transactions', label: '💳 Transactions' },
  { key: 'recurring', label: '🔁 Recurring' },
  { key: 'logs', label: '📋 Audit Logs' },
];

export default function AdminSidebar({ active, onChange }) {
  return (
    <aside className="w-52 bg-white shadow-sm flex flex-col py-6 px-3 gap-1 min-h-full">
      <p className="text-xs font-semibold text-gray-400 uppercase px-4 mb-2">Admin Panel</p>
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-left transition ${
            active === key
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </aside>
  );
}
