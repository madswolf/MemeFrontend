import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers["auth"];
    let jwtPayload;
    
    try {
      jwtPayload = <any>jwt.verify(token, process.env.JWTSECRET);
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      res.status(401).send();
      console.log("bruh")
      return;
    }
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, process.env.JWTSECRET, {
      expiresIn: "1h"
    });
    res.setHeader("token", newToken);   
  
    next();
};