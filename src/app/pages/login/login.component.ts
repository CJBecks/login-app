import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IUser, CognitoService } from "src/app/common/cognito.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  signingIn : boolean = false;
  signInForm: FormGroup;
  submitted = false;
  failed = false;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnDestroy() {}

  // convenience getter for easy access to form fields
  get f() {
    return this.signInForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    this.signIn(this.signInForm.value);
  }

  private signIn(user: IUser): void {
    this.signingIn = true;
    this.cognitoService
      .signIn(user)
      .then(() => {
        this.router.navigate(["/dashboard"]);
      })
      .catch(() => {
        this.signingIn = false;
        this.failed = true;
      });
  }
}
