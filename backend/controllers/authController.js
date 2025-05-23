const authService = require('../services/authService');
const { generateToken } = require('../utils/jwtUtils');

exports.register = async (req, res, next) =>{
    try {
        const { email, lozinka, ime } = req.body;
        if (!ime || !lozinka || !email) {
            return res.status(400).json({error: "Molimo popunite sva polja!"});
        }

        const korisnik = await authService.register (email, lozinka, ime);
        const token = generateToken(korisnik.id_korisnik);
        res.status(201).json( { token, korisnik: {
                                        id: korisnik.id_korisnik,
                                        ime: korisnik.ime,
                                        email: korisnik.email
        }});
    }
    catch (err){
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, lozinka } = req.body;
        if (!email || !lozinka) { 
            return res.status(400).json({error: "Molimo popunite sva polja!"});
        }
        const korisnik = await authService.login (email, lozinka);
        const token = generateToken(korisnik.id_korisnik);
        res.json( { token, korisnik: {
                            id: korisnik.id_korisnik,
                            ime: korisnik.ime,
                            email: korisnik.email
        }});
    }
    catch (err){
        next(err);
    }
}