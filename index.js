const express = require('express');
const app = express();
const path = require('path');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (optional)
app.use(express.static('public'));

// Route for homepage
app.get('/', (req, res) => {
  res.render('index'); // This will render views/index.ejs
});

// Bind to Render's port
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(Server is running on http://0.0.0.0:${PORT});
});
