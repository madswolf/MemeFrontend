import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.get("/", [checkJwt, checkRole(["ADMIN"])], UserController.all);

router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  UserController.one
);

router.post("/signup", UserController.save);

router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  UserController.updateRole
);

router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  UserController.remove
);

router.post("/login", UserController.login);

router.post("/update",[checkJwt], UserController.update);

router.post("/change-password", [checkJwt], UserController.updatePassword);

router.post("/forgot-password", UserController.recoverPassword);

export default router;