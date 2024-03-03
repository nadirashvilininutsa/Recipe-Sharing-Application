import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, map, of, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { NewId, RegisterUser, UserDetails } from '../models/auth-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  currentUserDetails$: Observable<UserDetails | undefined> =
    this.getCurrentUser();
  currentUserId: number | undefined;

  registerUser(user: RegisterUser) {
    const id = user.details.id + 1;
    const newId = { id: id };
    console.log(id);
    this.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        if (userCredential.user) {
          return from(
            userCredential.user.updateProfile({
              displayName: JSON.stringify(user.details),
            })
          );
        }
        return of();
      })
      .then(() =>
        (this.currentUserDetails$ = this.getCurrentUser())
          .pipe(
            take(1),
            switchMap(() => this.updateUserId(newId)),
            tap(() => {
              alert('You have successfully registered');
              this.router.navigate(['']);
            })
          )
          .subscribe()
      )
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          alert('Please enter valid email');
        } else if (error.code === 'auth/email-already-in-use') {
          alert('Email is already in use');
        } else {
          alert('New user could not be registered. Please try again later');
        }
      });
  }

  logInUser(email: string, password: string) {
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => (this.currentUserDetails$ = this.getCurrentUser()))
      .then(() => {
        this.router.navigate(['']);
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          alert('Please enter valid email.');
        } else if (error.code === 'auth/invalid-login-credentials') {
          alert('User or password is not correct.');
        } else {
          alert('You cannot be logged in. Try again later.');
        }
      });
  }

  logOutUser() {
    this.auth
      .signOut()
      .then(() => (this.currentUserDetails$ = this.getCurrentUser()))
      .then(() => {
        this.router.navigate(['']);
        alert('You have successfully logged out');
      })
      .catch(() => {
        alert('Log out unsuccessful');
      });
  }

  getCurrentUser(): Observable<UserDetails | undefined> {
    return this.auth.authState.pipe(
      switchMap((currentUser) => {
        let userDetails: UserDetails | undefined;
        if (currentUser?.displayName) {
          userDetails = JSON.parse(currentUser.displayName) as UserDetails;
          this.currentUserId = userDetails.id;
        }
        this.router.navigate(['']);
        return of(userDetails);
      })
    );
  }

  getUserId(): Observable<NewId> {
    return this.http.get<NewId>(`${environment.jsonServerBase}/newUserId`);
  }

  updateUserId(id: NewId): Observable<NewId> {
    return this.http.put<NewId>(`${environment.jsonServerBase}/newUserId`, id);
  }
}
