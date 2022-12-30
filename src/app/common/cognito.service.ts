import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Amplify, Auth} from "aws-amplify";

import { environment } from "../../environments/environment";

export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
  id: string;
}

export interface IAuthenticatedUser {
  id: string,
  email: string,
  name: string,
  // TODO: Other User Data.. First Name, Last Name, Address
}

@Injectable({
  providedIn: "root",
})
export class CognitoService {
  private authenticationSubject: BehaviorSubject<any>;

  private _activeUserSessionKey = 'activeUserSessionKey';
  private _activeUser: IAuthenticatedUser = undefined;

  get activeUser(): IAuthenticatedUser {
    // TODO: Check session storage if its not set
    return this._activeUser;
}

  set activeUser(value: IAuthenticatedUser) {
      this._activeUser = value;
  }


  // public get authenticatedUser() : IAuthenticatedUser
  // {
  //   if (!this._activeUser) {
  //     this.getUser().then((data) => {
  //       this._activeUser = {
  //         email: data.attributes.email,
  //         name: data.attributes.name,
  //         id: data.attributes.sub
  //       }
  //     });
  //   }
  //   return this._activeUser;
  // }

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);

    if (this.authenticationSubject.value && !this._activeUser) {
      this.getUser().then((data) => {
        this._activeUser = {
          email: data.attributes.email,
          name: data.attributes.name,
          id: data.attributes.sub,
          // getjwt: () => {
          //   return this.getJwtForActiveUser()
          // }
        }
      });
    }
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
      attributes: { name: user.name },
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public forgotPassword(user: IUser): Promise<any> {
    return Auth.forgotPassword(user.email);
  }

  public forgotPasswordSubmit(user: IUser): Promise<any> {
    return Auth.forgotPasswordSubmit(user.email, user.code, user.password);
  }

  public signIn(user: IUser): Promise<any> {
    return Auth.signIn(user.email, user.password).then((data) => {
      console.log(data);
      console.log(user);

      this.activeUser = {
        email: data.attributes.email,
        name: data.attributes.name,
        id: data.attributes.sub
      }
      this.authenticationSubject.next(true);
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut().then((data) => {
      this._activeUser = undefined;
      this.authenticationSubject.next(false);
    });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
      .then((user: any) => {
        console.log(user);
        if (user && Object.keys(user).length != 0) {
          return true;
        } else {
          return false;
        }
      }).catch(() => {
        return false;
      });
    }
  }
  
  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public currentAuthenticatedUser(): Promise<any> {
    return Auth.currentAuthenticatedUser();
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser().then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }

  public getJwtForActiveUser() {
    return Auth.currentSession().then((cognitoUser: any) => {
      console.log(cognitoUser);
      return cognitoUser.getIdToken().getJwtToken();
    });
  }
}
