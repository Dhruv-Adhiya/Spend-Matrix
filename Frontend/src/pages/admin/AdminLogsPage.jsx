import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { GlassCard } from '../../components/ui/GlassCard';
import { Spinner } from '../../components/ui/Spinner';
import { GlassButton } from '../../components/ui/GlassButton';
import { Badge } from '../../components/ui/Badge';
import './AdminTable.css'; // Shared table styles
import './AdminLogsPage.css'; // Specific pagination/layout styles

export const AdminLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;

  const fetchLogs = useCallback(async (pageNum) => {
    try {
      setIsLoading(true);
      const res = await adminService.getLogs(pageNum, limit);
      setLogs(res.data?.data || res.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load system logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(page);
  }, [fetchLogs, page]);

  const handlePrevPage = () => setPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setPage(p => Math.min(totalPages, p + 1));

  const formatLogDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  const getSeverityBadgeType = (level) => {
    switch (level?.toLowerCase()) {
      case 'error':
      case 'critical':
      case 'fatal':
        return 'error';
      case 'warn':
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'success'; // Treat info as normal/success
    }
  };

  // Aggressive sanitization of raw details, in case backend sent tokens
  const sanitizeDetails = (detailsObj) => {
    if (!detailsObj) return '-';
    try {
      // If it's a string, just show it but hide obvious tokens
      if (typeof detailsObj === 'string') {
        return detailsObj.replace(/(eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,})/g, '[REDACTED_JWT]');
      }
      
      // If it's an object, stringify and sanitize
      let str = JSON.stringify(detailsObj, null, 2);
      str = str.replace(/"(password|token|secret|access_token|refresh_token)":\s*"[^"]+"/gi, '"$1": "[REDACTED]"');
      return str;
    } catch (e) {
      return 'Unparseable Details';
    }
  };

  if (isLoading && logs.length === 0) {
    return (
      <div className="admin-page center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="page-title">System Logs</h1>
        <p className="page-subtitle">Audit trail of system events, logins, and crucial operations.</p>
      </div>

      <div className="admin-table-container">
        {/* Desktop View */}
        <div className="admin-desktop-view">
          <GlassCard padding="none">
            <div className="admin-table-responsive">
              <table className="admin-table log-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Level</th>
                    <th>Event</th>
                    <th>User Context</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatLogDate(log.timestamp || log.created_at)}</td>
                      <td>
                        <Badge 
                          type={getSeverityBadgeType(log.level)} 
                          text={(log.level || 'INFO').toUpperCase()} 
                        />
                      </td>
                      <td style={{ fontWeight: 500 }}>{log.event_name || log.action}</td>
                      <td>{log.user_email || `User ${log.user_id}` || 'System'}</td>
                      <td>
                        <pre className="log-details-block">
                          {sanitizeDetails(log.details || log.metadata)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                        No logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Mobile View */}
        <div className="admin-mobile-view">
          {logs.map((log) => (
            <GlassCard key={log.id} className="admin-mobile-card">
              <div className="admin-mobile-header">
                <div className="admin-mobile-title">
                  <span className="admin-mobile-title-main">{log.event_name || log.action}</span>
                  <span className="admin-mobile-title-sub">{formatLogDate(log.timestamp || log.created_at)}</span>
                </div>
                <div>
                  <Badge 
                    type={getSeverityBadgeType(log.level)} 
                    text={(log.level || 'INFO').toUpperCase()} 
                  />
                </div>
              </div>
              <div className="admin-mobile-body">
                <div className="admin-mobile-row">
                  <span className="admin-mobile-label">Context</span>
                  <span>{log.user_email || `User ${log.user_id}` || 'System'}</span>
                </div>
                <div className="admin-mobile-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span className="admin-mobile-label">Details</span>
                  <pre className="log-details-block mobile">
                    {sanitizeDetails(log.details || log.metadata)}
                  </pre>
                </div>
              </div>
            </GlassCard>
          ))}
          {logs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              No logs found.
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="admin-pagination-controls">
          <GlassButton 
            onClick={handlePrevPage} 
            disabled={page === 1}
            variant="secondary"
          >
            Previous
          </GlassButton>
          <span className="page-info">Page {page} of {totalPages}</span>
          <GlassButton 
            onClick={handleNextPage} 
            disabled={page === totalPages}
            variant="secondary"
          >
            Next
          </GlassButton>
        </div>
      )}
    </div>
  );
};
