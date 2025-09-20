import axios from "axios";
import { environment } from "../environment";

const API_BASE_URL = environment.ENV_URL;

export interface AddFriendRequestDto {
    userId:number;
    name:string;
}

export interface FriendsResponseBody {
    id:number;
    name:string;
    groupsList:string[];
    owesYou:number;
    youOwe:number;
}

export const addFriend = (addFriendRequestDto:AddFriendRequestDto) => {
    return axios
        .post<string>(`${API_BASE_URL}/api/friends`, addFriendRequestDto)
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response?.data?.message || "Adding friend failed")
        });
};

export const getFriendsWithDetails= (userId:number) => {
  return axios
      .get<FriendsResponseBody[]>(`${API_BASE_URL}/api/friends/${userId}`)
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response?.data?.message || "Fetching friends failed")
        });
};