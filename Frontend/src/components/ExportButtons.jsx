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

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {/* CSV */}
      <button
        onClick={() => handle('csv')}
        disabled={disabled || loadingCSV || loadingPDF}
        className="btn btn-secondary"
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: '0.8125rem', opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
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
        className="btn btn-secondary"
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: '0.8125rem', opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {loadingPDF
          ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
          : <FileText size={15} />}
        {loadingPDF ? 'Exporting...' : 'PDF'}
      </button>
    </div>
  );
}
