import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { IUser, CognitoService } from "src/app/cognito.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  loading: boolean;
  user: IUser;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  public signIn(): void {
    this.loading = true;
    this.cognitoService
      .signIn(this.user)
      .then(() => {
        this.router.navigate(["/dashboard"]);
      })
      .catch(() => {
        this.loading = false;
      });
  }

  ngOnInit() {}
  ngOnDestroy() {}
}
