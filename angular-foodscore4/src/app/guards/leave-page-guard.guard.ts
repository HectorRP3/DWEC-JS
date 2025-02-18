import { CanDeactivateFn } from '@angular/router';

export const leavePageGuardGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return true;
};
