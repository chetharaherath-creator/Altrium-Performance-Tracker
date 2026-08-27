const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// GET /api/users/me
// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'department', 'team', 'profile_picture']
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const Task = require('../models/Task');
const { Op } = require('sequelize');

// GET /api/users/eligible
// Get users for assigning tasks (filtered by quarter_batch or manager)
router.get('/eligible', auth, async (req, res) => {
  try {
    const { quarter_batch, review_type } = req.query;
    const whereClause = {};

    // Only managers can fetch eligible users
    if (['hr_manager', 'employee'].includes(req.user.role) && req.user.role !== 'hr_manager') {
       // Allow HR for now, but usually it's managers
       // return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'team_manager' || req.user.role === 'department_manager') {
      whereClause.manager_id = req.user.id;
    }

    if (quarter_batch) {
      whereClause.quarter_batch = quarter_batch;
    }

    let assignedUserIds = [];

    // Find users who already have this type of task assigned this quarter
    if (quarter_batch && review_type) {
      const existingTasks = await Task.findAll({
        where: {
          quarter: quarter_batch,
          type: review_type
        },
        attributes: ['assignee_id']
      });
      assignedUserIds = existingTasks.map(t => t.assignee_id);
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'role', 'quarter_batch']
    });

    const usersWithFlag = users.map(user => ({
      ...user.toJSON(),
      isAssigned: assignedUserIds.includes(user.id)
    }));

    res.json(usersWithFlag);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/users/profile
// Update user profile (password and profile picture)
router.put('/profile', auth, upload.single('profile_picture'), async (req, res) => {
  try {
    const { password } = req.body;
    const updateData = {};

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      updateData.profile_picture = `/uploads/profiles/${req.file.filename}`;
    }

    if (Object.keys(updateData).length > 0) {
      await User.update(updateData, { where: { id: req.user.id } });
    }

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'department', 'team', 'profile_picture']
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error updating profile');
  }
});

// DELETE /api/users/profile-picture
// Remove user profile picture
router.delete('/profile-picture', auth, async (req, res) => {
  try {
    await User.update({ profile_picture: null }, { where: { id: req.user.id } });
    
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'department', 'team', 'profile_picture']
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error deleting profile picture');
  }
});

module.exports = router;
