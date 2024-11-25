const express = require('express'); // Import Express to create a router for handling requests
const router = express.Router(); // Create a router instance to define routes
const Assignment = require('../models/Assignment'); // This Ensures the correct path to the model

// Get the Assignments Collection
router.get('/collection', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 }); // Sort by due date ascending
    res.render('assignments/collection', { assignments }); // Render the collection.ejs file
  } catch (err) {
    console.error('Error fetching assignments for collection:', err.message); // Log error message if fetching assignments fails
    res.status(500).send('Server Error'); // Send a 500 Internal Server Error response
  }
});

// Get all assignments (for the index page)
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 }); // Sort by due date ascending
    res.render('assignments/index', { assignments }); // Updated to point to assignments/index.ejs
  } catch (err) {
    console.error('Error fetching assignments:', err.message);// Log error message if fetching assignments fails
    res.status(500).send('Server Error');// Send a 500 Internal Server Error response
  }
});

// Render the Edit Form
router.get('/:id/edit', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id); // Find a specific assignment by its unique ID

    if (!assignment) {
      return res.status(404).send('Assignment not found'); // If the assignment doesn't exist, send a 404 response
    }

    res.render('assignments/edit', { assignment }); // Render the edit.ejs file and pass the assignment data to the template
  } catch (err) {
    console.error('Error fetching assignment for edit:', err.message);
    res.status(500).send('Server Error'); // Send a 500 Internal Server Error response
  }
});

// Add a new assignment directly in the index.ejs form
router.post('/', async (req, res) => {
  const { title, description, dueDate } = req.body; // Extract the assignment details from the request body

  // Validate input
  if (!title || !description || !dueDate) {
    return res.status(400).send('All fields are required.');
  }

  try {
    await Assignment.create({ title, description, dueDate }); // Create a new assignment document in the database
    console.log('Assignment added successfully:', { title, description, dueDate });  // Log success message
    res.redirect('/assignments');
  } catch (err) {
    console.error('Error creating assignment:', err.message);
    res.status(400).send('Error creating assignment');
  }
});

// Update an assignment
router.put('/:id', async (req, res) => {
  const { title, description, dueDate } = req.body; // Extract updated details from the request body

  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id, // Find the assignment by its ID
      { title, description, dueDate }, // Update the title, description, and due date
      { new: true, runValidators: true } // Return the updated document
    );

    if (!assignment) {
      return res.status(404).send('Assignment not found'); // If the assignment doesn't exist, send a 404 response
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
    const assignment = await Assignment.findById(req.params.id); // Find the assignment by its unique ID

    if (!assignment) {
      console.log(`Assignment with id ${req.params.id} not found.`);
      return res.status(404).send('Assignment not found');
    }

    await assignment.deleteOne(); // Delete the assignment from the database
    console.log(`Assignment with id ${req.params.id} deleted successfully.`);
    res.redirect('/assignments');  // Redirect to the assignments index page
  } catch (err) {
    console.error('Error deleting assignment:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; // Export the router to be used in app.js




