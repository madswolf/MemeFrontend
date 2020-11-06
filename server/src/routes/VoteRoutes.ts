import { Router } from "express";
import VoteController from "../controllers/VoteController";
import { checkJWT } from "../middlewares/checkjwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.get("/", [checkJWT, checkRole(["ADMIN"])], VoteController.all);

router.get(
  "/:id([0-9]+)",
  [checkJWT, checkRole(["ADMIN"])],
  VoteController.one
);

router.post("/", [checkJWT], VoteController.save);

export default router;