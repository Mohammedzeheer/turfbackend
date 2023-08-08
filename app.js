const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
let cors= require('cors')
const bodyParser = require('body-parser');
require('./config/database'); 
require('dotenv').config() 


const adminRouter = require('./routes/admin');
const partnerRouter=require('./routes/partner')
const userRouter = require('./routes/user');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Parse application/json
// app.use(bodyParser.json());

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}))



app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/partner',partnerRouter)


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(process.env.PORT,()=>{
  console.log("server started")
})

module.exports = app;








// mongodb+srv://zeheerzak:313786aA@cluster0.qujhexw.mongodb.net/turf
// mongodb+srv://zeheerzak:313786aA@cluster0.ydbdotz.mongodb.net/turf   //new datABASE
// mongoose.connect('mongodb://127.0.0.1:27017/turf', {useNewUrlParser: true})
// .then(() => {
//   console.log("Database Connected");
// }).catch((error) => {
//   console.log(error.message)
// })