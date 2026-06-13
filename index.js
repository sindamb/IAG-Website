const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (if needed)
app.use(express.static("public"));

// Sample route with projects array
app.get("/", (req, res) => {
    const scholarships = [];

    // Pass projects to the view
    res.render("index", { projects });

    // Pass scholarships to the view
    res.render("index", { scholarships });
});

// Start server
app.listen(PORT, () => {
    console.log("Server is running on http://0.0.0.0:${PORT}");
});
