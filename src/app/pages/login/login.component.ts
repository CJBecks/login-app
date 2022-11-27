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
  signingIn : boolean;
  registerForm: FormGroup;
  submitted = false;
  failed = false;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private formBuilder: FormBuilder
  ) {
    this.signingIn  = false;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      // name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      // acceptTerms: [false, Validators.requiredTrue],
    });
  }
  ngOnDestroy() {}

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.signIn(this.registerForm.value);
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
