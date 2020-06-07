import { CommonModule } from '@angular/common';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {RouterModule} from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent} from './components/home.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';





@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgxPageScrollCoreModule,
    RouterModule.forRoot(
			[],
			{
				// Tell the router to use the hash instead of HTML5 pushstate.
				useHash: true,
 
				// In order to get anchor / fragment scrolling to work at all, we need to
				// enable it on the router.
				anchorScrolling: "enabled",
 
				// Once the above is enabled, the fragment link will only work on the
				// first click. This is because, by default, the Router ignores requests
				// to navigate to the SAME URL that is currently rendered. Unfortunately,
				// the fragment scrolling is powered by Navigation Events. As such, we
				// have to tell the Router to re-trigger the Navigation Events even if we
				// are navigating to the same URL.
				onSameUrlNavigation: "reload",
 
				// Let's enable tracing so that we can see the aforementioned Navigation
				// Events when the fragment is clicked.
			//	enableTracing: true,
				scrollPositionRestoration: "enabled"
			}
		)
  ],
  providers: [],
  bootstrap: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule { }
