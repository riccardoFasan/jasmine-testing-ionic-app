import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, delay } from 'rxjs';

@Injectable()
export class DelayInterceptor implements HttpInterceptor {
  private readonly delay: number = 300;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const shouldDelay: boolean =
      request.url.includes('localhost') && request.url.includes('json');
    return next.handle(request).pipe(delay(shouldDelay ? this.delay : 0));
  }
}
