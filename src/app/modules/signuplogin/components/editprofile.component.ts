import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../../shared/services/data-service.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-editprofile',
  templateUrl: '../pages/editprofile.component.html',
  styleUrls: ['../css/editprofile.component.css']
})
export class EditprofileComponent implements OnInit {

  email_Id: string;
  response: any;
  arrays: object[];
  dataUrl: any;
  linkedInUrl: any;

  //Tagging code
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  selectedFile: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  technologies: Technology[] = [
    { name: 'Java' },
    { name: 'PHP' },
    { name: 'Spring' },
  ];

  eProfileModel: EditProfileModel = {
    emailid: '',
    technologies: '',
    linkedInUrl: ''
  };

  constructor(private transferService: DataService, private http: HttpClient,
    private router: Router) {
    this.email_Id = transferService.getData();
    
    
  }

  ngOnInit(): void {

  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.dataUrl = event.target.result;
      }
    }
  }


  submit(): void {
    this.eProfileModel.emailid = this.email_Id;
    this.eProfileModel.technologies = JSON.stringify(this.technologies);
    var uploadData = new FormData();

    if (this.selectedFile != null) {
      uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    }
    var value = JSON.stringify(this.eProfileModel);
    uploadData.append('model', value);
    let url = `${environment.Url}/api/updateProfile`;
    this.http.patch(url, uploadData).subscribe(
      res => {
        alert("Profile Updated Successfully");
        this.router.navigateByUrl('/activities');
      },
      err => {
        alert(err);
      });
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our Technology
    if ((value || '').trim()) {
      this.technologies.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(technology: Technology): void {
    const index = this.technologies.indexOf(technology);

    if (index >= 0) {
      this.technologies.splice(index, 1);
    }
  }

}

export interface Technology {
  name: string;
}


export interface EditProfileModel {
  emailid: string,
  technologies: any,
  linkedInUrl: any
}
