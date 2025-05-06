//Might be used in final upload to production
import { textChat } from "../controllers/ai.controller.js";
import { Router } from "express";


const aiRouter = Router();

aiRouter.post("/", textChat);

export default aiRouter;