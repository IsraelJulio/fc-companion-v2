import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const BASE_URL = 'http://localhost:5000/api/v1';
  if (!req.url.startsWith('http')) {
    return next(req.clone({ url: `${BASE_URL}${req.url}` }));
  }
  return next(req);
};
