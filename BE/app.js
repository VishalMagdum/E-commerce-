const express = require('express')
const app = express()
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

var mongoose = require('mongoose')
const { dbUrl } = require('./config/dbconfig')

app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(cookieParser());
app.use(fileUpload())
app.set('veiw engine', 'ejs')

const products = require('./routes/productRoutes')
const users = require('./routes/userRoutes')
const orders = require('./routes/orderRoutes')
const payment = require("./routes/paymentRoutes")

app.use('/products', products)
app.use('/users', users)
app.use('/shope', orders)
app.use('/payment', payment)





mongoose.set('strictQuery', true);
mongoose.connect(dbUrl, () => console.log("DataBase Connected"))





// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});


module.exports = app