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
  // Set appropriate CORS headers based on your requirements
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://rescuemedemofinal.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
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

//ROUTES

app.use("/api/pets", petRouter);
app.use("/api/users", userRouter);

//ERROR HANDLER MIDDLEWARES

app.use(routeNotFound);
app.use(globalErrorHandler);

module.exports = app;
