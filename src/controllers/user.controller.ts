import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import { CreateUserDto, SignInDto, UpdateUserDto } from "../dtos/user.dto";

class UserController {
  public userService = new UserService();

  public GET = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.userService.getUsers());
    } catch (error) {
      console.log(error);
    }
  };

  public PAGINATION = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 5;
      res.json(await this.userService.getUsersWithPagination(page, size));
    } catch (error) {
      console.log(error);
    }
  };

  public GET_ONE = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      res.json(await this.userService.getUserById(id));
    } catch (error) {
      console.log(error);
    }
  };

  public CREATE = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userBody: CreateUserDto = req.body;
      res.json(await this.userService.createUser(userBody));
    } catch (error) {
      console.log(error);
    }
  };

  public UPDATE = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userBody: UpdateUserDto = req.body;
      const id = req.params.id;
      res.json(await this.userService.updateUser(userBody, id));
    } catch (error) {
      console.log(error);
    }
  };

  public DELETE = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      res.json(await this.userService.deleteUser(id));
    } catch (error) {
      console.log(error);
    }
  };

  public SIGNIN = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authBody: SignInDto = req.body;
      res.json(await this.userService.login(authBody));
    } catch (error) {
      console.log(error);
    }
  };
}

export default UserController;
