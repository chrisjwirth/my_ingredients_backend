import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import ingredientRouter from "./routes/ingredientRouter.js";
import recipeRouter from "./routes/recipeRouter.js";
import listRouter from "./routes/listRouter.js";

// Database

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

mongoose.connect(
  `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@development.e8rm2.mongodb.net/myIngredientsDB?retryWrites=true&w=majority`
);

mongoose.connection
  .once("open", () => {
    console.log("Successfully connected to the database.");
  })
  .on("error", () => {
    console.error("Unable to connect to the database.");
  });

// Server

const PORT = 3000;
const app = express();
app.use(express.json());

app.use("/ingredients", ingredientRouter);
app.use("/recipes", recipeRouter);
app.use("/list", listRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
