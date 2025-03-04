import { AppDataSource } from "./AppDataSource";
import { User } from "../interfaces/Models/User";

export const userRepository = AppDataSource.getRepository(User);
