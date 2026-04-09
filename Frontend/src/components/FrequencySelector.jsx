const FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'];

export default function FrequencySelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
    >
      <option value="">Select frequency</option>
      {FREQUENCIES.map((f) => (
        <option key={f} value={f}>
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </option>
      ))}
    </select>
  );
}
