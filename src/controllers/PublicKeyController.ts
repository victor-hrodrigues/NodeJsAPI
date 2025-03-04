import { Request, Response } from "express";
const NodeRSA = require("node-jsencrypt");

const key = new NodeRSA({ b: 1024 });

export class PublicKeyController {
  static privateKey = key.getPrivateKey("private");
  static publicKey = key.getPublicKey("public");

  async getPublicKey(req: Request, res: Response) {
    const publicKey = PublicKeyController.publicKey;
    res.send(publicKey);
  }
}
