import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      validatedBody: {
        id: number,
        name: string,
        email: string
      };
      validatedInfos: {
        id: number,
        developerSince: string,
        preferredOS: string
      }
    }
  }
}
