const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const PAYMENT_SOURCES = ['cash', 'card', 'upi', 'bank_transfer', 'other'];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function FilterBar({ filters, onChange }) {
  const handle = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  const selectClass =
    'border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300';

  return (
    <div className="flex flex-wrap gap-3 items-center bg-white rounded-xl shadow-sm p-4">
      <select name="month" value={filters.month} onChange={handle} className={selectClass}>
        {MONTHS.map((m, i) => (
          <option key={i + 1} value={i + 1}>{m}</option>
        ))}
      </select>

      <select name="year" value={filters.year} onChange={handle} className={selectClass}>
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <select name="payment_source" value={filters.payment_source} onChange={handle} className={selectClass}>
        <option value="">All Payment Sources</option>
        {PAYMENT_SOURCES.map((s) => (
          <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
        ))}
      </select>
    </div>
  );
}
