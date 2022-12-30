import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { CognitoService } from './cognito.service';
import { UserService } from './user.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: CognitoService, public userService: UserService, public router: Router) {}
  canActivate() {
    return new Promise<boolean>((resolve, reject) => {
        this.auth.isAuthenticated()
            .then((data) => {
                if (data) { 
                    // Set the UserService Data
                    this.auth.currentAuthenticatedUser().then((authUser) => {
                        this.userService.activeUser = {
                            id: authUser.attributes.sub,
                            email: authUser.attributes.email,
                            name: authUser.attributes.name,
                            jwt: authUser.signInUserSession.idToken.jwtToken,
                        }
                        resolve(true);
                    });
                } else {
                    this.router.navigate(['/signIn']);
                    resolve(false);
                }
            })
            .catch(() => this.router.navigate(['/signIn']));
     });
  }
}