import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/services/http.service';
import { environment } from '../../../../environments/environment';
import { Router} from '@angular/router';

@Component({
  selector: 'em-home',
  templateUrl: '../pages/home.view.html',
  styleUrls: ['../home.component.css']
})
export class HomeComponent implements OnInit {

  contactForm: FormGroup;
  response: any;
  message:any;
  constructor(private router: Router, private formbuilder: FormBuilder,private httpService: HttpService) {

  }

  ngOnInit(): void {
    this.contactForm = this.formbuilder.group({
      name: ['', Validators.required],
      emailId: ['', Validators.required],
      selected: [''],
      message: ['', Validators.required]
    });

    this.contactForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.contactForm);
         });

  }

  contactFormErrors = {
    'name': '',
    'emailId': '',
    'password': '',
    'message': ''

  };
  contactErrorMessages = {
    'name': {
      'required': 'Please enter your name'
    },
    'emailId': {
      'required': 'Please enter a valid email address',

    },
    'password':
    {
      'required': 'Please enter your password',

    },
    'message':
    {
      'required': 'Please enter your message',

    }

  };

  logValidationErrors(group: FormGroup): void {
    
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.contactFormErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.contactErrorMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.contactFormErrors[key] += messages[errorKey] + ' ';
          }

        }
        if (abstractControl instanceof FormGroup) {
          this.logValidationErrors(abstractControl);
        }
      }
    });

  }


  submitContactForm() :void {
    let url=`${environment.Url}/submitContactQuery`;
    this.httpService.post(url,this.contactForm.value).subscribe(
      res =>  {
        this.response = JSON.parse(JSON.stringify(res));
        if(this.response.error==null || this.response.error==""){
          this.router.navigateByUrl('/reset');
       }
      else
        this.message=this.response.error;
      },
      err=>{ alert("Sorry an error occured");
    });
    


  }




}
