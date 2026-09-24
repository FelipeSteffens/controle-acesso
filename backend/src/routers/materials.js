import { Router } from "express";
import { deletar, lista } from "../controllers/materials.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const routerMaterials = Router();

routerMaterials.use(authenticate);

routerMaterials.get("/", lista)
routerMaterials.delete("/:id", requireRole("admin"), deletar)

export default routerMaterials;