require('dotenv').config();

const app = require('express')();

const allPaths = require("./paths/tweets");

app.use(require('express').static('./public'));
app.set('view engine', 'ejs');


app.use(require('body-parser').urlencoded({extended: true}));
app.use("/", allPaths);

app.listen(5000, () => console.log('App on http://localhost:5000'));
