const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// POST /api/reviews/submit
// Submit self/peer review
router.post('/submit', auth, async (req, res) => {
  try {
    const { taskId, content } = req.body;

    if (!taskId || !content) {
      return res.status(400).json({ message: 'Fill all required fields' });
    }

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assignee_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to submit this review' });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    let expired = false;

    if (currentYear > task.year) expired = true;
    else if (currentYear === task.year) {
      if (task.quarter === 'Q1' && currentMonth > 3) expired = true;
      if (task.quarter === 'Q2' && currentMonth > 7) expired = true;
      if (task.quarter === 'Q3' && currentMonth > 11) expired = true;
    }

    if (expired) {
      return res.status(403).json({ message: 'The submission window for this quarter has expired.' });
    }

    // Save the review
    await Review.create({
      task_id: task.id,
      reviewer_id: req.user.id,
      reviewee_id: task.reviewee_id,
      content
    });

    // Mark task as completed
    task.status = 'completed';
    await task.save();

    // Create a notification for the reviewer's manager
    const reviewer = await User.findByPk(req.user.id);
    if (reviewer && reviewer.manager_id) {
      await Notification.create({
        user_id: reviewer.manager_id,
        message: `${reviewer.name} has submitted their assigned review.`
      });
    }

    res.json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/reviews/subordinates
// Manager fetches completed reviews for direct reports
router.get('/subordinates', auth, async (req, res) => {
  try {
    if (!['team_manager', 'department_manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find all subordinates
    const subordinates = await User.findAll({
      where: { manager_id: req.user.id },
      attributes: ['id']
    });

    const subordinateIds = subordinates.map(sub => sub.id);

    // Fetch reviews where the reviewee is a subordinate
    const reviews = await Review.findAll({
      where: {
        reviewee_id: subordinateIds
      },
      include: [
        { model: Task, attributes: ['type', 'quarter', 'year'] },
        { model: User, as: 'reviewer', attributes: ['id', 'name'] },
        { model: User, as: 'reviewee', attributes: ['id', 'name'] }
      ]
    });

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
