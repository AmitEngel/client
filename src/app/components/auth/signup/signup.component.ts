import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { passwordMatch } from '../customValidator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  user!: UserModel;
  isMatch = false;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  isLinear = false;
  cities = [
    'Jerusalem', 'Tel Aviv', 'Rishon LeZion', 'Beer Sheva', 'Haifa', 'Eilat', 'Beit Shemesh', 'Ashdod'
  ]

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group(
      {
        tz: [
          '',
          { validators: [Validators.required, Validators.minLength(9)] },
        ],
        email: ['', { validators: [Validators.required, Validators.email] }],
        password: [
          '',
          { validators: [Validators.required, Validators.minLength(5)] },
        ],
        confirmPassword: ['', { validators: [Validators.required] }],
      },
      {validator:[passwordMatch('password', 'confirmPassword')]}
    );

    this.secondFormGroup = this.formBuilder.group({
      city : ['', Validators.required],
      street : ['', Validators.required],
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
    });
  }

  get passwordMatchError() {
    return this.firstFormGroup.errors;
  }

  onSubmitClick() {
    console.log({ ...this.firstFormGroup.value, ...this.secondFormGroup.value });
    this.authService.createUser({ ...this.firstFormGroup.value, ...this.secondFormGroup.value })
  }
}
