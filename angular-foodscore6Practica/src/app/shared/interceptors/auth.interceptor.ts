import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SsrCookieService } from '../services/ssr-cookie.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // const token = localStorage.getItem('token');
  // const platFormId = inject(PLATFORM_ID);
  // const token = isPlatformBrowser(platFormId)
  //   ? localStorage.getItem('token')
  //   : null;
  const token = inject(SsrCookieService).getCookie('token');
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
    return next(authReq);
  }
  return next(req);
};
