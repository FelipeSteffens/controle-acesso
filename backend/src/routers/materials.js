import { Router } from "express";
import { listMaterials, deleteMaterial, listComments, createComment } from "../controllers/materials.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();
// AUTENTICA??O: todas as rotas abaixo exigem um token v?lido.
router.use(authenticate);
// Admin e usu?rio podem consultar.
router.get("/", listMaterials);
router.get("/:id/comments", listComments);
router.post("/:id/comments", createComment);
// AUTORIZA??O (RBAC): apenas o perfil admin pode excluir.
router.delete("/:id", requireRole("admin"), deleteMaterial);
export default router;
