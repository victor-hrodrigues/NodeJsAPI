import { ValidateOtpEmail } from "../interfaces/Request/ValidateOtpEmail";
import { ApiError, BadRequestError } from "./api-erros";
import { decryptJsonString, encryptObject } from "./cryptObject";

export function generateOtpHash(
  username: string,
  time: number
): { hash: string; otp: number } {
  const datetime = new Date();
  datetime.setMinutes(datetime.getMinutes() + time);
  const expiration = datetime.getTime();
  const otp = Math.floor(10000 + Math.random() * 90000);

  const json = JSON.stringify({ username, expiration, otp });
  const hash = encryptObject(json);

  return { hash, otp };
}

export function validateOtpEmailHash(
  { username, otp }: Partial<ValidateOtpEmail>,
  hash: string
): boolean | ApiError {
  const hashObject = decryptJsonString(hash);
  const payload = JSON.parse(hashObject) as ValidateOtpEmail;

  const timestamp = new Date().getTime();

  if (payload.username === username && payload.otp === otp) {
    if (payload.expiration < timestamp) {
      return new BadRequestError("Code expired!\r\nTry again later.");
    }
    return true;
  }
  return false;
}
