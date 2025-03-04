import { Request, Response } from "express";
import { ApiError } from "../helpers/api-erros";
import { formatHtml } from "../helpers/emailSender";
import { confirmationEmailTemplate } from "../helpers/htmlTemplates/confirmationEmailTemplate";
import { UserService } from "../services/UserServices";

export class UserController {
  async create(req: Request, res: Response) {
    const service = new UserService();
    const url = `${process.env.BASE_URL}/api/auth`;

    const result = await service.create(req.body, url);

    if (result instanceof ApiError) {
      return res.status(result.statusCode).json(result.message);
    }

    return res.status(201).json();
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;

    const service = new UserService();
    const url = `${process.env.BASE_URL}/api/auth`;

    const result = await service.login(username, password, url);

    if (result instanceof ApiError) {
      return res.status(result.statusCode).json(result.message);
    }

    return res.json({
      user: result.user,
      token: result.token,
    });
  }

  async generateOtpValidateEmail(req: Request, res: Response) {
    const service = new UserService();
    const email = req.body.email;
    const url = `${process.env.BASE_URL}/api/auth`;

    const result = await service.generateOtpValidateEmail(email, url);

    if (result instanceof ApiError) {
      return res.status(result.statusCode).json(result.message);
    }

    return res.json(result);
  }

  async validateOtpEmail(req: Request, res: Response) {
    const service = new UserService();
    const token = String(req.query.code);
    const url = `${process.env.BASE_URL}/api/auth`;

    const validationResult = await service.validateOtpEmail(token, url);
    const { message, data } = validationResult;

    if (data instanceof ApiError) {
      return res
        .send(formatHtml("@message", message, confirmationEmailTemplate))
        .status(data.statusCode)
        .json(data.message);
    }

    return res.send(formatHtml("@message", message, confirmationEmailTemplate));
  }

  async checkUser(req: Request, res: Response) {
    const { email } = req.query;
    const service = new UserService();
    const result = await service.checkUser(String(email));
    if (result instanceof ApiError) {
      return res.status(result.statusCode).json(result.message);
    }
    return res.status(200).json();
  }
}
