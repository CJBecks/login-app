import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IUser, CognitoService } from "src/app/common/cognito.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  isConfirm: boolean;
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;
  user: IUser;

  submitted = false;
  failed = false;
  registering = false;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private formBuilder: FormBuilder
  ) {
    this.isConfirm = false;
    this.user = {} as IUser;
  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.formBuilder.group({
      code: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  get c() {
    return this.resetPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.resetPassword(this.forgotPasswordForm.value);
  }

  onCodeSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.user.code = this.resetPasswordForm.value.code;
    this.user.password = this.resetPasswordForm.value.password;
    this.confirmPasswordReset(this.user);
  }

  public resetPassword(user: IUser): void {
    this.registering = true;
    this.cognitoService
      .forgotPassword(user)
      .then(() => {
        this.registering = false;
        this.isConfirm = true;
        this.submitted = false;
        this.failed = false;
        this.user = user;
      })
      .catch(() => {
        this.registering = false;
        this.failed = true;
      });
  }

  public confirmPasswordReset(user: IUser): void {
    this.registering = true;
    this.cognitoService
      .forgotPasswordSubmit(user)
      .then(() => {
        this.registering = false;
        this.router.navigate(["/signIn"]);
      })
      .catch(() => {
        this.registering = false;
        this.failed = true;
      });
  }
}