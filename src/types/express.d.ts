// src/types/express.d.ts

declare namespace Express {
    export interface Request {
      user?: any; // you can replace 'any' with your custom User type later
    }
  }
  