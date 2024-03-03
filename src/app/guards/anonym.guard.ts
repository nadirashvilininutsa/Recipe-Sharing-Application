import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, filter, first, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserDetails } from '../models/auth-models';

@Injectable({
  providedIn: 'root',
})
export class AnonymGuard implements CanActivate {
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
      take(1),
      first(),
      map((user) => {
        if (user) {
          this.router.navigate(['']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
