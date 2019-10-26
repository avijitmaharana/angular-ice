import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface ResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tknExpireTimer: any;
  user = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient, private router: Router) { }

  checkEmail(email: string, url: string) {
    return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=AIzaSyBzuAkTOIB2GCamjQoZsI8QhFqpmc0neWw',
      {
        identifier: email,
        continueUri: 'http://localhost:4200' + url
      }
    );
  }
  signUP(email: string, password: string) {
    return this.http.post<ResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBzuAkTOIB2GCamjQoZsI8QhFqpmc0neWw',
      {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(catchError(this.errorHandler),
        tap(resData => {
          this.userHandler(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
  }
  logIn(email: string, password: string) {
    return this.http.post<ResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBzuAkTOIB2GCamjQoZsI8QhFqpmc0neWw',
      {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(catchError(this.errorHandler),
        tap(resData => {
          this.userHandler(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
  }
  private userHandler(email: string, id: string, token: string, expiresTime: number) {
    const exTime = new Date(new Date().getTime() + expiresTime * 1000)
    const user = new User(email, id, token, exTime);
    this.user.next(user);
    this.autoLogout(expiresTime * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
  private errorHandler(errorRes: HttpErrorResponse) {
    let errMsg = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errMsg);
    }
    return throwError(errorRes.error.error.message);
  }
  autoLogin() {
    const userData: {
      email: string, id: string, _token: string, _tokenExpirationTime: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) { return; }
    const loadUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationTime));
    if (loadUser.token) {
      this.user.next(loadUser);
      const expDuration = new Date(userData._tokenExpirationTime).getTime() - new Date().getTime()
      this.autoLogout(expDuration);
    }
  }
  autoLogout(tokenExpTime) {
    console.log(tokenExpTime)
    this.tknExpireTimer = setTimeout(() => this.logout(), tokenExpTime);
  }
  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if (this.tknExpireTimer) {
      clearTimeout(this.tknExpireTimer);
    }
    this.tknExpireTimer = null;
  }
}
