import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, filter, map, take } from 'rxjs';
import { UserDetails } from '../models/auth-models';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  currentUser$: Observable<UserDetails | undefined> =
    this.authService.getCurrentUser();

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.currentUser$.pipe(
      filter((user) => user !== undefined),
      take(1),
      map((user) => {
        if (!user) {
          this.router.navigate(['']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
