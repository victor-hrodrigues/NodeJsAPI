import { User } from "../../interfaces/Models/User";
import { ApiError } from "../../helpers/api-erros";

export interface ValidationResultEmail {
  message: string;
  data?: User | ApiError;
}
