import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CreateUserRequest {
  userid: string;
}

export interface AddChantRequest {
  userid: string;
  date: string;
  count: number;
}

export interface UserTotalResponse {
  userId: string;
  totalCount: number;
}

export interface TotalChantsResponse {
  totalChants: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  createUser(request: CreateUserRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/users/create`, request);
  }

  addChant(request: AddChantRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/chants/add`, request);
  }

  getUserTotal(userId: string): Observable<UserTotalResponse> {
    return this.http.get<UserTotalResponse>(`${this.baseUrl}/chants/user/${userId}/total`);
  }

  getTotalChants(): Observable<TotalChantsResponse> {
    return this.http.get<TotalChantsResponse>(`${this.baseUrl}/chants/total`);
  }
}
