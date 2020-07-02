import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor,HttpRequest,HttpResponse,HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from "rxjs";
import {catchError, map,retry} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalHttpInterceptorService implements HttpInterceptor {
intercept(request:HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>>{
      return next.handle(request)
      .pipe(
       retry(1),
         catchError((error: HttpErrorResponse) => {
            let errMsg = '';
            // Client Side Error
            if (error.error instanceof ErrorEvent) {
              errMsg = `Error: ${error.error.message}`;
              switch(error.status)
              {
                //Unauthorised
                case 401:
                errMsg="401:You are unauthorised to view this page.You will be redirected to login page";
                this.router.navigateByUrl("/login");
                break;
                //Forbidden Error
                case 403:
                errMsg="403:You do not have the permission to access this page on the server";
                break;
                //Page not found error
                case 404:
                errMsg="404:Page Not found.Please try reloading the page or check the Url";
                break;
              }
            }
            // Server Side Error
            else {
              errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
              switch(error.status)
              {
                //Internal server error
                case 500:
                errMsg="500: We experienced an Internal Error in the application.Please try again later";
                break;
              }
            }
            return throwError(errMsg);
          })
       )
}
  constructor(private router: Router) { }
}
