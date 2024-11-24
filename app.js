require('dotenv').config(); // Load environment variables
const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./Config/db'); // Ensure capitalization matches your file structure
const assignmentRouter = require('./routes/assignment'); // Adjust to match your renamed `routes/assignment.js`

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data from forms
app.use(methodOverride('_method')); // Enable PUT and DELETE via query parameters (_method)
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (CSS, images)

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.redirect('/assignments'); // Redirect root URL to `/assignments`
});
app.use('/assignments', assignmentRouter); // Mount assignmentRouter for `/assignments`

// Start the server
const PORT = process.env.PORT || 3000; // Default to port 3000 or use environment variable
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



