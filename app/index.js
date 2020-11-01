require('dotenv').config();

const app = require('express')();

const allPaths = require("./paths/tweets");

app.use(require('express').static('./public'));
app.set('view engine', 'ejs');


app.use(require('body-parser').urlencoded({extended: true}));
app.use("/", allPaths);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('App on http://localhost:5000'));
