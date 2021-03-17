import { Router } from "express";
import {TopicController} from "../controllers/TopicController"
import { checkJWT } from "../middlewares/checkjwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.get("/:topic", [checkJWT, checkRole(["ADMIN"])], TopicController.one);

router.post("/", [checkJWT], TopicController.save);

router.delete("/:topic", [checkJWT], TopicController.remove);

router.post("/:topic/:username", [checkJWT], TopicController.update)

export default router;