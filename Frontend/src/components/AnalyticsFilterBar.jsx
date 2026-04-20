const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const lbl = { fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: '#374151', marginBottom: 4, display: 'block' };

export default function AnalyticsFilterBar({ filters, onChange }) {
  const handle = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="card" style={{ padding: '14px 20px', marginBottom: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Month</label>
          <select name="month" value={filters.month} onChange={handle} className="input" style={{ width: 150 }}>
            {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Year</label>
          <select name="year" value={filters.year} onChange={handle} className="input" style={{ width: 110 }}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Payment Source</label>
          <select name="payment_source" value={filters.payment_source} onChange={handle} className="input" style={{ width: 160 }}>
            <option value="">All Sources</option>
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="credit_card">Credit Card</option>
          </select>
        </div>
      </div>
    </div>
  );
}
