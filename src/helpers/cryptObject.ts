import { PublicKeyController } from "../controllers/PublicKeyController";
import { BadRequestError } from "./api-erros";
const NodeRSA = require("node-jsencrypt");

function encryptObject(jsonString: string): string {
  if (!jsonString) {
    throw new BadRequestError("The original object is null or undefined");
  }

  const publicKey = PublicKeyController.publicKey;
  const rsa = new NodeRSA();
  rsa.setPublicKey(publicKey);
  const encryptedText = rsa.encrypt(jsonString);
  return encryptedText;
}

function decryptJsonString(encryptedJsonString: string): string {
  if (!encryptedJsonString) {
    throw new BadRequestError("The encrypted object is null or undefined");
  }

  const privateKey = PublicKeyController.privateKey;
  const rsa = new NodeRSA();
  rsa.setPrivateKey(privateKey);
  const decryptedObject = rsa.decrypt(encryptedJsonString);
  return decryptedObject;
}

export { decryptJsonString, encryptObject };
