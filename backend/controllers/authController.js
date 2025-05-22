const autoService = require('../services/authService');
const { generateToker } = requires('../utils/jwUtils');

exports.register = async (req, res, next) =>{
    try {
        const { email, lozinka, ime } = req.body;
        const korisnik = await authService.register (email, lozinka, ime);
        const token = generateToker(korisnik.id_korisnik);
        res.status(201).json( { token, korisnik });
    }
    catch (err){
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, lozinka } = req.body;
        const korisnik = await authService.login (email, lozinka);
        const token = generateToker(korisnik.id_korisnik);
        res.status(201).json( { token, korisnik });
    }
    catch (err){
        next(err);
    }
}

