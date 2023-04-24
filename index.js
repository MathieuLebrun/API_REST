const express = require("express"); // Importation du module Express
const app = express(); // Initialisation de l'application Express
const mongoose = require("mongoose"); // Importation du module Mongoose pour la gestion de MongoDB
const dotenv = require( "dotenv"); // Importation du module dotenv pour la gestion des variables d'environnement
const cors = require("cors"); // Importation du module cors pour la gestion des requêtes HTTP cross-origin
const userRoute = require("./routes/user"); // Importation du module contenant les routes pour la gestion des utilisateurs
const authRoute = require("./routes/auth"); // Importation du module contenant les routes pour l'authentification

dotenv.config(); // Chargement des variables d'environnement à partir du fichier .env

mongoose // Connexion à la base de données MongoDB à partir de l'URL stockée dans la variable d'environnement MONGO_URL
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DBConnection Successfull!")) // Affichage d'un message si la connexion réussit
    .catch((err) => {
        console.log(err); // Affichage de l'erreur en cas d'échec de la connexion
    });

app.use(express.json()); // Middleware pour parser les données de la requête entrante au format JSON
app.use(cors({ // Middleware pour autoriser les requêtes cross-origin depuis l'origine spécifiée dans la configuration
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}));

app.use("/api/auth", authRoute); // Utilisation des routes pour l'authentification
app.use("/api/users", userRoute); // Utilisation des routes pour la gestion des utilisateurs

app.listen(process.env.PORT || 5000, () => { // Démarrage du serveur sur le port spécifié par la variable d'environnement PORT ou sur le port 5000 par défaut
    console.log("backend server is running!"); // Affichage d'un message lorsque le serveur est démarré
});