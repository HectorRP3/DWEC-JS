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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { User } from '../../profile/interfaces/user';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { Coordinates } from '../../shared/interfaces/coordinates';
import { AlertModalComponent } from '../../shared/modals/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { MyGeolocation } from '../../shared/utils/my-geolocation';
import { sameValue } from '../../shared/validators/same-value.validator';
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
export class RegisterComponent implements CanComponentDeactivate {
  #fb = inject(NonNullableFormBuilder);
  #destroyRef = inject(DestroyRef);
  #authService = inject(AuthService);
  #router = inject(Router);
  imageBase64 = '';
  saved = false;
  #modalService = inject(NgbModal);

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
  canDeactivate() {
    return (
      this.saved ||
      this.registerForm.pristine ||
      this.confirmModal(
        ' ¿Quires abandonar la página?',
        'Los cambios se perderan..'
      )
    );
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

          this.saved = true;
          this.#router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.alertModal(
            'Error',
            'Error al registrar el usuario, por favor inténtelo de nuevo: ' +
              err.statusText
          );
        },
      });
    console.log(newUser);
  }

  alertModal(title: string, body: string) {
    const modalRef = this.#modalService.open(AlertModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
  }

  confirmModal(title: string, body: string) {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
    return modalRef.result.catch(() => false);
  }
}
