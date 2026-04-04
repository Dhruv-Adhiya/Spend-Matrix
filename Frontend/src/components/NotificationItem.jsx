const TYPE_STYLES = {
  BUDGET_ALERT: 'bg-yellow-100 text-yellow-700',
  TRANSACTION_CREATED: 'bg-blue-100 text-blue-700',
  RECURRING_EXECUTED: 'bg-green-100 text-green-700',
  UPCOMING_RECURRING: 'bg-purple-100 text-purple-700',
};

export default function NotificationItem({ notification, onMarkRead }) {
  const { id, title, message, type, is_read, created_at } = notification;

  const handleClick = () => {
    if (!is_read) onMarkRead(id);
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
      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-1">
        {new Date(created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
