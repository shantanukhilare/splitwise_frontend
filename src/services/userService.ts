import axios from "axios";
import { environment } from "../environment";

const API_BASE_URL = environment.ENV_URL;

interface UserResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export const userLogin = (
  credentials: string,
  password: string
): Promise<UserResponse> => {
  return axios
    .post<UserResponse>(`${API_BASE_URL}/api/users/login`, {
      credentials,
      password,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response?.data?.message || "Login failed");
    });
};

export const userRegister = (
    name: string,
    email: string,
    phoneNumber: string,
    password: string
) =>{
    return axios
        .post<string>(`${API_BASE_URL}/api/users`, {
            name,email,phoneNumber,password
        })
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response?.data?.message || "Registration failed")
        });
};