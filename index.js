import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.render("index.ejs", {name:false, cat : false});
});

app.get("/get-a-cat", async (req, res) => {
    try {
        const [response1, response2] = await Promise.all([
            axios.get('https://api.thecatapi.com/v1/images/search'),
            axios.get('https://tools.estevecastells.com/api/cats/v1')
        ]);

        const catData = response1.data;
        const name = response2.data;

        console.log(catData);
        console.log(name);

        res.render("index.ejs", {
            name:name,
            cat:catData
        });

    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Error fetching data');
    }
});

app.listen(port, () => {
    console.log("Server active on port "+port);
});