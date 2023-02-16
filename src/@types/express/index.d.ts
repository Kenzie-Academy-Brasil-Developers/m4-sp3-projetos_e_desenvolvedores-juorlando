import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      validatedBody: {
        id: number;
        name: string;
        email: string;
      };
      validatedInfos: {
        id: number;
        developerSince: string;
        preferredOS: string;
      };
      validatedProject: {
        id: number;
        name: string;
        description: string;
        estimatedTime: string;
        repository: string;
        startDate: Date;
        endDate: Date;
      };
      validatedTechonology: {
        id: number;
        name: string;
      };
    }
  }
}
