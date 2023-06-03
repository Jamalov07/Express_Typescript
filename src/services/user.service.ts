import mongoose from "mongoose";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { HttpException } from "../exceptions/HttpException";
import userModel from "../models/user.model";
import { hash } from "bcrypt";

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
    const candidate = await this.users.findOne({ username: userBody.username });
    if (candidate) {
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
}

export default UserService;
