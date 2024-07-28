import { AxiosError } from "axios";
import { axiosInstance } from "../../../utils/axiosInstance";
import { IChatUsersType, IRoomsResponse } from "../components/SIdeMenu/types";

export const getChatUsers = async () => {
  try {
    const response = await axiosInstance.get<IChatUsersType[]>("/chat/users");

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const getChatRooms = async () => {
  try {
    const response = await axiosInstance.get<IRoomsResponse[]>("/chat/rooms");

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const getChatRoomByName = async (roomName: string) => {
  try {
    const response = await axiosInstance.post<IRoomsResponse>("/chat/room", {
      roomName,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};
