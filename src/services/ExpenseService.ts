import axios from 'axios';
import { environment } from '../environment';

const API_BASE_URL=environment.ENV_URL+"/api/expenses";

export interface CreateEvenExpenseRequestBody{
    groupId:number;
    userId:number;
    description:string;
    amount:number;
    splitType:SplitType;
}

export type SplitType = 'EVENLY' | 'UNEVENLY';

export interface unevenAmounts{
    userId:number;
    amount:number;
}

export interface CreateUnevenExpenseRequestBody{
     groupId:number;
    paidByUserId:number;
    description:string;
    unevenAmounts:unevenAmounts;
    type:SplitType;
}

export interface UserBalanceDto {
    userId:number;
    userName:string;
    amount:number;
}

export interface RecentActivity {
  groupName:string;
  activity:string;
}


export const addExpense=(payload:CreateEvenExpenseRequestBody)=>{
    return axios.post<string>(`${API_BASE_URL}`,payload)
    .then((res)=>res.data)
    .catch((err)=>{
        throw new Error(err.response?.data?.message || "Adding expense failed")
    });
};

export const addUnevenExpense=(payload:CreateUnevenExpenseRequestBody)=>{
    return axios.post<string>(`${API_BASE_URL}/uneven`,payload)
    .then((res)=>res.data)
    .catch((err)=>{
        throw new Error(err.response?.data?.message || "Adding uneven expense failed")
    });
};

export const contribution = (paidBy: number, groupId: number) => {
  return axios
    .get<number>(`${API_BASE_URL}/myContribution`, {
      params: {
        paidBy,
        groupId,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response?.data?.message || "Fetching contribution failed");
    });
};

// export const updateExpenseSplit = (id: number, updatedSplit: any) => {
//   return axios
//     .put(`${API_BASE_URL}/${id}`, updatedSplit)
//     .then((res) => res.data)
//     .catch((err) => {
//       throw new Error(err.response?.data?.message || "Updating expense split failed");
//     });
// };

export const getExpensesByGroupId = (groupId: number) => {
  return axios
    .get(`${API_BASE_URL}/${groupId}`)
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response?.data?.message || "Fetching expenses failed");
    });
};

export const getGroupWiseAmountsIOwe = (groupId: number, userId: number) => {
  return axios
    .get<UserBalanceDto[]>(`${API_BASE_URL}/owe/${groupId}`, {
      params: { userId },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response?.data?.message || "Fetching owed amounts failed");
    });
};

export const getGroupWiseAmountsOwedToMe = (groupId: number, userId: number) => {
  return axios
    .get<UserBalanceDto[]>(`${API_BASE_URL}/owed-to-me/${groupId}`, {
      params: { userId },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response?.data?.message || "Fetching owed-to-me amounts failed");
    });
};

export const getGroupWiseNetWithCounterparties=(groupId: number, userId: number)=>{
    return axios
    .get<UserBalanceDto[]>(`${API_BASE_URL}/net/`, {
      params: { userId,groupId },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response?.data?.message || "Fetching net amounts with counterparties failed");
    });
};

export const getRecentActivityByGroupId = (groupId:number,userId:number)=>{
  return axios
    .get<RecentActivity[]>(`${API_BASE_URL}/recentActivity/${userId}/${groupId}`)
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response?.data?.message || "Fetching net amounts with counterparties failed");
    });
}




