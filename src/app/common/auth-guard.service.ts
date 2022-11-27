import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { CognitoService } from './cognito.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: CognitoService, public router: Router) {}
  canActivate() {
    return new Promise<boolean>((resolve, reject) => {
        debugger;
        console.log('here');
        this.auth.isAuthenticated()
            .then((data) => {
                if (data) {
                    resolve(true);
                } else {
                    this.router.navigate(['/signIn']);
                    resolve(false);
                }
            })
            .catch(() => this.router.navigate(['/signIn']));
     });
  }
}