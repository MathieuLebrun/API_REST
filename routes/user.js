const User = require("../models/User");  // Importer le modèle User
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken"); // Importer les fonctions de vérification de jeton d'accès

const router = require("express").Router(); // Créer une instance de routeur Express

// Mettre à jour un utilisateur
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) { // Vérifier si le corps de la requête contient un mot de passe
        // Crypter le mot de passe avant de l'enregistrer dans la base de données
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body // Mettre à jour l'utilisateur avec les nouvelles informations du corps de la requête
        }, { new: true }); // Renvoyer l'utilisateur mis à jour
        res.status(200).json(updatedUser); // Renvoyer la réponse HTTP avec l'utilisateur mis à jour
    }
    catch (err) {
        res.status(500).json(err); // Renvoyer une réponse HTTP avec une erreur 500 si une erreur se produit
    }

});

// SUPPRIMER un utilisateur
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id); // Rechercher et supprimer l'utilisateur en utilisant l'ID fourni dans l'URL
        res.status(200).json("User has been deleted..."); // Renvoyer la réponse HTTP avec un message indiquant que l'utilisateur a été supprimé
    } catch (err) {
        res.status(500).json(err); // Renvoyer une réponse HTTP avec une erreur 500 si une erreur se produit
    }
});

// OBTENIR TOUS LES UTILISATEURS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new; // Vérifier si la requête contient le paramètre "new"
    try {
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(5) // Renvoyer les 5 derniers utilisateurs si le paramètre "new" est présent
            : await User.find(); // Sinon, renvoyer tous les utilisateurs
        res.status(200).json(users); // Renvoyer la réponse HTTP avec les utilisateurs obtenus
    } catch (err) {
        res.status(500).json(err); // Renvoyer une réponse HTTP avec une erreur 500 si une erreur se produit
    }
});

// OBTENIR LES STATISTIQUES D'UTILISATEUR
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1)); // Obtenir la date d'il y a un an

    try {
        // Obtenir les données agrégées des utilisateurs créés au cours de la dernière année, en regroupant les utilisateurs par mois de création
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } }, // Filtre les utilisateurs créés au cours de la dernière année
            {
                $project: {
                    month: { $month: "$createdAt" }, // Crée un champ "month" qui contient le mois de création de chaque utilisateur
                },
            },
            {
                $group: {
                    _id: "$month", // Regroupe les utilisateurs par mois de création
                    total: { $sum: 1 }, // Calcule le nombre total d'utilisateurs pour chaque mois
                }
            }
        ]);
        res.status(200).json(data) // Renvoie les données agrégées au format JSON
    } catch (err) {
        res.status(500).json(err); // Renvoie une erreur 500 en cas d'erreur
    }
});

module.exports = router; // Exporte la route pour l'utiliser dans l'application
