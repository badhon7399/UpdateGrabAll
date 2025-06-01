const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllSettings,
  getSettingByKey,
  updateSettings,
  deleteSetting,
  uploadStoreLogo,
  getSetupStatus
} = require('../controllers/settingsController');

// Base routes
router.route('/')
  .get(getAllSettings)
  .put(protect, authorize('admin'), updateSettings);

router.route('/:key')
  .get(getSettingByKey)
  .delete(protect, authorize('admin'), deleteSetting);

// Special routes
router.route('/upload-logo')
  .post(protect, authorize('admin'), uploadStoreLogo);

router.route('/setup-status')
  .get(getSetupStatus);

module.exports = router;