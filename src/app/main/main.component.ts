import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
oauthVerifier: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
   this.oauthVerifier = this.route.snapshot.queryParams['oauth_verifier'];
   localStorage.setItem('virifier',this.oauthVerifier );

  }

private getAccessTopic(){

  
}
}
