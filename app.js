if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



// database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/bhatktiAtma";

main()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// creating db

async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
  secret: "SecretCode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}





// basic api
app.get("/", (req, res) => {
  res.send("I'm deathly afraid of bees!");
});



app.use(session(sessionOptions));
app.use(flash());  //use flash before routes 

// use passport after session ..*it uses session for user authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/demouser", async(req, res)=>{
//   let fakeUser= new User({
//     email: "abc@gmail.com",
//     username: "fake"
//   });

//   let registeredUser = await User.register(fakeUser, "password");
//   res.send(registeredUser);
// });


// using listing routes
app.use("/listings", listingsRouter);

// using review routes
app.use("/listings/:id/reviews", reviewsRouter)

// using user router
app.use("/", userRouter);

// new express Error
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// error handler middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("error.ejs", { message });
  //   res.status(statusCode).send(message);
});

// server connection
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
