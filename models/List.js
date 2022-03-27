import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
});

const List = mongoose.model("List", ListSchema);

const createList = async (properties) => {
  const list = new List(properties);
  return await list.save();
};

const findList = async () => {
  const query = List.find({}).populate({
    path: "recipes",
    populate: { path: "ingredients.ingredient" },
  });
  return await query.exec();
};

const updateList = async (id, properties) => {
  return List.findByIdAndUpdate(id, properties);
};

const deleteList = async (id) => {
  return List.findByIdAndDelete(id);
};

export { createList, findList, updateList, deleteList };
