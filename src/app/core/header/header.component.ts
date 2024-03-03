import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserDetails } from 'src/app/models/auth-models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}
  currentUser$: Observable<UserDetails | undefined> =
    this.authService.currentUserDetails$;

  user: boolean = true;
  menuOpen: boolean = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logOut() {
    this.authService.logOutUser();
    this.toggleMenu();
    this.router.navigate(['']);
  }
}
