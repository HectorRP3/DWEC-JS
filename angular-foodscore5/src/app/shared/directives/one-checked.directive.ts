import { Directive } from '@angular/core';
import {
  Validator,
  FormGroup,
  ValidationErrors,
  NG_VALIDATORS,
} from '@angular/forms';

@Directive({
  selector: '[oneChecked]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: OneCheckedDirective, multi: true },
  ],
})
export class OneCheckedDirective implements Validator {
  validate(group: FormGroup): ValidationErrors | null {
    if (Object.values(group.value).every((v) => v === false)) {
      return { oneChecked: true };
    }
    return null; // No errors
  }
}
