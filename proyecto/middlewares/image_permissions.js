'use strict';
const Imagen = require("../models/imagen");

module.exports = (image, req, res) => {
    if(typeof image.creator == "undefined") return false;
    if(req.method === "GET" && req.path.indexOf("edit") < 0) return true;    
    if(image.creator._id.toString() == res.locals.user._id) return true;    
    return false;
}