const express = require("express");
const app = express();

// Require hbs (Handlebars) view engine, path, and userRouters
const hbs = require("hbs");
const path = require("path");
const userRouter = require("./routers/userRouters");

// Define paths for Express config
const publicDir = path.join(__dirname, "../resources/public");
const layoutDir = path.join(__dirname, "../resources/layouts");
const viewsDir = path.join(__dirname, "../resources/views");

// Set up static directory to serve
app.use(express.static(publicDir));

// Parse incoming request bodies in a middleware before your handlers
app.use(express.urlencoded({ extended: true }));

// Set up view engine and views directory
app.set("view engine", 'hbs');
app.set("views", viewsDir);

// Register partials directory
hbs.registerPartials(layoutDir);

// Use userRouter
app.use(userRouter);

// Handle 404 errors
app.all("*", (req, res) => {
    res.render("error", {
        pageTitle: "error 404"
    })
});

// Export app
module.exports = app;
