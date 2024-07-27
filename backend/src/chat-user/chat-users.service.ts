import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ChatUser, UsersDocument } from "./models/chat-user-model";
import { Model } from "mongoose";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(ChatUser.name)
        private readonly usersModel: Model<UsersDocument>,
    ) {
        process.on("SIGINT", async () => {
            await this.removeAllUsers();
        });
    }

    public async getAllUsers() {
        return this.usersModel.find();
    }

    public async getUser(query: { userName?: string; socketId?: string }) {
        return this.usersModel.findOne(query);
    }

    public async removeUser(socketId: string): Promise<void> {
        const user = await this.getUser({ socketId });
        if (user) await this.usersModel.findByIdAndDelete({ _id: user._id });
    }

    public async removeAllUsers(): Promise<void> {
        await this.usersModel.deleteMany();
    }

    public async addUser(
        socketId: string,
        userName: string,
    ): Promise<ChatUser> {
        const user = await this.usersModel.create({
            socketId,
            userName,
        });

        await user.save();

        return user;
    }
}
