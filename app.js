const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
require('body-parser');
require('./config/database');
require('dotenv').config();
const http = require('http');

const adminRouter = require('./routes/admin');
const partnerRouter = require('./routes/partner');
const userRouter = require('./routes/user');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: process.env.Client_Side_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/partner', partnerRouter);

const httpServer = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(httpServer, {
  cors: {
    origin: process.env.Client_Side_URL,
    methods: ['GET', 'POST'],
  },
});

const port = process.env.PORT;
httpServer.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

io.on('connection', (socket) => {
  // console.log('A user connected', socket.id);
  socket.on('message', (message) => {
    // console.log('Message:', message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    // console.log('A user disconnected', socket.id);
  });
});

app.use((req, res, next) => {
  next(createError(404));
});


app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

module.exports = app;






// const createError = require('http-errors');
// const express = require('express');
// const path = require('path');
// // const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// let cors= require('cors')
// const bodyParser = require('body-parser');
// require('./config/database'); 
// require('dotenv').config() 


// const adminRouter = require('./routes/admin');
// const partnerRouter=require('./routes/partner')
// const userRouter = require('./routes/user');


// const app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// // app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // Parse application/x-www-form-urlencoded
// // app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());

// // Parse application/json
// // app.use(bodyParser.json());

// app.use(cors({
//   origin: ["http://localhost:3000"],
//   methods: ["GET", "POST"],
//   credentials: true
// }))



// app.use('/', userRouter);
// app.use('/admin', adminRouter);
// app.use('/partner',partnerRouter)


// // error handler
// app.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
//   res.render('error');
// });


// app.listen(process.env.PORT,()=>{
//   console.log("server started")
// })

// module.exports = app;



