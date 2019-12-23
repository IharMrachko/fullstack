const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const keys = require('./config/keys');
const authRotes = require('./routes/auth');
const analyticsRotes = require('./routes/analitics');
const categoryRotes = require('./routes/category');
const orderRotes = require('./routes/order');
const positionRotes = require('./routes/position');
const app = express();


mongoose.connect(keys.mongoUri, {
    useNewUrlParser: true

}).then(() => {
    console.log("Mongo Работает")
}).catch((err) => console.log(err));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('cors')());

app.use('/api/auth', authRotes);
app.use('/api/analytics', analyticsRotes);
app.use('/api/category', categoryRotes);
app.use('/api/order', orderRotes);
app.use('/api/position', positionRotes);


app.use(bodyParser.json());
const distDir = __dirname + "/dist/client";
app.use(express.static(distDir));

module.exports = app;
