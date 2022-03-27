import express from "express";
const listRouter = express.Router();
import {
  createList,
  deleteList,
  findList,
  updateList,
} from "../models/List.js";

listRouter.get("", (req, res) => {
  findList()
    .then((list) => {
      res.status(200).json(list);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to retrieve list | ${error.message}` });
    });
});

listRouter.post("", (req, res) => {
  createList(req.body)
    .then((list) => {
      res.status(201).json(list);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to create list | ${error.message}` });
    });
});

listRouter.put("/:id", (req, res) => {
  updateList(req.params.id, req.body)
    .then((list) => {
      if (list) {
        res.status(200).json(list);
      } else {
        res.status(404).json({ Error: "List not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to update list | ${error.message}` });
    });
});

listRouter.delete("/:id", (req, res) => {
  deleteList(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ Error: "List not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ Error: `Unable to delete list | ${error.message}` });
    });
});

export default listRouter;
