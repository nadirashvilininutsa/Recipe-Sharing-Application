import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, map, of, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {
  RegisterUser,
  User,
  UserEmail,
  UserFullInto,
} from '../models/auth-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // registerUser(user: RegisterUser) {
  //   // const id = user.details.id! + 1;
  //   // const newId = { id: id };
  //   this.auth
  //     .createUserWithEmailAndPassword(user.email, user.password)
  //       if (userCredential.user) {
  //         return from(
  //           userCredential.user.updateProfile({
  //             displayName: JSON.stringify(user.details),
  //           })
  //         );
  //       }
  //       return of();
  //     })
  //     .then(() =>
  //       (this.currentUserInfo$ = this.getCurrentUser())
  //         .pipe(
  //           take(1),
  //           switchMap(() => {
  //             const newUser: User = {
  //               email: user.email,
  //               recipeIds: [],
  //               details: {
  //                 firstName: user.details.firstName,
  //                 lastName: user.details.lastName,
  //                 id: user.details.id,
  //               },
  //             };
  //             return this.postNewUser(newUser);
  //           }),
  //           switchMap(() => this.updateUserId(newId)),
  //           tap(() => {
  //             alert('You have successfully registered');
  //             this.router.navigate(['']);
  //           })
  //         )
  //         .subscribe()
  //     )
  //     .catch((error) => {
  //       if (error.code === 'auth/invalid-email') {
  //         alert('Please enter valid email');
  //       } else if (error.code === 'auth/email-already-in-use') {
  //         alert('Email is already in use');
  //       } else {
  //         alert('New user could not be registered. Please try again later');
  //       }
  //     });
  // }

  constructor(
    private http: HttpClient,
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  currentUserInfo$: Observable<UserFullInto | undefined> = of(undefined);
  currentUserId: number | undefined;

  registerUser(user: RegisterUser) {
    this.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        if (!userCredential.user) return;

        const newUser: User = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          recipeIds: [],
        };

        return this.postNewUser(newUser)
          .pipe(
            take(1),
            tap((user) => {
              const userFullInfo: UserFullInto = {
                ...newUser,
                id: user.id,
              };
              this.currentUserInfo$ = of(userFullInfo);
              this.currentUserId = user.id;
              alert('You have successfully registered');
              this.router.navigate(['']);
            })
          )
          .subscribe();
      })
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
      .then(() => {
        return this.getCurrentUser();
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
      .then(() => {
        this.currentUserInfo$ = of();
        this.currentUserId = undefined;
        this.router.navigate(['']);
        alert('You have successfully logged out');
      })
      .catch(() => {
        alert('Log out unsuccessful');
      });
  }

  getCurrentUser() {
    this.auth.authState
      .pipe(
        take(1),
        switchMap((currentUser) => {
          if (!currentUser?.email) return of(undefined);
          return this.getCurrentUserDetails(currentUser.email).pipe(
            tap((user) => {
              if (user) {
                this.currentUserInfo$ = of(user);
                this.currentUserId = user.id;
                this.router.navigate(['']);
              }
            })
          );
        })
      )
      .subscribe();
  }

  getCurrentUserDetails(email: string): Observable<UserFullInto> {
    return this.http
      .get<UserFullInto[]>(`${environment.jsonServerBase}/users`)
      .pipe(switchMap((users) => users.filter((user) => user.email === email)));
  }

  postNewUser(user: User): Observable<UserFullInto> {
    return this.http.post<UserFullInto>(
      `${environment.jsonServerBase}/users`,
      user
    );
  }
}
