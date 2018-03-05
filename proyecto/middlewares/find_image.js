'use strict';
const Imagen = require("../models/imagen"),
    owner_check = require("./image_permissions");

module.exports = (req,res,next) => {
    Imagen.findById(req.params.id)
        .populate("creator")
        .exec((err,imagen) => {
            if(imagen != null && owner_check(imagen,req,res)) {
                //console.log("Imagen: " + imagen.title);
                res.locals.imagen = imagen;
                next();
            } else{
                res.redirect("/app");
            }
        });
}