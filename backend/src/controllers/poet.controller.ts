import { Request, Response } from "express";
import {
  createPoetValidator,
  updatePoetValidator,
} from "../helpers/validators/poet.validator";
import { PoetModel } from "../models/Poet/Poet.model";
import { BookModel } from "../models/Book/Book.model";
export async function CREATE_POET(req: Request, res: Response) {
  try {
    const newPoet = req.body;

    await createPoetValidator.validateAsync(newPoet);
    if (req.file) {
      newPoet.image = req.file.path.replace(/\\/g, "/"); 
    }
    const poet = await PoetModel.create(newPoet);

    return res.status(201).json({
      message: "Poet successfully created",
      data: poet,
    });
  } catch (err: any) {
    if (err.isJoi) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "CREATE_POET"
    });
  }
}
export async function GET_POET(req: Request, res: Response) {
  try {
    let { id } = req.params;
    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid poet ID" });
    }

    let poet = await PoetModel.findByPk(Number(id), {
      include: [
        {
          model: BookModel,
        },
      ],
    });
    if (!poet) {
      return res.status(404).json({ message: "Poet not found" });
    }
    return res.json({ data: poet });
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "GET_POET"
    });
  }
}
export async function GET_POETS(req: Request, res: Response) {
  try {
    let poets = await PoetModel.findAll({
      include: [{ model: BookModel }],
    });
  
    return res.status(200).json({ data: poets });
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "GET_POETS"
    });
  }
}
export async function UPDATE_POET(req: Request, res: Response) {
  try {
    let { id } = req.params;
    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid poet ID" });
    }

    let data = req.body;

    if (req.file) {
      data.image = req.file.path.replace(/\\/g, "/");
    }

    await updatePoetValidator.validateAsync(data);

    let poet = await PoetModel.findByPk(Number(id));
    if (!poet) {
      return res.status(404).json({ message: "Poet not found" });
    }

    await poet.update(data);

    return res.status(200).json({
      message: "Poet successfully updated",
      data: poet,
    });
  } catch (err: any) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "UPDATE_POET"
    });
  }
}

export async function DELETE_POET(req: Request, res: Response) {
  try {
    let { id } = req.params;
    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid poet ID" });
    }

    let poet = await PoetModel.findByPk(Number(id));

    if (!poet) {
      return res.status(404).json({ message: "Poet not found" });
    }

    await poet.destroy();
    return res.status(200).json({ message: "Poet successfully deleted" });
  } catch (err: any) {
    return res.status(500).json({ 
      status: 500,
      message: "Internal Server Error", 
      error: err.message,
      controller: "DELETE_POET"
    });
  }
}
