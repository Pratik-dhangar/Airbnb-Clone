const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cookieParser("secretecode"));

// setting options in express-session
const sessionOptions = {
    secret: "secretKey",
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res)=>{
    let {name} = req.query;
    req.session.name = name;
    req.flash("success", "Registered!");
    res.redirect("/hello")
});

app.get("/hello", (req,res)=>{
   res.render("index.ejs", {name: req.session.name, msg: req.flash("success")});
});

app.get("/signedcookie" , (req, res)=>{
    res.cookie("madeIn", "India", {signed: true});
    res.send("signed cookie");
}); 

app.get("/verify", (req, res)=>{
    console.log(req.signedCookies);
    res.send("verified!");
})



app.get("/cookie", (req,res)=>{
    res.cookie("greet", "namaste");
    res.cookie("hello", "India");
    res.send("sent you cookies");
});

app.get("/", (req, res)=>{
    console.dir(req.cookies);
    res.send("Hi i'm root");
});


app.listen(8080, () => {
    console.log("Server is running on port 8080");
  });