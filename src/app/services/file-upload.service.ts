import { HttpClient, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      responseType: 'json',
    });

    return this.http.request(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "Undefined Error!";

        if (error.status === 413 || error.status === 417) {
          errorMessage = "File too long. Maximum size: 2MB";
        } else if (error.status === 400) {
          errorMessage = "Check the fields";
        } else if (error.status === 500) {
          errorMessage = "Internal Server Error";
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}