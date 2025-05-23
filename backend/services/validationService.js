const validURL = require ('valid-url');
const { extname } = require('path');

exports.validateURL = (url) => {
    if (!validURL.isWebUri(url)){
        throw new Error ( 'URL nije valjan!');
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const extension = extname(new URL(url).pathname).toLowerCase();

    if (!allowedExtensions.includes(extension)){
        throw new Error ('Kriva ekstenzija slike, dopuštene ekstenzije su : .jpg, .jpeg, .png!');
    }

    return true;
};