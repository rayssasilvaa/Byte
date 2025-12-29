import { Router } from "express";
import { openSale } from "../controllers/sales.controller.js";

const router = Router();

// Abrir nova venda
router.post("/sales/open", openSale);

export default router;
