
export async function listMaterials(req, res) {
  const [rows] = await req.app.locals.db.execute(
    "SELECT id, name, category FROM materials ORDER BY id"
  );
  res.json(rows);
}


export async function deleteMaterial(req, res) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID invalido." });
  }

  const [result] = await req.app.locals.db.execute(
    "DELETE FROM materials WHERE id = ?",
    [id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: "Material nao encontrado." });
  }


  res.status(204).end();
}


export async function listComments(req, res) {
  const materialId = Number(req.params.id);
  if (!Number.isSafeInteger(materialId) || materialId <= 0) {
    return res.status(400).json({ message: "ID de material invalido." });
  }
  const [rows] = await req.app.locals.db.execute(
    `SELECT c.id, c.material_id AS materialId, u.name AS author,
            c.comment, c.created_at AS createdAt
       FROM material_comments c
       JOIN users u ON u.id = c.user_id
      WHERE c.material_id = ?
      ORDER BY c.created_at, c.id`,
    [materialId]
  );
  res.json(rows);
}


export async function createComment(req, res) {
  const materialId = Number(req.params.id);
  const { comment } = req.body || {};
  if (!Number.isSafeInteger(materialId) || materialId <= 0) {
    return res.status(400).json({ message: "ID de material invalido." });
  }
  if (typeof comment !== "string" || !comment.trim() || [...comment].length > 500) {
    return res.status(400).json({ message: "O comentario deve ter de 1 a 500 caracteres." });
  }
  const [materials] = await req.app.locals.db.execute(
    "SELECT id FROM materials WHERE id = ?",
    [materialId]
  );
  if (!materials.length) {
    return res.status(404).json({ message: "Material nao encontrado." });
  }
  const [result] = await req.app.locals.db.execute(
    "INSERT INTO material_comments (material_id, user_id, comment) VALUES (?, ?, ?)",
    [materialId, Number(req.user.sub), comment]
  );
  return res.status(201).json({
    id: result.insertId,
    materialId,
    author: req.user.name,
    comment,
    createdAt: new Date().toISOString(),
  });
}
