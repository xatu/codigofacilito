'use strict';
const express = require("express"),
    bodyParse = require("body-parser"),
    User = require("./models/user").User,
    session = require("express-session"),    
    //cookieSession = require("cookie-session"),  
    router_app = require("./routes_app"),
    session_middleware = require("./middlewares/session"),
    methodOverride = require ("method-override"),
    formData = require("express-form-data"),
    RedisStore = require("connect-redis")(session),
    http = require('http'),
    realtime = require('./realtime')

const app = express();
const server = http.Server(app)

const redis_session = session({
    store: new RedisStore({}),
    secret: "12345qwerty764",
    resave: false,
    saveUninitialized: false
})

realtime(server,redis_session)

app.use(express.static("public"));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));

app.use(methodOverride("_method"));

/*
app.use(cookieSession({
    name: "xatu",
    keys: [ "llave-1","llave-2"]
}));
*/

app.use(redis_session);

app.use(formData.parse({ 
    keepExtensions: true     
}));

app.set("view engine", "jade");

app.get("/", (req,res) => {
    res.render("index");
});

app.get("/login", (req,res) => res.render("login"));

app.get("/signup", (req,res) => res.render("signup"));

app.post("/sessions", (req,res) => {    
    User.findOne({ email:req.body.email, password:req.body.password },"", (err,doc) => {        
        if (err) { console.log(err); return }
        if(!doc){
            res.redirect("/login");
        } else {
            req.session.user_id = doc._id;
            res.redirect("/app");
        }
    });    
});

app.post("/users", (req,res) => {
    var user = new User({
        username: req.body.username,
        email: req.body.email, 
        password: req.body.password,
        password_confirmation: req.body.password_confirmation
    });
    user.save().then(() => res.send("Recibimos tus datos XD"),
    (err) => {        
        console.log(String(err));        
        res.send("No pudimos guardar tus datos");
    });
    User.find((err,doc) => {
        console.log(doc);       
    });
});
app.use("/app",session_middleware);
app.use("/app",router_app);

server.listen(8080)