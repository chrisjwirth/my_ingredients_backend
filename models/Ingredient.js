import mongoose from "mongoose";
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  quantityAvailable: { type: Number, required: true },
  price: { type: Number, required: false },
});

const Ingredient = mongoose.model("Ingredient", IngredientSchema);

const createIngredient = async (properties) => {
  const ingredient = new Ingredient(properties);
  return await ingredient.save();
};

const findIngredients = async () => {
  const query = Ingredient.find({});
  return await query.exec();
};

const updateIngredient = async (id, properties) => {
  return Ingredient.findByIdAndUpdate(id, properties);
};

const deleteIngredient = async (id) => {
  return Ingredient.findByIdAndDelete(id);
};

export {
  createIngredient,
  findIngredients,
  updateIngredient,
  deleteIngredient,
};
