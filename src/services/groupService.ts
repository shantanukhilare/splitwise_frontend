import axios from 'axios';
import { environment } from '../environment';

const API_BASE_URL=environment.ENV_URL;
export interface Group {
  groupName: string;
  memberCount: number;
  groupId?: number;
}

export type GroupType =     'TRIP' | 'HOME' | 'COUPLE' | 'FRIENDS' | 'FAMILY' | 'OTHER'


export interface CreateGroupPayload {
  name: string;
  groupType: string;
  createdBy: number;
  userIds: number[];
}

export interface ExpenseGroupResponseBody {
  groupId:number;
  groupName: string;
  memberCount: number;
}

export interface FriendResponseBody{
     userId:number;
     name:string;
}

export interface GroupMembersResponseBody{
  id:number;
  name:string;
}

export const createGroup = (createGroupPayload: CreateGroupPayload) => {
  return axios
    .post<string>(`${API_BASE_URL}/api/groups`, createGroupPayload)
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response?.data?.message || "Group creation failed");
    });
};

export const getGroupById=(groupId:number)=>{
  const response=axios.get<Group>(`${API_BASE_URL}/api/groups/${groupId}`)
    .then((res)=>res.data)
    .catch((err)=>{
      throw new Error(err.response?.data?.message || "Fetching group failed")
    });
  return response;
};

export const getGroupMembers=(id:number)=>{
  const response=axios.get<GroupMembersResponseBody[]>(`${API_BASE_URL}/api/groups/members/${id}`)
    .then((res)=>res.data)
    .catch((err)=>{
      throw new Error(err.response?.data?.message || "Fetching group members failed")
    });
  return response;
};

export const getGroupsByUserId = (userId: number): Promise<ExpenseGroupResponseBody[]> => {
  return axios
    .get(`${API_BASE_URL}/api/groups/user`, {
      params: { userId },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response?.data?.message || "Fetching groups failed");
    });
};



export const getAllGroupNames=()=>{
  const response=axios.get<string[]>(`${API_BASE_URL}/api/groups`)
    .then((res)=>res.data)
    .catch((err)=>{
      throw new Error(err.response?.data?.message || "Fetching all groups failed")
    });
  return response;
}

export const addGroupMembers=(userIds:number[],groupId:number)=>{
  const response=axios.post<string>(`${API_BASE_URL}/api/groups/addMembers`,{
    userIds,groupId
  })
    .then((res)=>res.data)
    .catch((err)=>{
      throw new Error(err.response?.data?.message || "Adding group members failed")
    });
  return response;
}

export const friendsList=(userId:number)=>{
  const response=axios.get<FriendResponseBody[]>(`${API_BASE_URL}/api/groups/friends/${userId}`)
    .then((res)=>res.data)
    .catch((err)=>{
      throw new Error(err.response?.data?.message || "Fetching friends list failed")
    });
  return response;
};

export const friendsNames=(userId:number)=>{
  const response=axios.get<string[]>(`${API_BASE_URL}/api/groups/friendsNames/${userId}`)
    .then((res)=>res.data)
    .catch((err)=>{
      throw new Error(err.response?.data?.message || "Fetching friends names failed")
    });
  return response;
};
