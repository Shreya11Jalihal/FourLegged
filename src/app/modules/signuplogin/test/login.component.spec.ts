import { LoginComponent } from "../components/login.component"
import { ComponentFixture, TestBed } from '@angular/core/testing';


fdescribe('add login component tests',()=>{
    //TO verify if a component if defined
    it('is login component defined',()=>{
        let component: LoginComponent;
        //A handle on test environment around the component that is being created 
        let fixture:    ComponentFixture<LoginComponent>;

            TestBed.configureTestingModule({
                declarations : [LoginComponent]
            });

            fixture = TestBed.createComponent(LoginComponent);
            component=fixture.componentInstance;

            expect(component).toBeDefined;


    })

})