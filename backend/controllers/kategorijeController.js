const KategorijaService = require('../services/kategorijaService');

exports.getKategorije = async (req, res, next) => {
    try {
        const kategorije = await KategorijaService.getKategorije();
        res.json(kategorije);
    } catch (err) {
        next(err);
    }
};

exports.createKategorija = async (req, res, next) => {
    try {
        const novaKategorija = await KategorijaService.createKategorija(req.body);
        res.status(201).json(novaKategorija);
    } catch (err) {
        next(err);
    }
};

exports.updateKategorija = async (req, res, next) => {
    try {
        const updated = await KategorijaService.updateKategorija(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteKategorija = async (req, res, next) => {
    try {
        await KategorijaService.deleteKategorija(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};