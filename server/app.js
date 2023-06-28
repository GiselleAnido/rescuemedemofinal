const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const {
  routeNotFound,
  globalErrorHandler,
} = require("./middleware/errorHandlers");

const petRouter = require("./routes/petRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://rescuemedemofinal.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10MB" })); //luke made this change ;)

//Security
app.use(mongoSanitize());
app.use(xss());

//CONNECT TO DB

mongoose.connect(process.env.DBCONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("error", console.error)
  .once("open", () => console.log("Database connection established"));

// Clear Cache middleware
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
  
  next();
});


//ROUTES

app.use("/api/pets", petRouter);
app.use("/api/users", userRouter);

//ERROR HANDLER MIDDLEWARES

app.use(routeNotFound);
app.use(globalErrorHandler);

module.exports = app;
