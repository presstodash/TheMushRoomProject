const { verifyToken } = require('../util/jwUtils');
const korisnikModel = require ('../models/korisnikModel');

exports.authenticate = async (req, res, next) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error ('Access denied');

        const decoded = verifyToken(token);
        const korisnik = await korisnikModel.getById(decoded.id);
        if (!korisnik) throw new Error ('User not found');

        req.korisnik = korisnik;
        next();
    }
    catch(err){
        res.status(401).json(err);
    }
};

exports.iskusanKorisnik = (req, res, next) => {
    if (req.korisnik.uloga != 'iskusni') {
        return res.status(403).json ({poruka : 'Potreban status: Iskusni'});
    }
    next();
};