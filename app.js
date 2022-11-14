const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const csrf = require('csurf');
const expressSession = require('express-session');
const  mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const MemoryStore = require('memorystore')(expressSession); // pass express session into memory store
const passport = require('passport');
const flash = require('connect-flash');
const authroutes = require('./router/authroutes');
const app = express();
port = 3000;

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', './layout/main-layout');
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));

// mongodb connection
const dbconn = require('./config/mongoconn'); // require connection from config folder
// connect to db
mongoose.connect(dbconn, {useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>{
    console.log('connected to db')
})
.catch((err)=>{
    console.log(err)
;})

// use cookiep-parser
app.use(cookieParser('natLove')) // pass the same secret from expression session so it works well with express.

// use express session
app.use(expressSession({
    secret: 'natLove',
    resave: true,
    saveUninitialized: false,
    maxAge: 86400000,
    // maxAge: 60 * 1000,
    // from memorystore
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
}));

// use csrf
app.use(csrf());

// use passport
app.use(passport.initialize());
app.use(passport.session());

// use connectflash
app.use(flash());
app.use(function (req, res, next) {
    res.locals.error = req.flash('error');
    next();
});

// set up flasmessages
// app.use(function(req,res, next){
//    res.locals.error = req.connectFlash('error');
//    next();
// })
// use authroutes
app.use(authroutes);
app.use((req,res)=>{
    res.status(404).render('404');
})
app.listen(port, ()=>{
    console.log(`listening to request at ${port}`)
})