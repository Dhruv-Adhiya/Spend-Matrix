import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { exportCSV, exportPDF } from '../services/exportService';

export default function ExportButtons({ filters, disabled }) {
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);

  const handle = async (type) => {
    const setLoading = type === 'csv' ? setLoadingCSV : setLoadingPDF;
    setLoading(true);
    try {
      if (type === 'csv') await exportCSV(filters);
      else await exportPDF(filters);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const btnBase = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 14px',
    border: '1.5px solid #E5E7EB',
    borderRadius: 9,
    background: '#fff',
    color: '#374151',
    fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.8125rem',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {/* CSV */}
      <button
        onClick={() => handle('csv')}
        disabled={disabled || loadingCSV || loadingPDF}
        style={{ ...btnBase, opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; } }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#fff'; }}
      >
        {loadingCSV
          ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
          : <Download size={15} />}
        {loadingCSV ? 'Exporting...' : 'CSV'}
      </button>

      {/* PDF */}
      <button
        onClick={() => handle('pdf')}
        disabled={disabled || loadingCSV || loadingPDF}
        style={{ ...btnBase, opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; } }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#fff'; }}
      >
        {loadingPDF
          ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
          : <FileText size={15} />}
        {loadingPDF ? 'Exporting...' : 'PDF'}
      </button>
    </div>
  );
}
