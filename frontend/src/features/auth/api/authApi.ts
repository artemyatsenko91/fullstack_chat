import { AxiosError } from "axios";
import { axiosInstance } from "../../../utils/axiosInstance";

export const login = async (value: { userName: string; password: string }) => {
  try {
    const response = await axiosInstance.post<{ access_token: string }>(
      "/users/login",
      value
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const registration = async (value: {
  userName: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post<{
      id: string;
      userName: string;
    }>("/users/register", value);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};
