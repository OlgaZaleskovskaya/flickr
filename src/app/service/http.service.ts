import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class HttpService {

    constructor(private http: HttpClient) {
    }

    requestToken(url: string): Observable<string> {
       return this.http.get(url, {responseType: 'text'});
    }

    accessToken(url: string): Observable<string> {
        return this.http.get(url, {responseType: 'text'});
     }
   
getAlbums(url: string): Observable<string> {
    return this.http.get(url, {responseType: 'text'});
 }
};