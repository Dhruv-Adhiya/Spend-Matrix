const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);
const PAYMENT_SOURCES = ['cash', 'online', 'credit_card'];

const sel =
  'border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300';

export default function AnalyticsFilterBar({ filters, onChange }) {
  const handle = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="flex flex-wrap gap-3 items-end bg-white rounded-xl shadow-sm p-4">
      {/* Month */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Month</label>
        <select name="month" value={filters.month} onChange={handle} className={sel}>
          {MONTHS.map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Year</label>
        <select name="year" value={filters.year} onChange={handle} className={sel}>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Payment Source */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Payment Source</label>
        <select name="payment_source" value={filters.payment_source} onChange={handle} className={sel}>
          <option value="">All Sources</option>
          {PAYMENT_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
