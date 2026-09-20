import { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import toast from 'react-hot-toast';
import { exportService } from '../../services/exportService';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import './ExportPage.css';

export const ExportPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0], // default 1 month ago
    endDate: new Date().toISOString().split('T')[0] // default today
  });

  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const validateDates = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Start and end dates are required');
      return false;
    }
    if (new Date(dateRange.startDate) > new Date(dateRange.endDate)) {
      toast.error('Start date cannot be after end date');
      return false;
    }
    return true;
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportCSV = async () => {
    if (!validateDates()) return;
    setIsExportingCSV(true);
    try {
      const blob = await exportService.exportCSV(dateRange.startDate, dateRange.endDate);
      downloadBlob(blob, `SpendMatrix_Export_${dateRange.startDate}_to_${dateRange.endDate}.csv`);
      toast.success('CSV exported successfully');
    } catch (err) {
      toast.error('Failed to export CSV');
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    if (!validateDates()) return;
    setIsExportingPDF(true);
    try {
      const blob = await exportService.exportPDF(dateRange.startDate, dateRange.endDate);
      downloadBlob(blob, `SpendMatrix_Export_${dateRange.startDate}_to_${dateRange.endDate}.pdf`);
      toast.success('PDF exported successfully');
    } catch (err) {
      toast.error('Failed to export PDF');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const isExporting = isExportingCSV || isExportingPDF;

  return (
    <div className="export-page">
      <div className="export-header">
        <div>
          <h1 className="page-title">Export Data</h1>
          <p className="page-subtitle">Download your transaction history for external analysis or record keeping.</p>
        </div>
      </div>

      <GlassCard className="export-controls-card">
        <h3 className="section-title">Select Date Range</h3>
        <div className="date-range-inputs">
          <GlassInput
            label="Start Date"
            name="startDate"
            type="date"
            value={dateRange.startDate}
            onChange={handleDateChange}
            disabled={isExporting}
          />
          <GlassInput
            label="End Date"
            name="endDate"
            type="date"
            value={dateRange.endDate}
            onChange={handleDateChange}
            disabled={isExporting}
          />
        </div>
      </GlassCard>

      <div className="export-options-grid">
        <GlassCard className="export-option-card">
          <div className="export-icon-wrapper csv">
            <Icon name="FileSpreadsheet" size={32} />
          </div>
          <div className="export-info">
            <h3 className="export-title">CSV Export</h3>
            <p className="export-desc">Raw transaction data formatted for spreadsheet applications like Excel or Google Sheets.</p>
          </div>
          <GlassButton 
            variant="primary" 
            icon="Download" 
            onClick={handleExportCSV}
            isLoading={isExportingCSV}
            disabled={isExportingPDF}
            className="export-btn"
          >
            Download CSV
          </GlassButton>
        </GlassCard>

        <GlassCard className="export-option-card">
          <div className="export-icon-wrapper pdf">
            <Icon name="FileText" size={32} />
          </div>
          <div className="export-info">
            <h3 className="export-title">PDF Report</h3>
            <p className="export-desc">A formatted, print-ready document summarizing your financial activity over the period.</p>
          </div>
          <GlassButton 
            variant="primary" 
            icon="Download" 
            onClick={handleExportPDF}
            isLoading={isExportingPDF}
            disabled={isExportingCSV}
            className="export-btn"
          >
            Download PDF
          </GlassButton>
        </GlassCard>
      </div>
    </div>
  );
};
