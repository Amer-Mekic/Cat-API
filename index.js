/**
 * @fileoverview
 * This JavaScript code sets up an Express.js server that serves static files and handles two routes: the root route ("/") and the "/get-a-cat" route. It also makes API requests to fetch cat data from two different endpoints.
 *
 * @requires express
 * @requires axios
 * @requires dotenv
 */

import express from "express";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

/**
 * @route GET /
 * @description Root route that responds with an HTML template rendered using EJS (Embedded JavaScript) with initial values for `name` and `cat` set to `false`.
 */
app.get("/", (req, res) => {
    res.render("index.ejs", { name: false, cat: false });
});

/**
 * @route GET /get-a-cat
 * @description Makes two asynchronous API requests in parallel using `Promise.all()`:
 *   - Fetches a random cat image from "https://api.thecatapi.com/v1/images/search".
 *   - Fetches a cat name from "https://tools.estevecastells.com/api/cats/v1".
 * Renders the same EJS template as the root route but with updated values for `name` and `cat`.
 */
app.get("/get-a-cat", async (req, res) => {
    try {
        const [response1, response2] = await Promise.all([
            axios.get('https://api.thecatapi.com/v1/images/search'),
            axios.get('https://tools.estevecastells.com/api/cats/v1')
        ]);

        const catData = response1.data;
        const name = response2.data;

        res.render("index.ejs", {
            name: name,
            cat: catData
        });

    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Error fetching data');
    }
});

// Start the server
app.listen(port, () => {
    console.log("Server active on port " + port);
});
