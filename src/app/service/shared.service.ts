import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class SharedService {

     getURL(address: string, method: string, parameters: Object, secret: string): string {
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

    getCallBack(str: string): string {
        let res = str.replace(/:/g, '%3A');
        res = res.replace(/\//g, '%2F');
        return res;
    }
}