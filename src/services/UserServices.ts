import bcrypt from "bcrypt";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import {
  ApiError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../helpers/api-erros";
import { formatHtmlUrl, sendEmailMessage } from "../helpers/emailSender";
import { otpValidateEmailTemplate } from "../helpers/htmlTemplates/otpValidateEmailTemplate";
import {
  generateOtpHash,
  validateOtpEmailHash,
} from "../helpers/otpValidation";
import { User } from "../interfaces/Models/User";
import { ValidateOtpEmail } from "../interfaces/Request/ValidateOtpEmail";
import { ValidationResultEmail } from "../interfaces/Response/ValidationResultEmail";
import {
  logApiError,
  logError,
  logExternalError,
} from "../middlewares/logMiddleware";
import { userRepository } from "../repositories/userRepository";

export class UserService {
  async create(users: User, url: string): Promise<void | ApiError> {
    try {
      const userExists = await this.checkUser(users.email);
      if (userExists instanceof ApiError) {
        logExternalError(userExists);
        return userExists;
      }

      await this.generateOtpValidateEmail(users.email, url);
      return;
    } catch (error: any) {
      logError(error);
      return new InternalServerError(`Failed to create user.`);
    }
  }

  async login(
    username: string,
    password: string,
    url: string
  ): Promise<{ user: Omit<User, "password">; token: string } | ApiError> {
    try {
      const user = await userRepository.findOneBy({ email: username });

      if (user) {
        if (!user.versionTermsOfUseAccepted) {
          await this.generateOtpValidateEmail(user.email, url);
          const err = new BadRequestError(
            "You're not registered yet.\r\nWe've sent the activation code to your email again."
          );
          logApiError(err);
          return err;
        }

        const verifyPass = await bcrypt.compare(password, user.password);

        if (!verifyPass) {
          const err = new BadRequestError("Incorrect username or password");
          logApiError(err);
          return err;
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? "", {
          expiresIn: "24h",
        });

        const sanitizedResponse = {
          user: { ...user, password: undefined },
          token,
        };

        return sanitizedResponse;
      } else {
        const err = new BadRequestError(
          'You have not registered with us yet.\r\nClick on the "Register" button to enjoy our app.'
        );
        logApiError(err);
        return err;
      }
    } catch (error: any) {
      logError(error);
      return new InternalServerError(
        `Failed to authenticate user.\r\nRestart your app and try again.`
      );
    }
  }

  async generateOtpValidateEmail(
    email: string,
    url: string
  ): Promise<string | ApiError> {
    try {
      const result = generateOtpHash(email, 1440);

      const token = jwt.sign(
        { username: email, hash: result.hash, otp: result.otp },
        process.env.JWT_PASS ?? "",
        { expiresIn: "24h" }
      );

      await sendEmailMessage(
        email,
        "YOUR COMPANY NAME: Account validation",
        formatHtmlUrl("@token", token, "@url", url, otpValidateEmailTemplate)
      );

      return result.hash;
    } catch (error: any) {
      logError(error);
      return new InternalServerError("Failed to generate verification code");
    }
  }

  async validateOtpEmail(
    token: string,
    url: string
  ): Promise<ValidationResultEmail> {
    let email = "";
    let message = "";

    try {
      const { username, otp, hash } = jwt.verify(
        token,
        process.env.JWT_PASS ?? "",
        {
          ignoreExpiration: true,
        }
      ) as ValidateOtpEmail;
      email = username;

      const result = validateOtpEmailHash({ username, otp }, hash);
      if (result instanceof ApiError) {
        message =
          "Hello, this link is invalid.\r\nPlease, check your email and try again later.";
        logApiError(result);
        return { message, data: result };
      }

      if (result) {
        const user = await userRepository.findOneBy({ email });

        if (!user) {
          const err = new NotFoundError("User not found.");
          logApiError(err);
          message =
            "Hello! Your user was not found, please register through our app.";
          return { message, data: err };
        }

        if (user.versionTermsOfUseAccepted != null) {
          message = `Hello ${user?.name}!\r\nYour email was already verified.`;
          return { message, data: user };
        }

        Object.assign(user, {
          versionTermsOfUseAccepted: "2025-03-04",
        });

        const updatedUser = await userRepository.save(user);

        message = `Hello ${updatedUser.name}!\r\nYour email is now verified!\r\nProceed through our app.`;
        return { message, data: updatedUser };
      } else {
        message =
          "Hello, this link is invalid.\r\nPlease, check your email and try again later.";
        return { message, data: new BadRequestError("Invalid code") };
      }
    } catch (error: any) {
      logError(error);

      if (error instanceof TokenExpiredError) {
        const message =
          "Hello! Unfortunately this code expired, we'll send you another code.";
        await this.generateOtpValidateEmail(email, url);
        return { message, data: new UnauthorizedError("Code expired") };
      }

      return new InternalServerError("Failed to generate verification code.");
    }
  }

  async checkUser(email: string | undefined): Promise<boolean | ApiError> {
    const user = await userRepository.findOneBy({ email });
    if (user) {
      return new BadRequestError(
        "We verified that you're already registered in our app.\r\nPlease use this username to log into our app."
      );
    }

    return true;
  }
}
