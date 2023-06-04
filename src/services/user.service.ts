import mongoose from "mongoose";
import { CreateUserDto, SignInDto, UpdateUserDto } from "../dtos/user.dto";
import { HttpException } from "../exceptions/HttpException";
import userModel from "../models/user.model";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  public users = userModel;

  public async getUsers() {
    return await this.users.find().exec();
  }

  public async getUsersWithPagination(page: number, size: number) {
    const skip = (page - 1) * size;

    const users = await this.users.find().skip(skip).limit(size).exec();

    const totalUsers = await this.users.countDocuments().exec();

    const totalPages = Math.ceil(totalUsers / size);

    return {
      users,
      currentPage: page,
      totalPages,
      totalUsers,
      usersOnPage: users.length,
    };
  }

  public async createUser(userBody: CreateUserDto) {
    console.log(userBody);
    const candidate = await this.users.findOne({ username: userBody.username });
    if (candidate!==null) {
      throw new HttpException(400, "this username already exists");
    }

    const hashedPassword = await hash(userBody.password, 7);
    const newUser = await this.users.create({
      fullname: userBody.fullname,
      username: userBody.username,
      password: hashedPassword,
    });

    return newUser;
  }

  public async getUserById(id: string) {
    const user = await this.users.findOne({ _id: id });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Indalid used id");
    }
    if (!user) {
      throw new HttpException(404, "user not found");
    }
    return user;
  }

  public async updateUser(userBody: UpdateUserDto, id: string) {
    const user = await this.getUserById(id);
    if (userBody.username) {
      const candidate = await this.users.findOne({
        username: userBody.username,
      });
      if (candidate && candidate.id !== id) {
        throw new HttpException(400, "This username already exists");
      }
    }
    let hashed = user.password;
    if (userBody.password) {
      hashed = await hash(userBody.password, 7);
    }

    const updatedUser = await this.users.updateOne(
      { _id: id },
      {
        username: userBody.username || user.username,
        fullname: userBody.fullname || user.fullname,
        password: hashed,
      },
      {
        new: true,
      }
    );
    return await this.getUserById(id);
  }

  public async deleteUser(id: string) {
    const user = await this.getUserById(id);
    await this.users.deleteOne({ _id: id });
    return { message: "user deleted" };
  }

  public async login(authBody: SignInDto) {
    const user = await this.users.findOne({ username: authBody.username });
    if (!user) {
      throw new HttpException(401, "User not authorized");
    }
    const comparePassword = compare(authBody.password, user.password);
    if (!comparePassword) {
      throw new HttpException(401, "Wrong password");
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.SECRET_KEY || "SECRET_KEY",
      {
        expiresIn: "2 days",
      }
    );
    return { user, token };
  }
}

export default UserService;
