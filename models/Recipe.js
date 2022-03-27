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

const findRecipes = async () => {
  const query = Recipe.find({}).populate("ingredients.ingredient");
  return await query.exec();
};

// Pipeline for Recipe Cost
//
// [
//   {
//     '$unwind': {
//       'path': '$ingredients'
//     }
//   }, {
//   '$lookup': {
//     'from': 'ingredients',
//     'localField': 'ingredients.ingredient',
//     'foreignField': '_id',
//     'as': 'ingredient'
//   }
// }, {
//   '$unwind': {
//     'path': '$ingredient'
//   }
// }, {
//   '$group': {
//     '_id': '$_id',
//     'Sum': {
//       '$sum': '$ingredient.price'
//     }
//   }
// }
// ]

const updateRecipe = async (id, properties) => {
  return Recipe.findByIdAndUpdate(id, properties);
};

const deleteRecipe = async (id) => {
  return Recipe.findByIdAndDelete(id);
};

export { createRecipe, findRecipes, updateRecipe, deleteRecipe };
