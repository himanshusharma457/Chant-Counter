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
  // For Development:
  private baseUrl = 'http://localhost:8080/api';

  // For Testing/Production:
  // private baseUrl = 'https://chant-counter.onrender.com/api';

  constructor(private http: HttpClient) { }

  private normalizeUserId(userId: string): string {
    // Check if it's a phone number (10 digits)
    if (/^\d{10}$/.test(userId)) {
      return userId; // Keep phone numbers as-is
    }
    // For usernames, convert to uppercase to match backend normalization
    return userId.toUpperCase();
  }

  createUser(request: CreateUserRequest): Observable<ApiResponse> {
    const normalizedRequest = {
      ...request,
      userid: this.normalizeUserId(request.userid)
    };
    return this.http.post<ApiResponse>(`${this.baseUrl}/users/create`, normalizedRequest);
  }

  addChant(request: AddChantRequest): Observable<ApiResponse> {
    const normalizedRequest = {
      ...request,
      userid: this.normalizeUserId(request.userid)
    };
    return this.http.post<ApiResponse>(`${this.baseUrl}/chants/add`, normalizedRequest);
  }

  getUserTotal(userId: string): Observable<UserTotalResponse> {
    const normalizedUserId = this.normalizeUserId(userId);
    return this.http.get<UserTotalResponse>(`${this.baseUrl}/chants/user/${normalizedUserId}/total`);
  }

  getTotalChants(): Observable<TotalChantsResponse> {
    return this.http.get<TotalChantsResponse>(`${this.baseUrl}/chants/total`);
  }

  isUserExists(userId: string): Observable<boolean> {
    const normalizedUserId = this.normalizeUserId(userId);
    return this.http.get<boolean>(`${this.baseUrl}/users/exists/${normalizedUserId}`);
  }
}
