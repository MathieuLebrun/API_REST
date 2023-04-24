const jwt = require("jsonwebtoken"); // Importation du module jsonwebtoken

const verifyToken = (req, res, next) => { // Fonction middleware pour vérifier le token
    const authHeader = req.headers.token // Récupération du token depuis les headers de la requête
    if (authHeader) { // Si le token est présent dans les headers
        const token = authHeader.split(" ")[1]; // Récupération du token à partir du header Authorization
        jwt.verify(token, process.env.JWT_SEC, (err, user) => { // Vérification du token à l'aide de la clé secrète JWT
            if (err) res.status(403).json("token is not valid"); // Si le token est invalide, envoie une réponse avec un statut d'erreur 403
            req.user = user; // Stockage de l'utilisateur dans l'objet req pour une utilisation ultérieure
            next(); // Appel du prochain middleware
        })
    } else { // Si le token est absent des headers
        return res.status(401).json("You are not authenticated!"); // Envoie une réponse avec un statut d'erreur 401
    }
};

const verifyTokenAndAuthorization = (req, res, next) => { // Fonction middleware pour vérifier le token et l'autorisation
    verifyToken(req, res, () => { // Appel de la fonction verifyToken pour vérifier le token
        if (req.user.id === req.params.id || req.user.isAdmin) { // Si l'utilisateur est autorisé (a le même id que celui présent dans la requête ou est un admin)
            next() // Appel du prochain middleware
        } else { // Si l'utilisateur n'est pas autorisé
            res.status(403).json("you are not allowed! Mon gaté"); // Envoie une réponse avec un statut d'erreur 403
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => { // Fonction middleware pour vérifier le token et l'autorisation admin
    verifyToken(req, res, () => { // Appel de la fonction verifyToken pour vérifier le token
        if (req.user.isAdmin) { // Si l'utilisateur est un admin
            next() // Appel du prochain middleware
        } else { // Si l'utilisateur n'est pas un admin
            res.status(403).json("you are not allowed! Mon gaté"); // Envoie une réponse avec un statut d'erreur 403
        }
    });
};
module.exports = { // Exportation des fonctions middleware
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};
