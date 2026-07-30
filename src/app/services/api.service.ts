import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/envirenment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl =environment.apiUrl ;

  constructor(private http: HttpClient) { }

  connectAdmin(email: string, mdp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/connect`, { email, mdp });
  }

  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' });
  }

  cancelJob(emailClient: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/cancel/${emailClient}`, {}, { responseType: 'text' });
}

cancelPost(postId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/cancel-post/${postId}`, {}, { responseType: 'text' });
}

  getCampaigns(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/campaigns`);
  }

  getClientsCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clients/count`);
  }
}
