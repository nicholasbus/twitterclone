require('dotenv').config();

const app = require('express')();

const allPaths = require("./tweets");

app.set('view engine', 'ejs');

app.use("/", allPaths);

app.listen(5000, () => console.log('App on http://localhost:5000'));
