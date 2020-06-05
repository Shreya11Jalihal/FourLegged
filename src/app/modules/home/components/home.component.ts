import { Component, OnInit,Renderer2} from '@angular/core';
import { Router, ActivatedRoute ,NavigationEnd } from '@angular/router';

@Component({
  selector: 'em-home',
  templateUrl: '../pages/home.view.html',
  styleUrls: ['../home.component.css']
})
export class HomeComponent implements OnInit {

  images = ["names1","Slide1","Slide3"].map((n) => `assets/${n}.jpg`);
  constructor(private router: Router,private renderer: Renderer2) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.renderer.setStyle(document.body, 'background-image', ' url("../../../assets/dog.jpg")');
      }
    });
   }

  ngOnInit(): void {
  }

}
