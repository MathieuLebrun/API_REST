const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 5,
            unique: true
        },
        classe: {
            type: String,
            enum: {
                values: ['6', '5', '4', '3'],
                message: "La classe {VALUE} n'existe pas."
            },
            require: true,
            unique: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            minlength: 6,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model("User", UserSchema);