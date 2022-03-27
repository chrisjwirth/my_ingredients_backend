import express from "express";
const recipeRouter = express.Router();
import {
  createRecipe,
  deleteRecipe,
  findRecipes,
  updateRecipe,
} from "../models/Recipe.js";

recipeRouter.get("", (req, res) => {
  findRecipes()
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to retrieve recipe | ${error.message}` });
    });
});

recipeRouter.post("", (req, res) => {
  createRecipe(req.body)
    .then((recipe) => {
      res.status(201).json(recipe);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to add recipe | ${error.message}` });
    });
});

recipeRouter.put("/:id", (req, res) => {
  updateRecipe(req.params.id, req.body)
    .then((recipe) => {
      if (recipe) {
        res.status(200).json(recipe);
      } else {
        res.status(404).json({ Error: "Recipe not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to update recipe | ${error.message}` });
    });
});

recipeRouter.delete("/:id", (req, res) => {
  deleteRecipe(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ Error: "Recipe not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to delete recipe | ${error.message}` });
    });
});

export default recipeRouter;
