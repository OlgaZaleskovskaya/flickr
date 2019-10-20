import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { HttpService } from '../service/http.service';



@NgModule({
  providers: [AuthService, HttpService],
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
 

 }
