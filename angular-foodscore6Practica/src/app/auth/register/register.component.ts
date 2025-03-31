import {
  afterRenderEffect,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { from } from 'rxjs';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { Coordinates } from '../../shared/interfaces/coordinates';
import { MyGeolocation } from '../../shared/utils/my-geolocation';
import { sameValue } from '../../shared/validators/same-value.validator';
import { User } from '../../profile/interfaces/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'register',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    ValidationClassesDirective,
    EncodeBase64Directive,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  #fb = inject(NonNullableFormBuilder);
  #destroyRef = inject(DestroyRef);
  #authService = inject(AuthService);
  #router = inject(Router);
  imageBase64 = '';
  save = false;
  getActualCoordinates = toSignal(
    from(MyGeolocation.getLocation().then((c) => c))
  );
  emailControl = this.#fb.control('', {
    validators: [Validators.required, Validators.email],
  });
  registerForm = this.#fb.group({
    name: ['', Validators.required],
    email: this.emailControl,
    emailConfirm: ['', [sameValue(this.emailControl)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    lat: [0, Validators.required],
    lng: [0, Validators.required],
    avatar: ['', Validators.required],
  });

  constructor() {
    afterRenderEffect(async () => {
      console.log(this.getActualCoordinates());
      const coords: Coordinates = {
        latitude: this.getActualCoordinates()?.latitude ?? 38.40418795242372,
        longitude:
          this.getActualCoordinates()?.longitude ?? -0.5292668674082563,
      };
      console.log(coords);

      if (coords) {
        this.registerForm.controls.lat.setValue(coords.latitude);
        this.registerForm.controls.lng.setValue(coords.longitude);
      }
    });
    this.emailControl.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.registerForm.controls.emailConfirm.updateValueAndValidity();
      });
  }

  register() {
    const newUser: User = {
      ...this.registerForm.getRawValue(),
      avatar: this.imageBase64,
    };
    this.#authService
      .postRegister(newUser)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (res) => {
          console.log('Register');
          console.log({ res });

          this.save = true;
          this.#router.navigate(['/auth/login']);
        },
        error: () => console.log('Error al insertar'),
      });
    console.log(newUser);
  }
}
