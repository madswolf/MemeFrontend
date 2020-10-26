import { Router } from "express";
import VoteController from "../controllers/VoteController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.get("/", [checkJwt, checkRole(["ADMIN"])], VoteController.all);

router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  VoteController.one
);

router.post("/", [checkJwt], VoteController.save);

export default router;