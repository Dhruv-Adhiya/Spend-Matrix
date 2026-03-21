const settingsService = require('../services/settingsService');

exports.getSettings = async (req, res, next) => {
  try {
    const data = await settingsService.getSettings(req.user.id);
    res.status(200).json({ success: true, message: 'Settings fetched', data });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Request body is empty', data: null });
    }
    const data = await settingsService.updateSettings(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Settings updated', data });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message, data: null });
    }
    next(error);
  }
};
