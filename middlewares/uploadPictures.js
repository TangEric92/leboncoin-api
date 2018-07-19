// Importation de CLoudinary
const cloudinary = require('cloudinary');
// Configuration de Cloudinary
cloudinary.config({cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET});

const uploadPictures = (req, res, next) => {
    // J'initialise un tableau vide pour mes images uploadées
    const pictures = [];
    // Je récupères le tabelau de fichiers
    const files = req.body.files;
    // J'initialise le nombre d'upload à zéro
    let filesUploaded = 0;
    // Et pour chaque fichier dans le tableau, je crée un upload vers Cloudinary
    files.forEach(file => {
        cloudinary
            .v2
            .uploader
            .upload(file, {
                // J'assigne un dossier spécifique dans Cloudinary pour chaque utilisateur
                public_id: `leboncoin/${req.user._id}`
            }, (error, result) => {
                // Si j'ai une erreur avec l'upload, je sors de ma route
                if (error) {
                    return res.json({error})
                }
                // Sinon, je push mon image dans le tableau
                pictures.push(result);
                // Et j'incrémente le nombre d'upload
                filesUploaded++;
                console.log("-------\n", result);
                // Si le nombre d'uploads est égal au nombre de fichiers envoyés...
                if (filesUploaded === files.length) {
                    /* res
                        .status(200)
                        .json({message: `You've uploaded ${filesUploaded} files.`}); */
                    // Je stocke les images dans l'objet `req`
                    req.pictures = pictures;
                    // Et je poursuis ma route avec `next()`
                    next();
                }
            });

    });
}

module.exports = uploadPictures;