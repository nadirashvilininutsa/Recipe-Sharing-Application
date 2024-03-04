import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserEmail, UserFullInto } from 'src/app/models/auth-models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}
  currentUser$: BehaviorSubject<UserFullInto | undefined> =
    this.authService.currentUserInfo$;
  userId: number | undefined = this.authService.currentUserId;

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

  ngOnInit() {
    this.currentUser$.subscribe();
  }
}
