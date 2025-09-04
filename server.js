const fs = require('fs');
const path = require('path');

function readJSON(filePath) {
  try {
    const data = fs.readFileSync(path.join(__dirname, filePath));
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(data, null, 2));
}



const multer = require('multer');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

let scholarships = [
  { 
    title: "Young Astronomer Award", 
    desc: "Supporting students who excel in astronomy research and projects.",
    file: null  // <-- add this line
  },
  { 
    title: "Community Outreach Scholarship", 
    desc: "Helping participants organize astronomy workshops and events in schools.",
    file: null  // <-- add this line
  }
];


const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'IAGSecret123',
  resave: false,
  saveUninitialized: true
}));

// Data storage
let projects = [
  { title: "Telescope Initiative", desc: "Providing access to telescopes for students." },
  { title: "Astro Workshops", desc: "Organizing educational workshops." }
];
let donations = [];

const adminCredentials = { username: "admin", password: "admin123" };

// Routes
app.get('/scholarship/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const scholarship = scholarships[id];
  if(scholarship){
    res.render('scholarship-detail', { scholarship });
  } else {
    res.status(404).send("Scholarship not found");
  }
});


app.post('/donate', (req, res) => {
  const { name, email, amount } = req.body;
  donations.push({ name, email, amount });
  res.render('index', { projects, scholarships, donationMessage: `Thank you ${name} for donating $${amount}!` });
});

app.post('/admin/add-project', (req, res) => {
  if(req.session.user){
    const { title, desc } = req.body;
    projects.push({ title, desc });
    writeJSON('data/projects.json', projects);  // save to file
    res.redirect('/admin');
  } else {
    res.redirect('/login');
  }
});

app.post('/admin/add-scholarship', upload.single('file'), (req, res) => {
  if(req.session.user){
    const { title, desc } = req.body;
    let file = req.file ? `/uploads/${req.file.filename}` : null;
    scholarships.push({ title, desc, file });
    writeJSON('data/scholarships.json', scholarships);  // save to file
    res.redirect('/admin');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if(username === adminCredentials.username && password === adminCredentials.password){
    req.session.user = username;
    res.redirect('/admin');
  } else {
    res.render('login', { error: "Invalid credentials!" });
  }
});

app.get('/admin', (req, res) => {
  if(req.session.user){
    res.render('admin', { projects, donations, scholarships });
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.render('index', { projects, scholarships, donationMessage: null });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
