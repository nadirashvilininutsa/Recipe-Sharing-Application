export interface UserDetails {
  firstName: string;
  lastName: string;
  id: number;
}

export interface RegisterUser {
  email: string;
  password: string;
  details: UserDetails;
}

export interface NewId {
  id: number;
}
