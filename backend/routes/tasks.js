const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// POST /api/tasks/assign-self
// Manager assigns a self-review to an employee
router.post('/assign-self', auth, async (req, res) => {
  try {
    const { employeeIds, message, quarter, year } = req.body;

    if (!employeeIds || employeeIds.length === 0) {
      return res.status(400).json({ message: 'No employees selected' });
    }

    const tasks = employeeIds.map(empId => ({
      type: 'self_review',
      assignee_id: empId,
      reviewee_id: empId,
      quarter,
      year,
      message,
      status: 'pending'
    }));

    await Task.bulkCreate(tasks);

    // Create notifications for assignees
    const notifications = employeeIds.map(empId => ({
      user_id: empId,
      message: `You have been assigned a Self Review for ${quarter} ${year}.`
    }));
    await Notification.bulkCreate(notifications);

    res.json({ message: 'Self-reviews assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/tasks/assign-peer
// Manager assigns a peer-review to a reviewer
router.post('/assign-peer', auth, async (req, res) => {
  try {
    const { reviewerId, peerIds, message, quarter, year } = req.body;

    if (!reviewerId) {
      return res.status(400).json({ message: 'Reviewer not selected' });
    }

    if (!peerIds || peerIds.length !== 2) {
      return res.status(400).json({ message: 'Select exactly 2 peers' });
    }

    const tasks = peerIds.map(peerId => ({
      type: 'peer_review',
      assignee_id: reviewerId,
      reviewee_id: peerId,
      quarter,
      year,
      message,
      status: 'pending'
    }));

    await Task.bulkCreate(tasks);

    // Create a notification for the reviewer
    await Notification.create({
      user_id: reviewerId,
      message: `You have been assigned to peer review 2 colleagues for ${quarter} ${year}.`
    });

    res.json({ message: 'Peer-reviews assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/tasks/my-tasks
// Employee/Reviewer fetches their pending tasks
router.get('/my-tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        assignee_id: req.user.id,
        status: 'pending'
      },
      include: [
        { model: User, as: 'reviewee', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
