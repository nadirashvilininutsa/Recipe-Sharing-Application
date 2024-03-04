// export interface UserEmail {
//   firstName: string;
//   lastName: string;
//   // id?: number;
// }

// export interface RegisterUser {
//   password: string;
//   details: UserEmail;
// }

// // export interface NewId {
// //   id: number;
// // }

// export interface User {
//   email: string;
//   recipeIds: number[];
//   details: UserEmail;
// }

export interface UserEmail {
  email: string;
}

export interface RegisterUser extends User {
  password: string;
}

export interface User extends UserEmail {
  firstName: string;
  lastName: string;
  recipeIds: number[];
}

export interface UserFullInto extends User {
  id: number;
}
