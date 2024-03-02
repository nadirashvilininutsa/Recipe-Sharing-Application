import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getUserId(): Observable<number> {
    return this.http.get<number>(`${environment.jsonServerBase}/newUserId`);
  }

  updateUserId(id: number) {
    this.http.put<number>(`${environment.jsonServerBase}/newUserId`, id);
  }
}
