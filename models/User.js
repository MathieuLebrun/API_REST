const mongoose = require("mongoose"); // import de la bibliothèque Mongoose

const UserSchema = new mongoose.Schema( // création d'un schéma d'utilisateur
    {
        username: { // champ "username"
            type: String, // type : chaîne de caractères
            required: true, // champ obligatoire
            minlength: 5, // doit avoir une longueur minimale de 5 caractères
            unique: true // doit être unique
        },
        classe: { // champ "classe"
            type: String, // type : chaîne de caractères
            enum: { // doit être une des valeurs suivantes
                values: ['6', '5', '4', '3'],
                message: "La classe {VALUE} n'existe pas."
            },
            require: true, // champ obligatoire
            unique: true // doit être unique
        },
        email: { // champ "email"
            type: String, // type : chaîne de caractères
            trim: true, // suppression des espaces avant et après la chaîne
            lowercase: true, // conversion en minuscules
            unique: true, // doit être unique
            required: 'Email address is required', // champ obligatoire
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // doit correspondre à une expression régulière pour une adresse email valide
        },
        password: { // champ "password"
            type: String, // type : chaîne de caractères
            minlength: 6, // doit avoir une longueur minimale de 6 caractères
            required: true // champ obligatoire
        },
        isAdmin: { // champ "isAdmin"
            type: Boolean, // type : booléen
            default: false // valeur par défaut : false
        },
    },
    { timestamps: true } // ajoute automatiquement un champ "createdAt" et un champ "updatedAt" pour chaque document
);

module.exports = mongoose.model("User", UserSchema); // exporte le modèle "User" basé sur le schéma "UserSchema"