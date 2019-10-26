import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecipesService } from '../recipes/recipes.service';
import { AuthService, ResponseData } from '../auth/auth.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
declare var $ : any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticate = false;
  userSubs: Subscription;
  constructor(public dialog: MatDialog, private recServ: RecipesService, private authService: AuthService) { }

  ngOnInit() {
    this.userSubs = this.authService.user.subscribe(user => {
      this.isAuthenticate = !!user;
    })
    $(document).ready(function () {
      $('.avi').find("li").on("click", "a", function () {
          $('.navbar-collapse.in').collapse('hide');
      });
  });
  }
  openDialog(): void {
    this.dialog.open(LoginModal, {
      width: '450px'
    });
  }
  onSave() {
    this.recServ.putRec();
  }
  onFetch() {
    this.recServ.fetchRecipe().subscribe();
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.userSubs.unsubscribe();
  }
}


@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModal implements OnInit {
  isLoginMode = true;
  url: string;
  authForm: FormGroup;
  isLoading = false;
  error: string = null;
  constructor(public http: HttpClient, private route: ActivatedRoute, public dialogRef: MatDialogRef<LoginModal>, private authService: AuthService, private router: Router) { }
  
  ngOnInit() {
    this.authForm = new FormGroup({
      'email': new FormControl('', [Validators.email, Validators.required], this.chkEmail.bind(this)),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    this.url = this.router.url;
  }
  chkEmail(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise((resolve, reject) => {
      this.authService.checkEmail(control.value, this.url).subscribe(
        resData => {
          // console.log(resData['registered'])
          if (resData['registered']) {
            if (this.isLoginMode) {
              resolve(null)
            } else {
              resolve({ 'textIsForbidden': true })
            }
          } else {
            if (this.isLoginMode) {
              resolve({ 'emailNotExist': true });
            } else {
              resolve(null);
            }
          }
        },
        error => console.log(error)
      );
    });
    return promise;
  }
  onSwitch() {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.get('email').updateValueAndValidity(this.chkEmail.bind(this));
    this.url = this.router.url;
  }

  emailErrorMessage() {
    return this.authForm.get('email').hasError('required') ? 'You must enter a email' :
      this.authForm.get('email').hasError('textIsForbidden') ? 'Email already exist!' :
        this.authForm.get('email').hasError('emailNotExist') ? 'User not exist!' :
          '';
  }
  passErrorMessage() {
    return this.authForm.get('password').hasError('required') ? 'You must enter a password' :
      this.authForm.get('password').hasError('minlength') ? 'Minimum password length is 6!' :
        '';
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    const email = form.value.email;
    const pass = form.value.password;
    let authObs: Observable<ResponseData>;
    if (this.isLoginMode) {
      authObs = this.authService.logIn(email, pass);
    } else {
      authObs = this.authService.signUP(email, pass);
    }

    authObs.subscribe(
      respData => {
        if (respData) {
          this.isLoading = false;
          // console.log(respData);
          this.dialogRef.close();
          this.router.navigate(['/recipes'], {relativeTo: this.route});
        }
      },
      errorMsg => {
        this.isLoading = false;
        this.error = errorMsg;
        console.log(errorMsg);
      }
    );
  }
}