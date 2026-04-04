const TYPE_STYLES = {
  BUDGET_ALERT: 'bg-yellow-100 text-yellow-700',
  TRANSACTION_CREATED: 'bg-blue-100 text-blue-700',
  RECURRING_EXECUTED: 'bg-green-100 text-green-700',
  UPCOMING_RECURRING: 'bg-purple-100 text-purple-700',
};

export default function NotificationItem({ notification, onMarkRead, onDelete }) {
  const { id, title, message, type, is_read, created_at } = notification;

  const handleClick = () => {
    if (!is_read) onMarkRead(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition hover:shadow-sm ${
        is_read ? 'bg-white border-gray-100' : 'bg-indigo-50 border-indigo-200'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_STYLES[type] ?? 'bg-gray-100 text-gray-600'}`}>
            {type.replace(/_/g, ' ')}
          </span>
          {!is_read && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
        </div>
        <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0 mt-1">
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {new Date(created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
        <button
          onClick={handleDelete}
          className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition"
          aria-label="Delete notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
