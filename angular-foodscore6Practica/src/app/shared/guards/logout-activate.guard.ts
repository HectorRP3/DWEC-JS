import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { map } from 'rxjs';

export const logoutActivateGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLogged().pipe(
    map((r) => {
      if (r) {
        return router.createUrlTree(['/restaurants']);
      } else {
        return true;
      }
    })
  );
};
