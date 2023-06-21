import { Router } from "express";
import UserController from "../controllers/user.controller";

class UserRoute {
  public path = "/user";
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/csv`, this.userController.TOCSV);
    this.router.get(`${this.path}/all`, this.userController.GET);
    this.router.get(`${this.path}`, this.userController.PAGINATION);
    this.router.get(`${this.path}/:id`, this.userController.GET_ONE);
    this.router.post(`${this.path}`, this.userController.CREATE);
    this.router.post(`${this.path}/signin`, this.userController.SIGNIN);
    this.router.put(`${this.path}/:id`, this.userController.UPDATE);
    this.router.delete(`${this.path}/:id`, this.userController.DELETE);
  }
}

export default UserRoute;
