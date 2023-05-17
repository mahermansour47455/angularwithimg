import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../model/User.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
 /* users: User[] = [{"username":"admin","password":"123","roles":['ADMIN']},
{"username":"nadhem","password":"123","roles":['USER']} ];*/
public loggedUser?:string;
public isloggedIn: Boolean = false;
public roles?:string[];
private helper = new JwtHelperService();

  

  apiURL: string = 'http://localhost:8081/users';
  token!:string;
  constructor(private router: Router, private http : HttpClient) { }
login(user : User)
{
  return this.http.post<User>(this.apiURL+'/login', user , {observe:'response'});
}
isLoggedInn():Boolean{
  return localStorage.getItem('jwt') != null;
  }

saveToken(jwt:string){
  localStorage.setItem('jwt',jwt);
  this.token = jwt;
  this.isloggedIn = true;
  this.decodeJWT();
  }
  decodeJWT()
  { if (this.token == undefined)
   return;
  const decodedToken = this.helper.decodeToken(this.token);
  this.roles = decodedToken.roles;
  this.loggedUser = decodedToken.sub;
  }
  loadToken() {
  this.token = localStorage.getItem('jwt')!;
  this.decodeJWT();
  }
  getToken():string {
    return this.token;
    }
  logout() {
    this.loggedUser = undefined!;
    this.roles = undefined!;
    this.token= undefined!;
    this.isloggedIn = false;
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
    }
 
    isAdmin():Boolean{
      if (!this.roles)
      return false;
     return this.roles.indexOf('ADMIN') >=0;
     }
     isTokenExpired(): Boolean
{
return this.helper.isTokenExpired(this.token); }
     
}
