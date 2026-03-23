"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_POET = CREATE_POET;
exports.GET_POET = GET_POET;
exports.GET_POETS = GET_POETS;
exports.UPDATE_POET = UPDATE_POET;
exports.DELETE_POET = DELETE_POET;
const poet_validator_1 = require("../helpers/validators/poet.validator");
const Poet_model_1 = require("../models/Poet/Poet.model");
const Book_model_1 = require("../models/Book/Book.model");
async function CREATE_POET(req, res) {
    try {
        const newPoet = req.body;
        await poet_validator_1.createPoetValidator.validateAsync(newPoet);
        if (req.file) {
            newPoet.image = req.file.path.replace(/\\/g, "/");
        }
        const poet = await Poet_model_1.PoetModel.create(newPoet);
        return res.status(201).json({
            message: "Poet successfully created",
            data: poet,
        });
    }
    catch (err) {
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
async function GET_POET(req, res) {
    try {
        let { id } = req.params;
        if (!id || Number.isNaN(Number(id))) {
            return res.status(400).json({ message: "Invalid poet ID" });
        }
        let poet = await Poet_model_1.PoetModel.findByPk(Number(id), {
            include: [
                {
                    model: Book_model_1.BookModel,
                },
            ],
        });
        if (!poet) {
            return res.status(404).json({ message: "Poet not found" });
        }
        return res.json({ data: poet });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "GET_POET"
        });
    }
}
async function GET_POETS(req, res) {
    try {
        let poets = await Poet_model_1.PoetModel.findAll({
            include: [{ model: Book_model_1.BookModel }],
        });
        return res.status(200).json({ data: poets });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "GET_POETS"
        });
    }
}
async function UPDATE_POET(req, res) {
    try {
        let { id } = req.params;
        if (!id || Number.isNaN(Number(id))) {
            return res.status(400).json({ message: "Invalid poet ID" });
        }
        let data = req.body;
        if (req.file) {
            data.image = req.file.path.replace(/\\/g, "/");
        }
        await poet_validator_1.updatePoetValidator.validateAsync(data);
        let poet = await Poet_model_1.PoetModel.findByPk(Number(id));
        if (!poet) {
            return res.status(404).json({ message: "Poet not found" });
        }
        await poet.update(data);
        return res.status(200).json({
            message: "Poet successfully updated",
            data: poet,
        });
    }
    catch (err) {
        if (err.isJoi)
            return res.status(400).json({ message: err.message });
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "UPDATE_POET"
        });
    }
}
async function DELETE_POET(req, res) {
    try {
        let { id } = req.params;
        if (!id || Number.isNaN(Number(id))) {
            return res.status(400).json({ message: "Invalid poet ID" });
        }
        let poet = await Poet_model_1.PoetModel.findByPk(Number(id));
        if (!poet) {
            return res.status(404).json({ message: "Poet not found" });
        }
        await poet.destroy();
        return res.status(200).json({ message: "Poet successfully deleted" });
    }
    catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
            controller: "DELETE_POET"
        });
    }
}
