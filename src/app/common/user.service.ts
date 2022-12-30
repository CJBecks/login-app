import { Injectable } from "@angular/core";

export interface IAuthenticatedUser {
  id: string,
  email: string,
  name: string,
  jwt: string,
  // TODO: Other User Data.. First Name, Last Name, Address
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private _activeUserSessionKey = 'activeUserSessionKey';
  private _activeUser: IAuthenticatedUser = undefined;

  get activeUser(): IAuthenticatedUser {
    return this._activeUser;
  }

  set activeUser(value: IAuthenticatedUser) {
      this._activeUser = value;
  }

  constructor() {}
}
