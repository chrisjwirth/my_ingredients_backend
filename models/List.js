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

const findPipeline = [
  {
    $lookup: {
      from: "recipes",
      localField: "recipes",
      foreignField: "_id",
      as: "recipes",
    },
  },
  {
    $unwind: {
      path: "$recipes",
    },
  },
  {
    $unwind: {
      path: "$recipes.ingredients",
    },
  },
  {
    $lookup: {
      from: "ingredients",
      localField: "recipes.ingredients.ingredient",
      foreignField: "_id",
      as: "recipes.ingredients.ingredient",
    },
  },
  {
    $unwind: {
      path: "$recipes.ingredients.ingredient",
    },
  },
  {
    $addFields: {
      "recipes.ingredients.quantityMissing": {
        $round: [
          {
            $subtract: [
              "$recipes.ingredients.quantityNeeded",
              "$recipes.ingredients.ingredient.quantityAvailable",
            ],
          },
          2,
        ],
      },
    },
  },
  {
    $addFields: {
      "recipes.ingredients.totalPrice": {
        $round: [
          {
            $multiply: [
              "$recipes.ingredients.ingredient.price",
              "$recipes.ingredients.quantityNeeded",
            ],
          },
          2,
        ],
      },
      "recipes.ingredients.remainingPrice": {
        $round: [
          {
            $multiply: [
              "$recipes.ingredients.ingredient.price",
              "$recipes.ingredients.quantityMissing",
            ],
          },
          2,
        ],
      },
    },
  },
  {
    $group: {
      _id: {
        listID: "$_id",
        ingredientID: "$recipes.ingredients.ingredient._id",
      },
      quantityAvailable: {
        $first: "$recipes.ingredients.ingredient.quantityAvailable",
      },
      quantityNeeded: {
        $sum: "$recipes.ingredients.quantityNeeded",
      },
      unitPrice: {
        $first: "$recipes.ingredients.ingredient.price",
      },
      unit: {
        $first: "$recipes.ingredients.ingredient.unit",
      },
      name: {
        $first: "$recipes.ingredients.ingredient.name",
      },
    },
  },
  {
    $addFields: {
      quantityMissing: {
        $round: [
          {
            $subtract: ["$quantityNeeded", "$quantityAvailable"],
          },
          2,
        ],
      },
    },
  },
  {
    $match: {
      quantityMissing: {
        $gt: 0,
      },
    },
  },
  {
    $addFields: {
      totalPrice: {
        $round: [
          {
            $multiply: ["$quantityMissing", "$unitPrice"],
          },
          2,
        ],
      },
    },
  },
  {
    $group: {
      _id: "$_id.listID",
      shoppingList: {
        $push: "$$ROOT",
      },
    },
  },
  {
    $unset: "shoppingList._id",
  },
];

const findList = async () => {
  const query = List.aggregate(findPipeline);
  return await query.exec();
};

const updateList = async (id, properties) => {
  return List.findByIdAndUpdate(id, properties);
};

const deleteList = async (id) => {
  return List.findByIdAndDelete(id);
};

export { createList, findList, updateList, deleteList };
