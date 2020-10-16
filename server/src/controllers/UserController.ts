import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import * as bcrypt from 'bcryptjs';
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { randomStringOfLength, saveVerifyCompress } from "./MemeControllerHelperMethods";
import * as nodemailer from 'nodemailer';
import {uploadfolder,visualsFolder,soundsFolder, fileSizeLimit, profilePicFolder} from '../index';

class UserController{
  
  static UserRepository = getRepository(User);

  static hashPassword(password:string,salt:string) {
    return bcrypt.hashSync(password + salt, 8);
  };
  
  static checkIfUnencryptedPasswordIsValid(unencryptedPassword: string,user:User) {
    return bcrypt.compareSync(unencryptedPassword + user.salt, user.password);
  };

  static signToken(user:User){
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWTSECRET,
      { expiresIn: "1h" }
      );
    return token;
  }
  
  static async verifyUser(res:Response){
    const id = res.locals.jwtPayload.userId;
    let user: User;
    
    try {
      user = await UserController.UserRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
      return;
    }
    return user;
  }
  
  static all = async (req: Request, res: Response) => {

    const users = await UserController.UserRepository.find({
      select: ["id", "username", "role"] 
    });
    
    res.send(users);
  };
  
  static one = async (req: Request, res: Response) => {
    
    const id: number = parseInt(req.params.id);
    
    try {
      const user = await UserController.UserRepository.findOneOrFail(id, {
        select: ["id", "username", "role"]
      });
    } catch (error) {
      res.status(404).send("User not found");
    }
  };
  
  static save = async (req: Request, res: Response) => {
    
    let { username, password, email} = req.body;
    let user = new User();
    user.username = username;
    user.email = email;
    user.profilePicFileName = "default.png";
    user.salt = randomStringOfLength(25);
    user.password = UserController.hashPassword(password,user.salt);
    user.role = "USER";
    
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send();
      return;
    }
    
    try {
      await UserController.UserRepository.save(user);
    } catch (e) {
      res.setHeader("error","username or email already in use");
      res.status(409).send();
      return;
    }

    const token = UserController.signToken(user);
    
    res.status(201).send({token:token,username:user.username,profilePic:user.profilePicFileName,email:user.email});
  };
  
  static updateRole = async (req: Request, res: Response) => {
    
    const id = req.params.id;
    
    const { username, role } = req.body;
    
    let user;
    try {
      user = await UserController.UserRepository.findOneOrFail(id);
    } catch (error) {
      res.setHeader("error","User not found");
      res.status(404).send();
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
      await UserController.UserRepository.save(user);
    } catch (e) {
      res.setHeader("error","username already in use");
      res.status(409).send();
      return;
    }

    res.status(204).send();
  };
  
  static remove = async (req: Request, res: Response) => {
    
    const id = req.params.id;
    
    let user: User;
    try {
      user = await UserController.UserRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }
    UserController.UserRepository.delete(id);
    
    res.status(204).send();
  };

  static updateUsername = async (req:Request, res: Response) => {
    
    let user = await UserController.verifyUser(res);

    if(!user){
      return;
    }

    const {newUsername } = req.body;
    if (!(newUsername)) {
      res.status(400).send();
    }
    
    user.username = newUsername;

    try {
      await UserController.UserRepository.save(user);
    } catch (e) {
      res.setHeader("error","Username already in use");
      res.status(409).send();
      return;
    }

    const newToken = UserController.signToken(user);
    
    res.setHeader("token", newToken);   
    
    res.status(201).send(user);
  }
    
  static updatePassword = async (req: Request, res: Response) => {
  
    let user = await UserController.verifyUser(res);
    
    if(!user){
      return;
    }
    
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }
    

    
    if (!UserController.checkIfUnencryptedPasswordIsValid(oldPassword,user)) {
      res.setHeader("error","Wrong password");
      res.status(401).send();
      return;
    }
    
    //validate password length
    user.password = UserController.hashPassword(newPassword,user.salt);
    const errors = await validate(user);
    if (errors.length > 0) {
      res.setHeader("error","Password must be at least 7 characters long");
      res.status(400).send();
      return;
    }
    
    UserController.UserRepository.save(user);
    
    const newToken = UserController.signToken(user);
    
    res.setHeader("token", newToken);   

    res.status(204).send();
  };

  static updateProfilePic = async (req: Request, res: Response) => {
    let user = await UserController.verifyUser(res);

    if(!user){
      return;
    }

    const newProfilePic = req.files.newProfilePic;
    if(!newProfilePic){
      res.status(400).send();
    }

    if (newProfilePic.data.length > fileSizeLimit ){     
      res.setHeader("error","Filesize too large");
      res.status(413).send();
    }

    let result = await saveVerifyCompress(newProfilePic,profilePicFolder,res);

    if(result.error){
      res.send(result.error);
    }

    user.profilePicFileName = result.filename;
    
    UserController.UserRepository.save(user);
    res.status(204).send(user);
  }

  static recoverPassword = async (req: Request, res: Response) => {
    const {email} = req.body;
    if(!email){
      res.status(400).send("Bad request");
    }
    
    let user: User;
    try {
      user = await UserController.UserRepository.findOneOrFail({ where: { email } });
    } catch (id) {
      res.setHeader("error","No account with that email exists");
      res.status(401).send();
    }
    
    user.password = randomStringOfLength(10);
    UserController.UserRepository.save(user);
    
    var transporter = nodemailer.createTransport({
      service: `${process.env.BOTMAIL_SERVICE}`,
      auth: {
        user: `${process.env.BOTMAIL_EMAIL}`,
        pass: `${process.env.BOTMAIL_PASSWORD}`
      }
    });
    
    var mailOptions = {
      from: process.env.BOTMAIL_EMAIL,
      to: user.email,
      subject: 'Password reset',
      text: 'Your temporary password is ' + user.password
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        res.status(400).send();
      } else {
        res.status(200).send();
      }
    });
  
  };
 
  static login = async (req: Request, res: Response) => {

    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    let user: User;
    try {
      console.log(await UserController.UserRepository.find());
      user = await UserController.UserRepository.findOneOrFail({ 
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
    console.log(user.password)
    
    if (!UserController.checkIfUnencryptedPasswordIsValid(password,user)) {
      res.setHeader("error","Wrong password");
      res.status(401).send();
      return;
    }
    
    const token = UserController.signToken(user);
    
    res.setHeader("token", token);   
    res.send(user);
  };
  
}
  export default UserController;