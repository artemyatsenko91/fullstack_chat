import { ReturnedUserDTO } from "./dto/returnedUser.dto";
import { UserDocument } from "./models/user.model";

export const returnUserInfo = (user: UserDocument): ReturnedUserDTO => {
    return {
        id: String(user._id),
        userName: user.userName,
    };
};
