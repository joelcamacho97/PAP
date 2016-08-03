var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');
var mkdirp = require('mkdirp');
module.exports = function (passport, app) {




    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // LOCAL SIGNUP

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            var nome = req.body.nome;
            var usuario = req.body.usuario;


            User.findOne({
                'local.usuario': usuario
            }, function (err, user) {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, false, req.flash('signupMessage', 'O usuario esta em uso !'));
                }

                else {

                     User.findOne({
                'local.email': email
            }, function (err, user) {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, false, req.flash('signupMessage', 'O email esta em uso !'));
                }
                if (nome == '') {
                    return done(null, false, req.flash('signupMessage', 'Insira o nome !'));
                }



                if (usuario == '') {
                    return done(null, false, req.flash('signupMessage', 'Insira o nome de usuario !'));
                }
                else {


                    var newUser = new User();
                    console.log(nome);
                    newUser.local.nome = nome;
                    newUser.local.usuario = usuario;
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.date = new Date();

                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);

                    });


                }
            });
                }
            });





           
        }));
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({
                'local.email': email
            }, function (err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'Utilizador' + ' " ' + email + ' " ' + 'não encontrado ...')); // req.flash is the way to set flashdata using connect-flash
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Password Errada.'));
                if (user) {
                    return done(null, user);
                }
            });
        }));
};