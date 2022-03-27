import express from "express";
const ingredientRouter = express.Router();
import {
  createIngredient,
  deleteIngredient,
  findIngredients,
  updateIngredient,
} from "../models/Ingredient.js";

ingredientRouter.get("", (req, res) => {
  findIngredients()
    .then((ingredients) => {
      res.status(200).json(ingredients);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to retrieve ingredients | ${error.message}` });
    });
});

ingredientRouter.post("", (req, res) => {
  createIngredient(req.body)
    .then((ingredient) => {
      res.status(201).json(ingredient);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to add ingredient | ${error.message}` });
    });
});

ingredientRouter.put("/:id", (req, res) => {
  updateIngredient(req.params.id, req.body)
    .then((ingredient) => {
      if (ingredient) {
        res.status(200).json(ingredient);
      } else {
        res.status(404).json({ Error: "Ingredient not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to update ingredient | ${error.message}` });
    });
});

ingredientRouter.delete("/:id", (req, res) => {
  deleteIngredient(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ Error: "Ingredient not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to delete ingredient | ${error.message}` });
    });
});

export default ingredientRouter;
