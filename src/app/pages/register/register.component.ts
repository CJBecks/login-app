import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IUser, CognitoService } from "src/app/common/cognito.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  isConfirm: boolean;
  registerForm: FormGroup;
  codeForm: FormGroup;
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
    this.registerForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      // acceptTerms: [false, Validators.requiredTrue],
    });

    this.codeForm = this.formBuilder.group({
      code: ["", Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  get c() {
    return this.codeForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.registerForm.value);

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.signUp(this.registerForm.value);
  }

  onCodeSubmit() {
    this.submitted = true;
    console.log(this.codeForm.value);

    // stop here if form is invalid
    if (this.codeForm.invalid) {
      return;
    }

    this.user.code = this.codeForm.value.code;
    this.confirmSignUp(this.user);
  }

  public signUp(user: IUser): void {
    this.registering = true;
    this.cognitoService
      .signUp(user)
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

  public confirmSignUp(user: IUser): void {
    this.registering = true;
    this.cognitoService
      .confirmSignUp(user)
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
