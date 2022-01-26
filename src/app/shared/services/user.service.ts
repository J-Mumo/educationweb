import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AUTH_TOKEN_NAME } from 'app/core/auth/auth.constant';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authorities: string[];
  loggedInEmail: string;
  constructor( private jwtHelperService: JwtHelperService) { }
  login(accessToken:string){
    const decodedToken=this.jwtHelperService.decodeToken(accessToken);
    this.authorities=decodedToken.authorities;
    this.loggedInEmail=decodedToken.username;
    localStorage.setItem(AUTH_TOKEN_NAME,accessToken);
  }
  isLoggedIn():boolean{
    if(this.loggedInEmail){
      return true;
    }
    return false;
  }
  getAuthorities():string []{
    return this.authorities;
  }
 getAccessToken(): string {
    return 'Bearer ' + localStorage.getItem('access_token');
  }
}
