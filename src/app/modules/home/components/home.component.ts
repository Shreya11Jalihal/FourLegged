import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/services/http.service';
import { environment } from '../../../../environments/environment';
import { Router} from '@angular/router';
import { getLocaleFirstDayOfWeek } from '@angular/common';

@Component({
  selector: 'em-home',
  templateUrl: '../pages/home.view.html',
  styleUrls: ['../home.component.css']
})
export class HomeComponent implements OnInit {

  contactForm: FormGroup;
  success:true;
  response: any;
  message:any;
  error: any = [];
  constructor(private router: Router, private formbuilder: FormBuilder,private httpService: HttpService) {

  }

  ngOnInit(): void {
    this.contactForm = this.formbuilder.group({
      name: ['', Validators.required],
      emailId: ['', Validators.required],
      selected: [''],
      newsletter:[''],
      message: ['', Validators.required]
    });

    this.contactForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.contactForm);
         });

  }

  contactFormErrors = {
    'name': '',
    'emailId': '',
    'message': ''

  };
  contactErrorMessages = {
    'name': {
      'required': 'Please enter your name'
    },
    'emailId': {
      'required': 'Please enter a valid email address',

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
    let url=`${environment.Url}/api/submitQuery`;
    console.log(this.contactForm.value);
    let headers = new Headers();
    this.httpService.post(url,this.contactForm.value).subscribe(
      res =>  {
        this.response = JSON.parse(JSON.stringify(res));
        if(this.response.error==null || this.response.error==""){
         this.message="Your query was sent successfully";
         this.success=true;
       }
      else
        this.message=this.response.error;
      },
      err=>{ 
        this.error=err;
        alert(this.error);
    });
    


  }




}
