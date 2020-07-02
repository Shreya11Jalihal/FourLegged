import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../shared/services/data-service.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../../../shared/services/http.service';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  toggle3: boolean = false;

  constructor(private router: Router, private _route: ActivatedRoute, private transferService: DataService,
    private dialog: MatDialog, private httpService: HttpService, private formBuilder: FormBuilder,
    public  utility_Service: UtilityService ) {

      
  }

  signupCustomer(): void {
    
    let url = `${environment.Url}/api/signup`;
    this.signUpModel.username=this.signUpForm.value.username;
    this.signUpModel.emailid=this.signUpForm.value.emailId;
    this.signUpModel.password=this.signUpForm.get('passwordGroup').value.password;
    console.log(this.signUpModel);
    this.httpService.post(url, this.signUpModel).subscribe(
      res => {
       //console.log(this.signUpForm.value.emailId);
         this.transferService.setData(this.signUpForm.value.emailId);
         this.response = JSON.parse(JSON.stringify(res));
        if (this.response.error == null || this.response.error == "")
          this.router.navigateByUrl('/editProfile');
      },
      err => {
        alert("err");
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

  signUpModel :SignUpModel=
  {
    username:'',
    password: '',
    emailid:''
  }

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


  public showPassword(input_password, num) {
    if (input_password.type == 'password') {
      input_password.type = 'text';
    } else {
      input_password.type = 'password';
    }
    if (num == 1) {
      this.toggle1 = !this.toggle1;
    } else if (num == 2) {
      this.toggle2 = !this.toggle2;
    } else {
      this.toggle3 = !this.toggle3;
    }

  }

}

export interface SignUpModel{
   username: String,
   password: String,
   emailid : String,
}