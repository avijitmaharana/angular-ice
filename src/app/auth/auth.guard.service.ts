import { CanActivate, UrlTree, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { take, map, tap } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
    constructor(private authServ: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Promise<boolean | UrlTree> | Observable<boolean | UrlTree> | boolean | UrlTree {
        return this.authServ.user.pipe(take(1), map(authUser => {
            const isAuth = !!authUser;
            if (isAuth) {
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        }));
    }
}