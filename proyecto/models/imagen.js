'use strict';
const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var Imagen = mongoose.model("Image",{
    title:{type:String, required:true},
    creator:{type: Schema.Types.ObjectId, ref: "User"},
    extension: {type:String, required: true}
});

module.exports = Imagen;
