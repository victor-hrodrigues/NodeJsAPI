import { Router } from "express";
import { PublicKeyController } from "../controllers/PublicKeyController";
import { UserController } from "../controllers/UserController";
import { logMiddleware } from "../middlewares/logMiddleware";

const routes = Router();
const prefixAuth = "/api/auth";

routes.use(logMiddleware);

routes.post(prefixAuth + "/register", new UserController().create);
routes.post(prefixAuth + "/login", new UserController().login);
routes.get(prefixAuth + "/public-key", new PublicKeyController().getPublicKey);

routes.post(
  prefixAuth + "/generate-otp-validate-email",
  new UserController().generateOtpValidateEmail
);
routes.get(prefixAuth + "/active-email", new UserController().validateOtpEmail);

export default routes;
