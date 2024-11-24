const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment'); // Ensure the correct path to the model

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 }); // Sort by due date ascending
    res.render('index', { assignments }); // Pass assignments to the view
  } catch (err) {
    console.error('Error fetching assignments:', err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new assignment directly in the index.ejs form (No separate /new route required)
router.post('/', async (req, res) => {
  const { title, description, dueDate } = req.body;

  // Validate input
  if (!title || !description || !dueDate) {
    return res.status(400).send('All fields are required.');
  }

  try {
    await Assignment.create({ title, description, dueDate });
    console.log('Assignment added successfully:', { title, description, dueDate });
    res.redirect('/assignments');
  } catch (err) {
    console.error('Error creating assignment:', err.message);
    res.status(400).send('Error creating assignment');
  }
});

// Delete an assignment
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      console.log(`Assignment with id ${req.params.id} not found.`);
      return res.status(404).send('Assignment not found');
    }

    await assignment.deleteOne();
    console.log(`Assignment with id ${req.params.id} deleted successfully.`);
    res.redirect('/assignments');
  } catch (err) {
    console.error('Error deleting assignment:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

