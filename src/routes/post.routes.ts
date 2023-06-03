import { Router } from "express";
import PostController from "../controllers/post.controller";
import upload from "../services/file.service";

class PostRoute {
  public path = "/post";
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/all`, this.postController.GET);
    this.router.get(`${this.path}`, this.postController.PAGINATION);
    this.router.get(`${this.path}/:id`, this.postController.GET_ONE);
    this.router.post(
      `${this.path}`,
      upload.single("image"),
      this.postController.CREATE
    );
    this.router.put(
      `${this.path}/:id`,
      upload.single("image"),
      this.postController.UPDATE
    );
    this.router.get(`${this.path}/:id`, this.postController.DELETE);
  }
}

export default PostRoute;
