import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from 'querystring';
import { AlbumService } from '../service/album.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})


export class AuthComponent implements OnInit {
  oauthToken: string;
  oauthSecret: string;
  oauthVerifier: string;
  tempo: string;
  user: User;
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router,private albumService: AlbumService) { }

  ngOnInit() {

    if (this.route.snapshot.queryParams['oauth_verifier']) {
      this.oauthVerifier = this.route.snapshot.queryParams['oauth_verifier'];
      localStorage.setItem(this.authService.key3, this.oauthVerifier);
      this.accessToken();
    } else {
      this.requestToken();
    }
  }

  requestToken() {
    this.authService.requestToken()
      .subscribe(res => {
        this.getAuthToken(res);
        window.location.href = 'https://www.flickr.com/services/oauth/authorize?oauth_token=' + this.oauthToken;
      }
      );
  }

  accessToken() {
    this.authService.accessToken()
      .subscribe(res => {
        this.getUser(res);

      }
      );
  }

  private getAuthToken(str: string) {
    let [empty, token, secret] = str.split(/&[^&]*=/);
    this.oauthToken = token;
    this.oauthSecret = secret;
    localStorage.setItem(this.authService.key1, this.oauthToken);
    localStorage.setItem(this.authService.key2, this.oauthSecret);
  }

  private getUser(str: string) {
    const newStr = "&" + str;
    let [empty, fName, token, secret, id, name] = newStr.split(/&[^&]*=/);
    this.user = {
      fullName: fName,
      oauthToken: token,
      oauthSecret: secret,
      userId: id,
      userName: name
    }
    this.authService.currentUser = this.user as User;
    this.albumService.getAlbums();
    this.router.navigate(['/main'])
  }

}
