exports.show = function (req, res, next) {
    res.send('pet show')
   // res.render('show', { pet: req.pet });
};

// exports.edit = function (req, res, next) {
//     res.render('edit', { pet: req.pet });
// };

// exports.update = function (req, res, next) {
//     var body = req.body;
//     req.pet.name = body.pet.name;
//     res.message('Information updated!');
//     res.redirect('/pet/' + req.pet.id);
// };
