import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Amplify, Auth} from "aws-amplify";

import { environment } from "../../environments/environment";
import { UserService } from "./user.service";

export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
  id: string;
}

@Injectable({
  providedIn: "root",
})
export class CognitoService {
  public authenticationSubject: BehaviorSubject<any>;

  constructor(public userService: UserService) {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
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
      this.authenticationSubject.next(true);
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut().then((data) => {
      this.authenticationSubject.next(false);
    });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
      .then((user: any) => {
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
}
