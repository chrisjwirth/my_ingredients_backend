import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: { type: String, required: true },
  ingredients: [
    {
      ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient" },
      quantityNeeded: { type: Number, required: true },
    },
  ],
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

const createRecipe = async (properties) => {
  const ingredient = new Recipe(properties);
  return await ingredient.save();
};

const findPipeline = [
  {
    $unwind: {
      path: "$ingredients",
    },
  },
  {
    $lookup: {
      from: "ingredients",
      localField: "ingredients.ingredient",
      foreignField: "_id",
      as: "ingredients.ingredient",
    },
  },
  {
    $unwind: {
      path: "$ingredients.ingredient",
    },
  },
  {
    $addFields: {
      "ingredients.quantityMissing": {
        $round: [
          {
            $subtract: [
              "$ingredients.ingredient.quantityAvailable",
              "$ingredients.quantityNeeded",
            ],
          },
          2,
        ],
      },
    },
  },
  {
    $addFields: {
      "ingredients.totalPrice": {
        $round: [
          {
            $multiply: [
              "$ingredients.ingredient.price",
              "$ingredients.quantityNeeded",
            ],
          },
          2,
        ],
      },
      "ingredients.remainingPrice": {
        $round: [
          {
            $multiply: [
              "$ingredients.ingredient.price",
              "$ingredients.quantityMissing",
            ],
          },
          2,
        ],
      },
    },
  },
  {
    $group: {
      _id: "$_id",
      name: {
        $first: "$name",
      },
      ingredients: {
        $push: "$ingredients",
      },
    },
  },
];

const findRecipes = async () => {
  const query = Recipe.aggregate(findPipeline);
  return await query.exec();
};

const updateRecipe = async (id, properties) => {
  return Recipe.findByIdAndUpdate(id, properties);
};

const deleteRecipe = async (id) => {
  return Recipe.findByIdAndDelete(id);
};

export { createRecipe, findRecipes, updateRecipe, deleteRecipe };
