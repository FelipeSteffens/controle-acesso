import { registerLog } from "./log";




// Lista materiais para qualquer usuario autenticado.
export async function listMaterials(req, res) {
  const [rows] = await req.app.locals.db.execute(
    "SELECT id, name, category FROM materials ORDER BY id"
  );
  res.json(rows);
}

// Exclui material: a rota ja garante que apenas admin chega aqui.
export async function deleteMaterial(req, res) {
  const id = Number(req.params.id);

  const usuario_id = 0; // Substitua pelo ID do usuário autenticado
  const acao = "DELETE";
  const recurso_afetado = "materials";
  const id_recurso_afetado = id;
  const valor_antigo = null;
  const valor_novo = null;
  const campos_alterados = null;
  const ip = req.connection.remoteAddress;
  const status_acao = "FRACASSO";

  const obj = {
    usuario: usuario_id,
    acao: acao,
    recurso_afetado: recurso_afetado,
    id_recurso_afetado: id_recurso_afetado,
    valor_antigo: valor_antigo,
    valor_novo: valor_novo,
    campos_alterados: campos_alterados,
    ip: ip,
    status_acao: "",
  }

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

  // 204 significa sucesso sem conte?do na resposta.
  res.status(204).end();
}