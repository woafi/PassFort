const express = require('express');
const router = express.Router();
const controller = require('../controllers/passwordController');

router.get('/', controller.getPasswords);
router.post('/', controller.savePassword);
router.delete('/', controller.deletePassword);
router.put('/', controller.updatePassword);

module.exports = router;
