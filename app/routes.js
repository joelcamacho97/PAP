module.exports = function (app, passport, fs) {
    var usage = require('usage');
    var getSize = require('get-folder-size');
    var pid = process.pid;
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    app.get('/login', login, function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/upload/inicio', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', login, function (req, res, done) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/upload/inicio', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    app.post('/signup_admin', isLoggedIn, admin, function (req, res, next) {
        var User = require('../app/models/user');

        User.findOne({
            'local.email': req.body.email
        }, function (err, user) {
            console.log(user)
            if (err) {
                return (err);
            }
            else if (user) {
                res.json({
                    result1: 'O usuario é invalido !!!!'
                });
                res.end(next);
            }
            else if (req.body.nome == '') {
                res.json({
                    result1: 'O usuario é invalido !!!!'
                });
                res.end(next);
            }
            else if (req.body.usuario == '') {
                res.json({
                    result1: 'O usuario é invalido !!!!'
                });
                res.end(next);
            }
            else if (req.body.password == '') {
                res.json({
                    result1: 'A password é invalida !!!!'
                });
                res.end(next);
            }
            else {
                var newUser = new User();
                newUser.local.nome = req.body.nome;
                newUser.local.usuario = req.body.usuario;
                newUser.local.email = req.body.email;
                newUser.local.password = newUser.generateHash(req.body.password);
                newUser.local.date = new Date();
                newUser.save(function (err) {
                    if (err)
                        throw err;
                    else
                        res.redirect('back');
                });
            }
        });
    });

 

    app.get('/upload/inicio', isLoggedIn, function (req, res) {



        usage.lookup(pid, function (err, result) {
            var cpu = result.cpu.toFixed(2)
            if (err) {
                cpu = 'Erro';
            };

            getSize('./uploads/' + req.user.id + '/' + req.user.local.email, function (err, size) {
                if (err) {
                    size = '0';
                }
                var date = new Date();
                res.render('upload/inicio.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    title: "Inicio",
                    cpu: cpu,
                    espaço: (size / 1024 / 1024).toFixed(2) + ' Mb',
                    perc: ((size / 1024 / 1024) * 100 / req.user.local.size).toFixed(2),
                    data: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                });
            });
        });
        var fs = require('fs-extra');
        fs.ensureDir('./uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded/');
    });

    app.get('/upload/Updates', isLoggedIn, function (req, res) {
        res.render('upload/updates.ejs', {
            title: "Updates",
            user: req.user
        });

    });

    app.get('/upload/user', isLoggedIn, function (req, res) {

        usage.lookup(pid, function (err, result) {
            var cpu = result.cpu.toFixed(2)
            if (err) {
                cpu = 'Erro';
            };

            getSize('./uploads/' + req.user.id + '/' + req.user.local.email, function (err, size) {
                if (err) {
                    throw err;
                }
                getSize('./uploads/', function (err, total) {
                    if (err) {
                        total = '0';
                    }
                    var date = new Date();

                    if (req.user.local.su == 'admin') {

                        res.render('upload/user-admin.ejs', {
                            user: req.user,
                            title: "Admin",
                            cpu: cpu,
                            espaço: (size / 1024 / 1024).toFixed(2) + ' Mb',
                            perc: ((size / 1024 / 1024) * 100 / req.user.local.size).toFixed(2),
                            data: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                            message: req.flash('erro'),
                            message2: req.flash('erro_2'),
                            message3: req.flash('erro_3'),
                            total_1: (total / 1024 / 1024).toFixed(2) + ' Mb',
                            total_2: ((total / 1024 / 1024) * 100 / 1000).toFixed(2),
                            date: date
                        });
                    }
                    else {
                        res.render('upload/user.ejs', {
                            user: req.user,
                            title: "Usuario",
                            cpu: cpu,
                            espaço: (size / 1024 / 1024).toFixed(2) + ' Mb',
                            perc: ((size / 1024 / 1024) * 100 / req.user.local.size).toFixed(2),
                            data: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                            message: req.flash('erro'),
                            date: date
                        });
                    }
                });
            });
        });
    });

    app.post('/user', isLoggedIn, function (req, res) { //ALTERA OS DADOS DA CONTA E RENOMEIA A PASTA UPLOADS MODIFICADO O EMAIL !! TAMBEM VERIFICA AS VARIAS IPOTEESES DE SITUÇÕES QUE POSSAM ACONTECER !!
        var User = require('../app/models/user');

        User.findOne(({
            'local.usuario': req.body.usuario
        }), function (err, account) {
            if (account && req.body.usuario != req.user.local.usuario) {
                return (null, false, req.flash('erro', 'O usuario é invalido !!!!')),
                    res.redirect('back');
            }
            else if (req.body.usuario == '') {
                return (null, false, req.flash('erro', 'O email é invalido !!!!')),
                    res.redirect('back');
            }
            else {
                User.findOne(({
                    'local.email': req.body.email
                }), function (err, account) {
                    if (account && req.body.email != req.user.local.email) {
                        return (null, false, req.flash('erro', 'O email (' + req.body.email + ') ja esta em uso !!!!')),
                            res.redirect('back');
                    }
                    else if (req.body.email == '') {
                        return (null, false, req.flash('erro', 'O email é invalido !!!!')),
                            res.redirect('back');
                    }
                    else {
                        fs.rename('./uploads/' + req.user.id + '/' + req.user.local.email, './uploads/' + req.user.id + '/' + req.body.email, (err) => {
                            User.findByIdAndUpdate(req.user.id, {
                                $set: {
                                    'local.nome': req.body.nome,
                                    'local.usuario': req.body.usuario,
                                    'local.email': req.body.email
                                }
                            }, function (err) {
                                if (err) res.redirect('back');
                                res.redirect('back');
                            });
                        });
                    }
                });
            }
        });

    });


    app.post('/user/admin', isLoggedIn, admin, function (req, res, next) { //ALTERA OS DADOS DA CONTA E RENOMEIA A PASTA UPLOADS MODIFICADO O EMAIL !! TAMBEM VERIFICA AS VARIAS IPOTEESES DE SITUÇÕES QUE POSSAM ACONTECER !!
        var User = require('../app/models/user');

        User.findOne(({
            '_id': req.body.id
        }), function (err, id) {

            User.findOne(({
                'local.usuario': req.body.usuario
            }), function (err, usuario) {

                if (usuario && req.body.usuario != id.local.usuario) {
                    res.json({
                        result: 'O usuario é invalido !!!!'
                    });
                    res.end(next);
                }
                else if (req.body.usuario == '') {
                    res.json({
                        result: 'Insira o nome de usuario !!!!'
                    });
                    res.end(next);
                }

                else {

                    User.findOne(({
                        'local.email': req.body.email
                    }), function (err, email) {

                        if (email && req.body.email != id.local.email) {
                            res.json({
                                result: 'O email (' + req.body.email + ') ja esta em uso !!!!'
                            });
                            res.end(next);
                        }
                        else if (req.body.email == '') {
                            res.json({
                                result: 'O email é invalido !!!!'
                            });
                            res.end(next);
                        }
                        else if (req.body.size == '' || req.body.size <= 0) {
                            res.json({
                                result: 'O tamanho é invalido !!!!'
                            });
                            res.end(next);
                        }
                        else {
                            fs.rename('./uploads/' + id.id + '/' + id.local.email, './uploads/' + req.body.id + '/' + req.body.email, (err) => {
                                User.findByIdAndUpdate(id.id, {
                                    $set: {
                                        'local.nome': req.body.nome,
                                        'local.usuario': req.body.usuario,
                                        'local.email': req.body.email,
                                        'local.size': req.body.size,
                                        'local.su': req.body.tipo,
                                        'local.estado': req.body.estado
                                    }
                                }, function (err) {
                                    if (err) res.redirect('back');
                                    res.redirect('back');
                                });
                            });
                        }
                    });
                }
            });
        });
    });

    app.post('/user/admin/pass', isLoggedIn, admin, function (req, res, next) { //ALTERA OS DADOS DA CONTA E RENOMEIA A PASTA UPLOADS MODIFICADO O EMAIL !! TAMBEM VERIFICA AS VARIAS IPOTEESES DE SITUÇÕES QUE POSSAM ACONTECER !!
        var User = require('../app/models/user');
        var bcrypt = require('bcrypt-nodejs');
        User.findOne(({
            '_id': req.body.id
        }), function (err, id) {

            if (req.body.password == '') {
                res.json({
                    result: 'A password é invalida !!!!'
                });
                res.end(next);
            }
            else {


                User.findByIdAndUpdate(id.id, {
                    $set: {
                        'local.password': bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
                    }
                }, function (err) {
                    if (err) res.redirect('back');
                    res.redirect('back');
                });
            }
        });
    });


    app.post('/user/pass/alt', isLoggedIn, function (req, res, next) { //ALTERA OS DADOS DA CONTA E RENOMEIA A PASTA UPLOADS MODIFICADO O EMAIL !! TAMBEM VERIFICA AS VARIAS IPOTEESES DE SITUÇÕES QUE POSSAM ACONTECER !!
        var User = require('../app/models/user');
        var bcrypt = require('bcrypt-nodejs');
        User.findOne(({
            '_id': req.user.id
        }), function (err, id) {

            if (req.body.password == '') {
                res.json({
                    result: 'A password é invalida !!!!'
                });
                res.end(next);
            }
            else {

                User.findByIdAndUpdate(req.user.id, {
                    $set: {
                        'local.password': bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
                    }
                }, function (err) {
                    if (err) res.redirect('back');
                    res.redirect('back');
                });
            }
        });
    });


    app.get('/upload/Uploads', isLoggedIn, function (req, res) {
        var ee = require('easy-encryption');
        var ciphertext = ee.encrypt('password', req.user.id + '/' + req.user.local.email);
        res.render('upload/uploads.ejs', {
            title: "Uploads",
            user: req.user,
            link: ciphertext
        });
    });

    app.get('/upload/testes', function (req, res) {
        res.render('upload/testes.ejs', {
            title: "testes",
            user: req.user
        });
    });

    app.get('/user/apagar', isLoggedIn, function (req, res) {
        res.render('upload/testes.ejs', {
            title: "testes",
            user: req.user
        });
    });

    app.get('/upload/lixo', isLoggedIn, function (req, res) {
        res.render('upload/lixo.ejs', {
            title: "Lixo",
            user: req.user
        });
    });

    app.get('/remover/:id(*)', isLoggedIn, admin, function (req, res) {

        // console.log(req.body.id)

        var User = require('../app/models/user');
        User.findOne({
            _id: req.params.id
        }, function (err, doc) {
            console.log(doc)
            if (err) {
                res.redirect('back');
            }
            else if (doc) {
                doc.remove({}, function (err, removed) {
                    res.redirect('back');
                });
            }
            else {
                res.redirect('back');
            }

        });

    });

    app.get('/db', admin, isLoggedIn, function (req, res) { //vai buscar os dados a base de dados !!
        var User = require('../app/models/user');
        User.find({
            // 'local.su': 'usuario'
        }, function (err, user) {
            if (err) {
                user = 'Erro'
            }
            res.json(user);
        });
    });

    app.get('/db/:id(*)', isLoggedIn, admin, function (req, res) { //vai buscar os dados a base de dados !!
        var id = req.params.id;
        console.log(id)
        var User = require('../app/models/user');
        User.findOne({
            '_id': id
        }, function (err, user) {
            if (err) {
                user = 'Erro'
            }
            res.json(user);
        });
    });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};




// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function login(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        res.redirect('/upload/inicio');


    // if they aren't redirect them to the home page
    return next();
}

function admin(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.user.local.su == 'admin')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}