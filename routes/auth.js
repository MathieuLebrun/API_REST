const router = require("express").Router(); // Importation du module express et création d'un routeur
const User = require("../models/User"); // Importation du modèle User
const CryptoJS = require("crypto-js"); // Importation de la bibliothèque CryptoJS
const jwt = require("jsonwebtoken"); // Importation de la bibliothèque jsonwebtoken


router.post("/register", async (req, res) => { // Définition d'une route POST pour la création d'un utilisateur
    const newUser = new User({ // Création d'un nouvel utilisateur à partir des informations fournies dans le corps de la requête
        username: req.body.username, // Nom d'utilisateur fourni dans le corps de la requête
        classe: req.body.classe, // Classe de l'utilisateur fournie dans le corps de la requête
        email: req.body.email, // Adresse email de l'utilisateur fournie dans le corps de la requête
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(), // Cryptage du mot de passe fourni dans le corps de la requête à l'aide de la clé secrète PASS_SEC stockée dans les variables d'environnement
    });
    try {
        const savedUser = await newUser.save(); // Enregistrement du nouvel utilisateur dans la base de données
        res.status(200).json(savedUser); // Envoi d'une réponse HTTP 200 avec les informations de l'utilisateur créé en format JSON

    } catch (err) {
        res.status(500).json(err); // Envoi d'une réponse HTTP 500 avec l'erreur rencontrée en format JSON
    }

});


router.post("/login", async (req, res) => {// Route pour la connexion d'un utilisateur existant

    try {
        // Rechercher l'utilisateur dans la base de données par nom d'utilisateur
        const user = await User.findOne({ username: req.body.username });

        // Vérifier si l'utilisateur existe
        if (!user) {
            // Si l'utilisateur n'existe pas, renvoyer une réponse avec un code de statut 401 (non autorisé)
            return res.status(401).json("Wrong credentials");
        }

        // Décrypter le mot de passe stocké dans la base de données
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const Oripassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        // Vérifier si le mot de passe soumis par l'utilisateur est correct
        if (Oripassword !== req.body.password) {
            // Si le mot de passe est incorrect, renvoyer une réponse avec un code de statut 401 (non autorisé)
            return res.status(401).json("Wrong credentials!");
        }

        // Générer un jeton d'accès avec une durée de validité de 3 jours
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        // Supprimer le mot de passe du résultat de la requête et envoyer une réponse avec le reste des informations utilisateur et le jeton d'accès
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        // Si une erreur se produit pendant le traitement de la requête, renvoyer une réponse avec un code de statut 500 (erreur interne du serveur)
        res.status(500).json(err);
    }
});

module.exports = router; // Exporte la route pour l'utiliser dans l'application