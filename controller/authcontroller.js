const User = require('../model/user');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
// require passportLocals
require('./passportLocals')(passport);

// my middleware for checking authenticated users.
const checkAuth = function(req,res,next){
    if(req.isAuthenticated()){
        // to prevent caching
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    }else{
        res.redirect('/login')
    }
}

const homePage = (req, res)=>{
if(req.isAuthenticated()){
    res.render('index', {username: req.user.username, loggedin: true});  
}
  res.render('index', {username: '', loggedin: false});
}

const getLogin = (req, res)=>{
    if(req.isAuthenticated()){
        res.render('login', {csrfToken: req.csrfToken(), loggedin: true}); 
    }
    res.render('login', {csrfToken: req.csrfToken(), loggedin: false}); 
  }

const getSignup = (req, res)=>{
        res.render('signup', {layout: './layout/sub-layout', csrfToken: req.csrfToken()}); 
  }

  const postSignup = (req, res)=>{
     // get form values
     const {email, uname, psw, psw_repeat } = req.body;
     // check if values are empty,
     if(!email || !uname || !psw || !psw_repeat){
         // re-render the page again
            res.render('signup', {layout: './layout/sub-layout', err: 'All Fields required', csrfToken: req.csrfToken()}); 
     } else if(psw != psw_repeat){
            // re-render the page again
                res.render('signup', {layout: './layout/sub-layout', err: 'psw and repeat-psw do not match', csrfToken: req.csrfToken()}); 
     }
     else{
                 // check if user exist in db
                 User.findOne({$or: [{email : email}, {username : uname}]}, function(err, data){
                    if(err) throw err
                    if(data){
                         // tell the user there is a match
                            res.render('signup', {layout: './layout/sub-layout', err: 'User already exist', csrfToken: req.csrfToken()}); 
                    
                    } else{
                        // generate a salt using bcrypt,
                        bcryptjs.genSalt(12, function(err, salt){
                            if(err) throw err
                            if(salt){
                                bcryptjs.hash(psw, salt, function(err, hash){
                                    if(err) throw err
                                    // ELSE create a new instance of a user
                                   const newUser = new User({
                                       username : uname,
                                       email: email,
                                       password: hash,
                                       googleId: null,
                                       provider: 'email', 
                                    })
                                    newUser.save((err, data)=>{
                                        if(err) throw err
                                        res.redirect('/login')
                                    })
                                })
                            }
                        })
                        //hash password using bcrypt,
                        // save user in database,
                        // login user
                    }
                });
     }
  }

  // login in
const postLogin = (req, res, next)=>{
   passport.authenticate('local',{
       failureRedirect: '/login',
       successRedirect: '/profile',
       failureFlash: true

   })(req, res, next);
}

// logout
const logout = (req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy(function(err){
            res.redirect('/');
        })
      });

}

  const getProfile = (req, res)=>{
        // console.log(req.user);
        res.render('profile', {username: req.user.username, loggedin: true});  
        // if(req.isAuthenticated()){
        //     res.render('profile', {username: req.user.username, loggedin: true});  
        // }
        // res.render('profile', {username: req.user.username, loggedin: false});
    
   
  }

module.exports = {
    homePage, getLogin, getSignup, getProfile, postSignup, postLogin,checkAuth, logout
}