import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute ,NavigationEnd } from '@angular/router';
import { DataService } from '../../../shared/services/data-service.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../../../shared/services/http.service';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';


@Component({
  selector: 'em-login',
  templateUrl: '../pages/login.component.html',
  styleUrls: ['../loginsignup.component.css']
})
export class LoginComponent implements OnInit {

  response: any;
  loginError: any;
  submitted=false;
  toggle1: boolean = false;
  toggle2: boolean = false;
  toggle3: boolean = false;
  message:string;

  showLoginForm: boolean = true;
  loginForm: FormGroup;

  constructor(private router: Router, private _route: ActivatedRoute, private transferService: DataService,
    private dialog: MatDialog, private httpService: HttpService, private formBuilder: FormBuilder,
    private renderer:Renderer2) {

      this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          this.renderer.setStyle(document.body, 'background-image', ' url("../../../assets/signup.jpg")');
        }
      });

      
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      emailId: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.loginForm);
    });
    
  }


  loginFormErrors = {
    'emailId': '',
    'password': '',

  };



  loginErrorMessages = {
    'emailId': {
      'required': 'Please enter a valid email address',

    },
    'password':
    {
      'required': 'Please enter your password',

    }

  };

  openDialog() {
   this.showLoginForm = false;
  }

  cancelForgotPassword(){
    this.showLoginForm = true;
  }

  sendMail(){
    
    let url=`${environment.Url}/forgotPassword`;
    this.httpService.post(url,this.loginForm.value.emailId).subscribe(
      res =>  {
        this.response = JSON.parse(JSON.stringify(res));
        this.transferService.setData(this.loginForm.value.emailId);
        if(this.response.error==null || this.response.error==""){
          this.router.navigateByUrl('/reset');
       }
      else
        this.message=this.response.error;
      },
      err=>{ alert("Sorry an error occured");
    });

  }
  
  login(): void {
    this.submitted = true;
    let url = `${environment.Url}/api/login`;
    let params = new HttpParams();
    params = params.append('emailId', this.loginForm.value.emailId);
    const headers = new HttpHeaders(this.loginForm.value ? {
      authorization: 'Basic ' + btoa(this.loginForm.value.emailId + ':' + this.loginForm.value.password)
    } : {});

    this.httpService.getWithHeaders(url, headers,params).subscribe(response => {
      if (response != null && response.status == 200){
        let tokenStr = 'Bearer '+response.body.jwt;
        sessionStorage.setItem('token', tokenStr);
        this.router.navigateByUrl('/activities');
      }
    }, error => {
      this.loginError = "Invalid Credentials.Please try again."
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

  logValidationErrors(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
      else {

        this.loginFormErrors[key] = '';
        
        if (abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.loginErrorMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.loginFormErrors[key] += messages[errorKey] + ' ';
            }
            
          }
          console.log(this.loginFormErrors);
        }
      }
    });

      
  }
}

