'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/test");

var posibles_valores = ["M","F"];
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Correo no valido"];
var password_validation = {
    validator: (p) => this.p_c == p,
    message: "Las contraseñas no son iguales"
}
const user_schema = new Schema({
    name: String,
    username: {type: String, required: true, maxlength:[50,"El nombre de usuario es muy largo"]},
    password: {type: String,minlength:[8,"La contraseñ es muy corta"],validate: password_validation},
    age: {type: Number, min:[18,"El minimo es 18"], max:[100,"No puede ser mas de 100"]},
    email: {type: String, required: "El correo es obligatorio", match: email_match},        
    date: Date, 
    sex: {type: String, enum:{values: posibles_valores,message:"Opción no válida"}}
});

user_schema.virtual("password_confirmation")
    .get(() => this.p_c)
    .set( v => this.p_c = v);

const User = mongoose.model("User",user_schema);

module.exports.User = User;
