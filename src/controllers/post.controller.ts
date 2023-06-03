import { NextFunction, Request, Response } from "express";
import PostService from "../services/post.service";
import { CreatePostDto, UpdatePostDto } from "../dtos/post.dto";

class PostController {
  public postService = new PostService();

  public GET = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.postService.getPosts());
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

      res.json(await this.postService.getPostsWithPagination(page, size));
    } catch (error) {
      console.log(error);
    }
  };

  public GET_ONE = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      res.json(await this.postService.getPostById(id));
    } catch (error) {
      console.log(error);
    }
  };

  public CREATE = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postBody: CreatePostDto = req.body;
      res.json(await this.postService.createNewPost(postBody, req));
    } catch (error) {
      console.log(error);
    }
  };

  public UPDATE = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postBody: UpdatePostDto = req.body;
      const id = req.params.id;
      res.json(await this.postService.updatePost(postBody, id, req));
    } catch (error) {
      console.log(error);
    }
  };

  public DELETE = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      res.json(await this.postService.deletePost(id));
    } catch (error) {
      console.log(error);
    }
  };
}

export default PostController;
