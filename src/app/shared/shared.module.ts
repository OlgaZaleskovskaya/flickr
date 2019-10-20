import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { HttpService } from '../service/http.service';
import { AlbumService } from '../service/album.service';
import { SharedService } from '../service/shared.service';



@NgModule({
  providers: [AuthService, HttpService,AlbumService, SharedService],
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
 

 }
