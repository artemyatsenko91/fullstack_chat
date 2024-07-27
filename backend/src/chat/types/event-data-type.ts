import { Types } from "mongoose";

export type TEventData = {
    userName: string;
    socketId: string;
    id: Types.ObjectId;
    status: string;
    roomName: string;
};
