const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const {connectToMongoDB} = require('./connect')

const URL = require('./models/url')

const {restrictToLoggedinUserOnly, checkAuth} = require('./middleware/auth')
const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require("./routes/user")

const app = express();

connectToMongoDB(process.env.MONGODB)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if MongoDB connection fails
});  

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({extended: false})) // To parse form data
app.use(cookieParser())

// app.get("/test", async (req,res) => {
//   const allUrls = await URL.find({}) // Gets all the url
//   return res.render('home', {
//     urls: allUrls, // Passing Variables
//   })
// })

app.use("/user", userRoute) // ypu will have to be logged in for accessing anything in /url
app.use("/url", restrictToLoggedinUserOnly, urlRoute) // Where ever there is url use urlRoute 
app.use("/", checkAuth, staticRoute)

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  if (entry) {
    res.redirect(entry.redirectURL);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(process.env.PORT, () => {
    console.log("Server is running") 
})
