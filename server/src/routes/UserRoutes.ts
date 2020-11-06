import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJWT } from "../middlewares/checkjwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.get("/", [checkJWT, checkRole(["ADMIN"])], UserController.all);

router.get(
  "/:id([0-9]+)",
  [checkJWT, checkRole(["ADMIN"])],
  UserController.one
);

router.post("/signup", UserController.save);

router.patch(
  "/:id([0-9]+)",
  [checkJWT, checkRole(["ADMIN"])],
  UserController.updateRole
);

router.delete(
  "/:id([0-9]+)",
  [checkJWT, checkRole(["ADMIN"])],
  UserController.remove
);

router.post("/login", UserController.login);

router.post("/update",[checkJWT], UserController.update);

router.post("/forgot-password", UserController.recoverPassword);

export default router;