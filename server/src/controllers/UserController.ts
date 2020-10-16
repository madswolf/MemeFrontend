import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import * as bcrypt from 'bcryptjs';
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { randomStringOfLength } from "./MemeControllerHelperMethods";
import * as nodemailer from 'nodemailer';

class UserController{
  
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
  
  static all = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ["id", "username", "role"] 
    });
    
    res.send(users);
  };
  
  static one = async (req: Request, res: Response) => {
    
    const id: number = parseInt(req.params.id);
    
    const userRepository = getRepository(User);
    
    try {
      const user = await userRepository.findOneOrFail(id, {
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
      res.status(400).send(errors);
      return;
    }
    
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("username or email already in use");
      return;
    }

    const token = UserController.signToken(user);
    
    res.status(201).send({token:token,username:user.username,profilePic:user.profilePicFileName,email:user.email});
  };
  
  static update = async (req: Request, res: Response) => {
    
    const id = req.params.id;
    
    const { username, role } = req.body;
    
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }
    
    user.username = username;
    user.role = role;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("username already in use");
      return;
    }
    res.status(204).send();
  };
  
  static remove = async (req: Request, res: Response) => {
    
    const id = req.params.id;
    
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }
    userRepository.delete(id);
    
    res.status(204).send();
  };

  static login = async (req: Request, res: Response) => {

    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }
    
    const userRepository = getRepository(User);
    let user: User;
    try {
      console.log(await userRepository.find());
      user = await userRepository.findOneOrFail({ 
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
      console.log("wrong password")
      res.status(401).send();
      return;
    }
    
    const token = UserController.signToken(user);
      
      res.send({token:token,username:user.username,profilePic:user.profilePicFileName,email:user.email});
    };
    
  static changePassword = async (req: Request, res: Response) => {
    
    const id = res.locals.jwtPayload.userId;
    
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }
    
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }
    
    if (!UserController.checkIfUnencryptedPasswordIsValid(oldPassword,user)) {
      res.status(401).send();
      return;
    }
    
    //validate password length
    user.password = UserController.hashPassword(newPassword,user.salt);
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    
    userRepository.save(user);
    
    res.status(204).send();
  };

  static recoverPassword = async (req: Request, res: Response) => {
    const {email} = req.body;
    if(!email){
      res.status(400).send();
    }
    
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (id) {
      res.status(401).send();
    }
    
    user.password = randomStringOfLength(10);
    userRepository.save(user);
    
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
        console.log(error);
        res.status(400).send();
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send();
      }
    });
  
  };
  
}
  export default UserController;