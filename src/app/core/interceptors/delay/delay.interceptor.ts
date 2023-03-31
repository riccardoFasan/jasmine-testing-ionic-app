import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, take, timer, switchMap } from 'rxjs';

@Injectable()
export class DelayInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const shouldDelay: boolean =
      request.url.includes('localhost') && request.url.includes('json');
    if (shouldDelay) {
      return timer(300).pipe(
        take(1),
        switchMap(() => next.handle(request))
      );
    }
    return next.handle(request);
  }
}
