const {
  getAllUsers, getUserById, blockUser, deleteUser,
  getDashboardStats, getAuditLogs, insertAuditLog,
} = require('../services/adminService');

const getIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;

// GET /api/admin/users
const listUsers = async (req, res) => {
  try {
    const result = await getAllUsers(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/admin/users/:id
const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/admin/users/:id/block
const toggleBlock = async (req, res) => {
  try {
    const { is_blocked } = req.body;
    if (typeof is_blocked !== 'boolean') {
      return res.status(400).json({ error: 'is_blocked must be a boolean' });
    }

    const user = await blockUser(req.params.id, is_blocked);
    if (!user) return res.status(404).json({ error: 'User not found or cannot block an admin' });

    await insertAuditLog({
      user_id: req.user.id,
      action: is_blocked ? 'USER_BLOCKED' : 'USER_UNBLOCKED',
      entity_type: 'user',
      metadata: { target_user_id: req.params.id },
      ip_address: getIp(req),
    });

    res.json({ message: `User ${is_blocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/admin/users/:id
const removeUser = async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });

    await insertAuditLog({
      user_id: req.user.id,
      action: 'USER_DELETED',
      entity_type: 'user',
      metadata: { target_user_id: req.params.id },
      ip_address: getIp(req),
    });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    if (err.message === 'SELF_DELETE') return res.status(400).json({ error: 'Cannot delete your own account' });
    if (err.message === 'DELETE_ADMIN') return res.status(400).json({ error: 'Cannot delete another admin' });
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/admin/dashboard
const dashboard = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/admin/logs
const auditLogs = async (req, res) => {
  try {
    const result = await getAuditLogs(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { listUsers, getUser, toggleBlock, removeUser, dashboard, auditLogs };
