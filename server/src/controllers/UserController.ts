import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import * as bcrypt from 'bcryptjs';
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { randomStringOfLength, saveVerifyCompress } from "./MemeControllerHelperMethods";
import * as nodemailer from 'nodemailer';
import { fileSizeLimit, profilePicFolder} from '../index';

class UserController{

  static hashPassword(password: string, salt: string) {
    return bcrypt.hashSync(password + salt, 8);
  }
  
  static checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, user: User) {
    return bcrypt.compareSync(unencryptedPassword + user.salt, user.passwordHash);
  }

  static signToken(user: User){
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWTSECRET,
      { expiresIn: "1h" }
      );
    console.log(token);
    return token;
  }
  
  static async verifyUser(res: Response){
    const id = res.locals.jwtPayload.userId;

    let user: User;
    const UserRepository = getRepository(User);

    try {
      user = await UserRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
      return;
    }

    return user;
  }
  
  static all = async (req: Request, res: Response) => {
    const UserRepository = getRepository(User);

    const users = await UserRepository.find({
      select: ["id", "username", "role"] 
    });
    
    res.send(users);
  };
  
  static one = async (req: Request, res: Response) => {
    
    const id: number = parseInt(req.params.id);
    const UserRepository = getRepository(User);
    
    try {
      const user = await UserRepository.findOneOrFail(id, {
        select: ["id", "username", "role"]
      });

      return res.send(user);

    } catch (error) {
      res.status(404).send("User not found");
    }
  };
  
  static save = async (req: Request, res: Response) => {
    
    const { username, password, email} = req.body;
    const user = new User();

    user.username = username;
    user.email = email;
    user.profilePicFileName = "default.jpg";
    user.salt = randomStringOfLength(25);
    user.passwordHash = UserController.hashPassword(password, user.salt);
    user.role = "USER";
    
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send();
      return;
    }

    const UserRepository = getRepository(User);
    
    try {
      await UserRepository.save(user);
    } catch (e) {
      res.status(409).send({error: "username or email already in use"});
      return;
    }

    const token = UserController.signToken(user);

    res.status(201).send({
      username: user.username,
      profilePicFileName: user.profilePicFileName,
      email: user.email,
      token: token
    });
  };
  
  static updateRole = async (req: Request, res: Response) => {
    
    const id = req.params.id;
    
    const { username, role } = req.body;
    const UserRepository = getRepository(User);
    
    let user;
    try {
      user = await UserRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send({error: "User not found"});
      return;
    }
    
    user.username = username;
    user.role = role;

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send();
      return;
    }
    
    try {
      await UserRepository.save(user);
    } catch (e) {
      res.status(409).send({error: "username already in use"});
      return;
    }

    res.status(204).send();
  };
  
  static remove = async (req: Request, res: Response) => {
    
    const {password} = req.body;

    if (!(password)) {
      res.status(400).send();
    }
    
    const user = await UserController.verifyUser(res);

    if(!user){
      return;
    }

    if (!UserController.checkIfUnencryptedPasswordIsValid(password, user)) {
      res.status(401).send({error: "Wrong password"});
      return;
    }

    const UserRepository = getRepository(User);
    UserRepository.delete(user.id);

    res.status(204).send();
    return;
  };

  static update = async (req: Request, res: Response) => {

    const user = await UserController.verifyUser(res);

    if(!user){
      return;
    }

    
    const UserRepository = getRepository(User);

    if (!UserController.checkIfUnencryptedPasswordIsValid(req.body.password, user)) {
      res.status(401).send({error: "Wrong password"});
      return;
    }

    if(req.body.profilePic){
      const newProfilePic = req.body.profilepic;
      if (newProfilePic.data.length > fileSizeLimit){
        res.status(413).send({error: "Filesize too large"});
        return;
      }
  
      const result = await saveVerifyCompress(newProfilePic, profilePicFolder, res);
  
      if(result.error){
        res.status(400);
        res.send(result.error);
        return;
      }
  
      user.profilePicFileName = result.filename;
    }

    if(req.body.username){
      const doesExist = await UserRepository.find({where: { username: req.body.username }})
      if(doesExist){
        user.username = req.body.username;
      }else{
        res.status(409).send({error: "Username already in use"});
        return;
      }
    }

    if(req.body.email){
      const doesExist = await UserRepository.find({where: { email: req.body.email }})

      if(doesExist){
        user.email = req.body.email;
      }else{
        res.status(409).send({error: "Email already in use"});
        return;
      }
    }

    if(req.body.newPassword){
      user.passwordHash = UserController.hashPassword(req.body.newPassword, user.salt);

      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send({error: "Password must be at least 7 characters long"});
        return;
      }
    }

    try {
      await UserRepository.save(user);
    } catch (e) {
      return res.status(409).send({error: e});
    }


    const newToken = UserController.signToken(user);

    res.status(204).send({
      username: user.username,
      profilePicFileName: user.profilePicFileName,
      email: user.email,
      token: newToken
    });
    return;
  }

  static recoverPassword = async (req: Request, res: Response) => {
    const {email} = req.body;

    if(!email){
      res.status(400).send("Bad request");
      return;
    }
    
    const UserRepository = getRepository(User);
    let user: User;

    try {
      user = await UserRepository.findOneOrFail({where: [{ email: email }, { username: email}]});
    } catch (id) {
      res.status(401).send({error:"No account with that email or username exists"});
      return;
    }

    const tmpPassword = randomStringOfLength(10);
    user.passwordHash = UserController.hashPassword(tmpPassword,user.salt);

    UserRepository.save(user);
    
    const transporter = nodemailer.createTransport({
      service: `${process.env.BOTMAIL_SERVICE}`,
      auth: {
        user: `${process.env.BOTMAIL_EMAIL}`,
        pass: `${process.env.BOTMAIL_PASSWORD}`
      }
    });
    
    const mailOptions = {
      from: process.env.BOTMAIL_EMAIL,
      to: user.email,
      subject: 'Password reset',
      text: 'Your temporary password is ' + tmpPassword
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        res.status(400).send();
      } else {
        res.status(200).send({email: user.email});
      }
      return;
    });
  
  };
 
  static login = async (req: Request, res: Response) => {

    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send();
    }

    const UserRepository = getRepository(User);

    let user: User;
    try {
      user = await UserRepository.findOneOrFail({ 
        where: [
          { username: username },
          { email: username }
        ]
       });

    } catch (error) {
      console.log(error)
      res.status(401).send();
      return;
    }
    
    if (!UserController.checkIfUnencryptedPasswordIsValid(password, user)) {
      res.status(401).send({error: "Wrong password"});
      return;
    }
    
    const token = UserController.signToken(user);
    
    res.send({
      username: user.username,
      profilePicFileName: user.profilePicFileName,
      email: user.email,
      token: token
    });
    return;
  };
  
}
  export default UserController;