module.exports = function (app, fs) {
    var User = require('../app/models/user');
    var busboy = require('connect-busboy');
    app.use(busboy());

    app.route('/api/photo') // Faz upload dos ficheiros !!
        .post(function (req, res) {
               
            var fstream;
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename) {
                fstream = fs.createWriteStream('./uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded' + req.param('name') + '/' + filename);
                file.pipe(fstream);
                fstream.on('close', function () {
                    return res.redirect('back');
                });
            });
        });

    app.get('/uploads/:file(*)', function (req, res) { //Abre os ficheiros suportados !!

        var file = req.params.file;
        var img = fs.readFileSync('./uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded/' + file.toString('base64'));
        res.writeHead(200, {
            'Content-Type': ''
        });
        res.end(img, 'binary');
    });

    app.get('/elim/:file(*)', function (req, res) { //Abre os ficheiros suportados !!

        var file = req.params.file;
        var img = fs.readFileSync('./uploads/' + req.user.id + '/' + req.user.local.email + '/elim/' + file.toString('base64'));
        res.writeHead(200, {
            'Content-Type': ''
        });
        res.end(img, 'binary');
    });



    app.get('/download', function (req, res) { //vai buscar arquivos ao /uploded/

        fs.ensureDir('./uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded/');
        fs.readdir('./uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded/', function (err, list) {
            if (err) return res.json(err);
            else if (list)
                res.json(list);
        });
    });

    app.get('/download/:file(*)', function (req, res) { //vai buscar arquivos ao /uploded/

        var file = req.params.file;
        fs.readdir('./uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded/' + file, function (err, list) {
            if (err) return res.json(["error"]);
            else if (list)
                res.json(list);
        });
    });

    app.get('/zip', function (req, res) { //vai buscar arquivos ao /uploded/

        var tarGzip = require('node-targz');

        tarGzip.compress({
            source: './uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded/' + req.query.dest.dest + req.query.file.file,
            destination: './uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded/' + req.query.file.file + '.tar.gz'
        });
        
         res.redirect('back');

    });
    

    app.get('/data/:file(*)', function (req, res) { // Faz download do arquivo

        var file = req.params.file;
        res.download('./uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded/' + file);
    });

    app.get('/share/:ciphertext(*)/:pasta(*)/:file(*)', function (req, res) { // Faz download do arquivo sem estar logado (ecriptação !!)

        var ee = require('easy-encryption');
        var file = req.params.file;
        var pasta = req.params.pasta;
        var ciphertext = req.params.ciphertext;

        var plaintext = ee.decrypt('password', ciphertext);

        res.download('./uploads/' + plaintext + '/uploaded/' + pasta + '/' + file);

    });


    app.get('/ELIMINAR/:file(*)', function (req, res) { //Move os aequivos para a lixeira

        var file = req.params.file;
        fs.move('./uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded/' + file, './uploads/' + req.user.id + '/' + req.user.local.email + '/elim/' + file, function (err) {
            if (err) return console.error(err);
        });
        res.redirect('back');
    });

    app.get('/restaurar/:file(*)', function (req, res) { //Restaura os arquivos!!

        var file = req.params.file;
        fs.move('./uploads/' + req.user.id + '/' + req.user.local.email + '/elim/' + file, './uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded/' + file, function (err) {
            if (err) return console.error(err);
            console.log("success!");
        });
        res.redirect('back');
    });

    app.get('/elimperm/:file(*)', function (req, res) { //Elimina permanentemente os selecioandos arquivos

        var file = req.params.file;
        fs.remove('./uploads/' + req.user.id + '/' + req.user.local.email + '/elim/' + file, function (err) {
            if (err) return console.error(err);
        });
        res.redirect('back');
    });

    app.get('/del/perm', function (req, res) { //Elimina permanentemente todos os arquivos
        fs.emptyDir('./uploads/' + req.user.id + '/' + req.user.local.email + '/elim/', function (err) {
            if (!err) console.log('success!');
            else res.redirect('back');
        });
        res.redirect('back');
    });


    app.route('/criar/pasta') // Faz upload dos ficheiros !!
        .post(function (req, res) { //Elimina permanentemente todos os arquivos
            fs.ensureDir('./uploads/' + req.user.id + '/' + req.user.local.email + '/uploaded/' + req.body.pasta + '/', function (err) {
                console.log(err);
            });
            res.redirect('back');
        });

    app.get('/trash', function (req, res) { //vai buscar arquivos ao /elim/

        fs.ensureDir('./uploads/' + req.user.id + '/' + req.user.local.email + '/elim/');
        fs.readdir('./uploads/' + req.user.id + '/' + req.user.local.email + '/elim/', function (err, list) {
            if (err) return res.json(err);
            else
                res.json(list);
        });
    });
};