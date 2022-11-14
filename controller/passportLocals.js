const User = require('../model/user');
const bcryptjs = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'psw'}, (email, psw, done)=>{
        User.findOne({email: email}, (err, data)=>{
            if(err) throw err;
            // {console.log(err)};
            
            if(!data){
                 return done(null, false, { message : 'user does not exist!'});
            }
            // if there is data
            bcryptjs.compare(psw, data.password, (err, match)=>{
                if(err){
                    return done(null, false)
                }
                if(!match){
                    return done(null, false, { message : 'password does not match!'})
                }
                if(match){
                    return done (null, data)
                }
            })
            
        })
    }));

    passport.serializeUser(function(user, done){
        done(null, user.id);
    })

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        })
    })
}