const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment'); // Ensure the correct path to the model

// Get the Assignments Collection
router.get('/collection', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 }); // Sort by due date ascending
    res.render('assignments/collection', { assignments }); // Render the collection.ejs file
  } catch (err) {
    console.error('Error fetching assignments for collection:', err.message);
    res.status(500).send('Server Error');
  }
});

// Get all assignments (for the index page)
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 }); // Sort by due date ascending
    res.render('assignments/index', { assignments }); // Updated to point to assignments/index.ejs
  } catch (err) {
    console.error('Error fetching assignments:', err.message);
    res.status(500).send('Server Error');
  }
});

// Render the Edit Form
router.get('/:id/edit', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).send('Assignment not found');
    }

    res.render('assignments/edit', { assignment }); // Ensure the path to edit.ejs is correct
  } catch (err) {
    console.error('Error fetching assignment for edit:', err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new assignment directly in the index.ejs form
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

// Update an assignment
router.put('/:id', async (req, res) => {
  const { title, description, dueDate } = req.body;

  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!assignment) {
      return res.status(404).send('Assignment not found');
    }

    console.log('Assignment updated successfully:', assignment);
    res.redirect('/assignments');
  } catch (err) {
    console.error('Error updating assignment:', err.message);
    res.status(500).send('Server Error');
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




