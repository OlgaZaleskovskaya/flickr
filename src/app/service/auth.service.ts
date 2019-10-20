import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpService } from './http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { SharedService } from './shared.service';

export interface User {
    fullName: string,
    oauthToken: string,
    oauthSecret: string,
    userId: string,
    userName: string

}

@Injectable()
export class AuthService {
    consumerKey = '9545a55aea99d07e47dda1ad178c324b';
    consumerSecret = 'b4da2fc5c5e2d243';
    signatureMethod = 'HMAC-SHA1';
    oauthVersion = '1.0';
    oauthCallback = 'http://localhost:4200';
    key1 = 'oauthToken';
    key2 = 'oauthSecret';
    key3 = 'verifier';
    currentUser: User;


    constructor(private http: HttpService, private sharedService: SharedService) {
    }


    public requestToken(): Observable<string> {
        const address = 'https://www.flickr.com/services/oauth/request_token';
        const method = 'GET';
        const parameters = {
            oauth_nonce: Math.random() * 1000,
            oauth_timestamp: Date.now(),
            oauth_consumer_key: this.consumerKey,
            oauth_signature_method: this.signatureMethod,
            oauth_version: this.oauthVersion,
            oauth_callback: this.sharedService.getCallBack(this.oauthCallback + "/auth"),
        };
        return this.http.requestToken(this.sharedService.getURL(address, method, parameters, this.consumerSecret + '&'))
            .pipe(
                catchError(this.handleError)
            );
    }

    public accessToken(): Observable<string> {
        const address = 'https://www.flickr.com/services/oauth/access_token';
        const method = 'GET';
        const parameters = {
            oauth_nonce: Math.random() * 1000,
            oauth_timestamp: Date.now(),
            oauth_consumer_key: this.consumerKey,
            oauth_signature_method: this.signatureMethod,
            oauth_version: this.oauthVersion,
            oauth_callback: this.sharedService.getCallBack(this.oauthCallback),
            oauth_verifier: localStorage.getItem(this.key3),
            oauth_token: localStorage.getItem(this.key1)
        };
        return this.http.accessToken(this.sharedService.getURL(address, method, parameters, this.consumerSecret + '&' + localStorage.getItem(this.key2)))
            .pipe(
                catchError(this.handleError)
            );
    }

   

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError(
            'Something bad happened; please try again later.');
    };
}




