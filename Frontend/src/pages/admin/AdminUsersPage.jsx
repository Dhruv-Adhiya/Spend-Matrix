import { useState, useEffect } from 'react';
// Removed lucide-react
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { GlassCard } from '../../components/ui/GlassCard';
import { Spinner } from '../../components/ui/Spinner';
import { IconButton } from '../../components/ui/IconButton';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import './AdminTable.css'; // Shared table styles

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getUsers();
      setUsers(res.data?.data || res.data || []);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenBlock = (user) => {
    setSelectedUser(user);
    setIsBlockConfirmOpen(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteConfirmOpen(true);
  };

  const handleToggleBlock = async () => {
    if (!selectedUser) return;
    try {
      await adminService.blockUser(selectedUser.id);
      toast.success(`User ${selectedUser.is_blocked ? 'unblocked' : 'blocked'} successfully`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    } finally {
      setIsBlockConfirmOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await adminService.deleteUser(selectedUser.id);
      toast.success('User deleted permanently');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setIsDeleteConfirmOpen(false);
      setSelectedUser(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="admin-page center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="page-title">Manage Users</h1>
        <p className="page-subtitle">View and moderate all registered users.</p>
      </div>

      <div className="admin-table-container">
        {/* Desktop View */}
        <div className="admin-desktop-view">
          <GlassCard padding="none">
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th className="admin-actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 500 }}>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td style={{ textTransform: 'capitalize' }}>{user.role || 'User'}</td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <Badge 
                          type={user.is_blocked ? 'error' : 'success'} 
                          text={user.is_blocked ? 'Blocked' : 'Active'} 
                        />
                      </td>
                      <td className="admin-actions-col">
                        <div className="admin-action-buttons">
                          <IconButton 
                            icon={user.is_blocked ? "CheckCircle" : "Ban"} 
                            onClick={() => handleOpenBlock(user)} 
                            aria-label={user.is_blocked ? "Unblock User" : "Block User"}
                            size="small"
                            variant="secondary"
                            title={user.is_blocked ? "Unblock User" : "Block User"}
                          />
                          {user.role !== 'admin' && (
                            <IconButton 
                              icon="Trash2" 
                              onClick={() => handleOpenDelete(user)} 
                              aria-label="Delete User"
                              variant="danger"
                              size="small"
                              title="Delete User"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Mobile View */}
        <div className="admin-mobile-view">
          {users.map(user => (
            <GlassCard key={user.id} className="admin-mobile-card">
              <div className="admin-mobile-header">
                <div className="admin-mobile-title">
                  <span className="admin-mobile-title-main">{user.full_name}</span>
                  <span className="admin-mobile-title-sub">{user.email}</span>
                </div>
                <div className="admin-action-buttons">
                  <IconButton 
                    icon={user.is_blocked ? "CheckCircle" : "Ban"} 
                    onClick={() => handleOpenBlock(user)} 
                    aria-label="Toggle Block"
                    size="small"
                    variant="secondary"
                  />
                  {user.role !== 'admin' && (
                    <IconButton 
                      icon="Trash2" 
                      onClick={() => handleOpenDelete(user)} 
                      aria-label="Delete"
                      variant="danger"
                      size="small"
                    />
                  )}
                </div>
              </div>
              <div className="admin-mobile-body">
                <div className="admin-mobile-row">
                  <span className="admin-mobile-label">Role</span>
                  <span style={{ textTransform: 'capitalize' }}>{user.role || 'User'}</span>
                </div>
                <div className="admin-mobile-row">
                  <span className="admin-mobile-label">Joined</span>
                  <span>{formatDate(user.created_at)}</span>
                </div>
                <div className="admin-mobile-row">
                  <span className="admin-mobile-label">Status</span>
                  <Badge 
                    type={user.is_blocked ? 'error' : 'success'} 
                    text={user.is_blocked ? 'Blocked' : 'Active'} 
                  />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isBlockConfirmOpen}
        onClose={() => setIsBlockConfirmOpen(false)}
        onConfirm={handleToggleBlock}
        title={selectedUser?.is_blocked ? "Unblock User" : "Block User"}
        message={
          selectedUser?.is_blocked 
            ? `Are you sure you want to unblock ${selectedUser?.full_name}? They will regain access to their account.`
            : `Are you sure you want to block ${selectedUser?.full_name}? They will immediately lose access to the system.`
        }
        confirmText={selectedUser?.is_blocked ? "Unblock" : "Block"}
        isDanger={!selectedUser?.is_blocked}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to permanently delete ${selectedUser?.full_name}? This action is irreversible and will destroy all associated data including transactions and budgets.`}
        confirmText="Permanently Delete"
        isDanger={true}
      />
    </div>
  );
};
