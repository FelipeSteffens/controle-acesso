import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import db from "../config/database.js"

export async function lista(req, res) {
    const [rows] = await db.query("SELECT id, name, category FROM materials")
    return res.json(rows);
}

export async function deletar(req, res) {
    const id = Number(req.params.id);

    if (!Number(id) <= 0) {
        return res.status(400).json({ message: "ID Inválido." })
    }
    const [result] = await db.query("DELETE FROM materials WHERE id = ?", [id])

    if (!result.affectedRows) {
        return res.status(404).json({ message: "Máterial não encontrado" })
    }
    return res.status(204).end()
}