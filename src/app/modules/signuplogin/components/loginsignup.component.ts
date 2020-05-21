import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../shared/services/data-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordDialog } from './forgotpassword.component';
import { HttpService } from '../../../shared/services/http.service';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility-service';

@Component({

  templateUrl: '../pages/loginsignup.component.html',
  styleUrls: ['../loginsignup.component.css']
})
export class LoginsignupComponent implements OnInit {
  response: any;
  loginError: any;
  authenticated: boolean;
  signUpForm: FormGroup;
  toggle1: boolean = false;
  toggle2: boolean = false;
 

  constructor(private router: Router, private _route: ActivatedRoute, private transferService: DataService,
    private dialog: MatDialog, private httpService: HttpService, private formBuilder: FormBuilder,
    public  utility_Service: UtilityService ) {

    
  }

  signupCustomer(): void {
    
    let url = `${environment.Url}/api/signup`;
    console.log(this.signUpForm.value);
    this.httpService.post(url, this.signUpForm.value).subscribe(
      res => {
        this.transferService.setData(this.signUpForm.value.emailId);
        this.response = JSON.parse(JSON.stringify(res));
        if (this.response.error == null || this.response.error == "")
          this.router.navigateByUrl('/editProfile');
      },
      err => {
        alert("Sorry an error occured");
      });
  }

  //Reactive form Changes

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      emailId: ['', Validators.required],
      passwordGroup :this.formBuilder.group({
      password: ['',[Validators.required,this.utility_Service.passwordStrength]],
      confirm_password: ['',Validators.required ]
      },{ validator:this.utility_Service.matchPassword}),
    });


    this.transferService.setData(this.signUpForm.value.emailId);

    this.signUpForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.signUpForm);
    });



  }
  signUpErrorMessages = {

    'username': {
      'required': 'Username is required',

    },

    'passwordGroup': {

      'passwordMismatch': 'Password and Confirm Password do not match',
           },

    'emailId': {
      
      'required': 'Email-Id is required',

    },
    'password':
    {

      'required': 'Password is required',
      'invalidPassword': 'Invalid Password.Please check the info'

    },
    'confirm_password':
    {
      'required': 'Confirm your password',

    },


  };
  signUpFormErrors = {
    'username': '',
    'emailId': '',
    'password': '',
    'confirm_password': '',
    'passwordGroup': '',
  };

  logValidationErrors(group: FormGroup): void {
    
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.signUpFormErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.signUpErrorMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.signUpFormErrors[key] += messages[errorKey] + ' ';
          }

        }
        if (abstractControl instanceof FormGroup) {
          this.logValidationErrors(abstractControl);
        }
      }
    });

  }

}
