const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const upload = multer();
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://sumukeshmopuram1:q47rfTFHMkmrHy16@messages.2nguodb.mongodb.net/?retryWrites=true&w=majority&appName=Messages", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Model
const Message = require('./models/message');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none()); // Handle multipart/form-data
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    success: req.query.success,
    error: req.query.error 
  });
});

app.post('/contact', async (req, res) => {
  try {
    if (!req.body || !req.body.name || !req.body.email || !req.body.message) {
      throw new Error('Missing required fields');
    }
    const { name, email, message } = req.body;
    await Message.create({ name, email, message });
    res.redirect('/?success=1');
  } catch (error) {
    console.error('Submission Error:', error);
    res.redirect('/?error=1');
  }
});

app.listen(port, () => 
  console.log(`Server running on http://localhost:${port}`));