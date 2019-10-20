import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpService } from './http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

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


    constructor(private http: HttpService) {
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
            oauth_callback: this.getCallBack(this.oauthCallback + "/auth"),
        };
        return this.http.requestToken(this.getURL(address, method, parameters, this.consumerSecret + '&'))
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
            oauth_callback: this.getCallBack(this.oauthCallback),
            oauth_verifier: localStorage.getItem(this.key3),
            oauth_token: localStorage.getItem(this.key1)
        };
        return this.http.accessToken(this.getURL(address, method, parameters, this.consumerSecret + '&' + localStorage.getItem(this.key2)))
            .pipe(
                catchError(this.handleError)
            );
    }

    public getAlbums() {
        const address = 'https://www.flickr.com/services/rest';
        const method = 'GET';
        const parameters = {
            // oauth_nonce: Math.random() * 1000,
            // oauth_timestamp: Date.now(),
            oauth_consumer_key: this.consumerKey,
            oauth_signature_method: this.signatureMethod,
            method: "flickr.photosets.getList",
            format: 'rest',
            // oauth_version: this.oauthVersion,
            // oauth_callback: this.getCallBack(this.oauthCallback),
            //   oauth_verifier: localStorage.getItem(this.key3),
            oauth_token: localStorage.getItem(this.key1)
        };
        return this.http.getAlbums(this.getURL(address, method, parameters, this.consumerSecret + '&' + localStorage.getItem(this.key2)))
            .subscribe(res => console.log(res)),
            error => console.log(error);

    }

    private getURL(address: string, method: string, parameters: Object, secret: string): string {
        let mp = new Map(Object.entries(parameters));
        let str = address + "?";
        mp.forEach((val, key, map) => {
            str = str + key + "=" + val + '&';
        })
        str = str + 'oauth_signature=' + this.getSignature(this.createBaseString(method, address, mp), secret);
        return str;

    }

    private createBaseString(method: string, address: string, parameters: Map<string, string>): string {
        const keys = Array.from(parameters.keys()).sort();
        let baseString = method + '&' + this.getCallBack(address) + '&';
        keys.forEach(item => {
            if (item != "oauth_callback") {
                baseString = baseString + item + "%3D" + parameters.get(item) + "%26"
            } else {
                baseString = baseString + item + "%3D" + this.getCallBack(parameters.get(item)).replace(/%/g, '%25') + "%26"
            }
        })
        return baseString.slice(0, baseString.length - 3);
    }


    private getSignature(baseString: string, secret: string): string {
        let encrypted = CryptoJS.HmacSHA1(baseString, secret);
        let res = CryptoJS.enc.Base64.stringify(encrypted);
        return encodeURIComponent(res);
    }

    private getCallBack(str: string): string {
        let res = str.replace(/:/g, '%3A');
        res = res.replace(/\//g, '%2F');
        return res;
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




