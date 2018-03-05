'use restrict';
const express = require("express"),
    Imagen = require("./models/imagen"),
    find_imagen = require("./middlewares/find_image"),
    fse = require("fs-extra"),
    redis = require('redis'),
    client = redis.createClient()

const router = express.Router();

router.get("/", (req,res) => {    
    res.render("app/home");
});

/* IMAGENES CRUD REST */ 
router.get("/imagenes/new", (req,res) => {
    res.render("app/imagenes/new");
});

router.all("/imagenes/:id*",find_imagen);

router.get("/imagenes/:id/edit", (req,res) => {    
    res.render("app/imagenes/edit");            
});

router.route("/imagenes/:id")
    .get((req,res) => {      
        client.publish('images',res.locals.imagen.toString())      
        res.render("app/imagenes/show");
    })
    .put((req,res) => {
        res.locals.imagen.title = req.body.title;
        res.locals.imagen.save((err) => {
            if(!err) {
                res.redirect("/app/imagenes");                
            } else {
                res.render("app/imagenes/"+req.params.id+"/edit");
            }
        })
    })
    .delete((req,res) => {
        Imagen.findOneAndRemove({_id: req.params.id}, (err) =>{
            if(!err) {                
                fse.remove("public/img/"+req.params.id+"."+res.locals.imagen.extension)
                    .then()
                    .catch(err => console.log(err));
                res.redirect("/app/imagenes");
            } else {
                console.log(err);
                res.redirect("/app/imagenes/"+req.params.id);
            }
        });
    });    

router.route("/imagenes")
    .get((req,res) => {
        Imagen.find({creator: res.locals.user._id},(err,imagenes) => {
            (err) => { 
                console.log(err);
                res.redirect("/app"); 
                return 
            }
            res.render("app/imagenes/index",{imagenes: imagenes});
        });
    })
    .post( (req,res) => {
        var extension = req.files.archivo.name.split(".").pop();        
        var data = {
            title: req.body.title,
            creator: res.locals.user._id,
            extension: extension
        }
        var imagen = new Imagen(data);
        imagen.save((err) => {
            if(!err){

                var imgJSON = {
                    "id": imagen._id,
                    "title": imagen.title,
                    "extension": imagen.extension
                }

                client.publish('images',JSON.stringify(imgJSON))
                fse.move(req.files.archivo.path, "public/img/"+imagen._id+"."+extension)
                    .then()
                    .catch(err => console.log(err));
                res.redirect("/app/imagenes/" + imagen._id)                
            } else{                
                res.render(err);
            }
        });
    });

module.exports = router;