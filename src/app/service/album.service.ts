import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { SharedService } from './shared.service';

export interface Album {
    id: string;
    primaryId: string;
    title: string;
    description: string;
    dateCreate: number;
    photos: number


}

@Injectable()
export class AlbumService {
    albumList: Album[];
    constructor(private authService: AuthService, private http: HttpService, private sharedService: SharedService) { }

    public getAlbums() {
        const address = 'https://www.flickr.com/services/rest';
        const method = 'GET';
        const parameters = {
            oauth_consumer_key: this.authService.consumerKey,
            oauth_signature_method: this.authService.signatureMethod,
            method: "flickr.photosets.getList",
            format: 'json',
            oauth_token: localStorage.getItem(this.authService.key1)
        };
        return this.http.getAlbums(this.sharedService.getURL(address, method, parameters, this.authService.consumerSecret + '&' + localStorage.getItem(this.authService.key2)))
            .subscribe(res => {
                this.createAlbumList(res)
            }),
            error => console.log(error);

    }

    private createAlbumList(str: string) {
        const obj = JSON.parse(str.slice(str.indexOf('{'), str.length - 1));
        const arr = obj.photosets.photoset;
        arr.forEach(element => {
            let album = {} as Album;
            let { date_create: dateCreate,
                description: { _content: description },
                title: { _content: title },
                id,
                photos,
                primary
            } = element;
            album.dateCreate = Number.parseInt(dateCreate);
            album.description = description;
            album.title = title;
            album.id = id;
            album.photos = Number.parseInt(photos);
            album.primaryId = primary;
            this.albumList.push(album);
        });
    }
}