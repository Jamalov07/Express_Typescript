import { Request } from "express";
import { CreatePostDto, UpdatePostDto } from "../dtos/post.dto";
import { HttpException } from "../exceptions/HttpException";
import postModel from "../models/post.model";
import userModel from "../models/user.model";
import mongoose from "mongoose";
import fs from "fs";

class PostService {
  public posts = postModel;
  public users = userModel;

  public async getPosts() {
    return this.posts.find().exec();
  }

  public async getPostsWithPagination(page: number, size: number) {
    const skip = (page - 1) * size;

    const posts = await this.posts.find().skip(skip).limit(size).exec();

    const totalPosts = await this.posts.countDocuments().exec();
    const totalPages = Math.ceil(totalPosts / size);

    return {
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      postsOnPage: posts.length,
    };
  }

  public async getPostById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid post id");
    }

    const post = await this.posts.findOne({ _id: id });
    if (!post) {
      throw new HttpException(404, "post not found");
    }
    return post;
  }

  public async createNewPost(postBody: CreatePostDto, req: Request) {
    const candidate = await this.posts.findOne({ title: postBody.title });

    if (candidate) {
      throw new HttpException(400, "This title already exists in another post");
    }
    const user = await this.users.findOne({ _id: postBody.owner });
    if (!user) {
      throw new HttpException(400, "user not found");
    }

    const newPost = await this.posts.create({
      title: postBody.title,
      image: req.file?.filename || "",
      description: postBody.description,
      owner: postBody.owner,
    });

    return newPost;
  }

  public async updatePost(postBody: UpdatePostDto, id: string, req: Request) {
    const post = await this.getPostById(id);
    let image = post.image;
    if (req.file) {
      if (fs.existsSync(`./public/images/${post.image}`)) {
        fs.unlinkSync(`./public/images/${post.image}`);
      }
      image = req.file.filename;
    }
    const updatedPost = await this.posts.updateOne(
      { _id: id },
      {
        title: postBody.title || post.title,
        description: postBody.description || post.description,
        image: image,
      },
      {
        new: true,
      }
    );
    return updatedPost;
  }

  public async deletePost(id: string) {
    const post = await this.getPostById(id);

    if (post.image) {
      try {
        fs.unlinkSync(`./public/images/${post.image}`);
      } catch (error) {
        console.log(error);
      }
    }

    await this.posts.deleteOne({ _id: id });
    return { message: "post deleted" };
  }
}

export default PostService;
