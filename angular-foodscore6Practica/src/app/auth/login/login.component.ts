import {
  afterRenderEffect,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import {
  UserLogin,
  UserLoginFacebook,
  UserLoginGoogle,
} from '../../profile/interfaces/user';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { Coordinates } from '../../shared/interfaces/coordinates';
import { AlertModalComponent } from '../../shared/modals/alert-modal/alert-modal.component';
import { MyGeolocation } from '../../shared/utils/my-geolocation';
import { FbLoginDirective } from '../facebook-login/fb-login.directive';
import { GoogleLoginDirective } from '../google-login/google-login.directive';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login',
  imports: [
    RouterLink,
    GoogleLoginDirective,
    FbLoginDirective,
    FaIconComponent,
    ReactiveFormsModule,
    ValidationClassesDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  #fb = inject(NonNullableFormBuilder);
  #destroyRef = inject(DestroyRef);
  #authService = inject(AuthService);
  #router = inject(Router);
  #modalService = inject(NgbModal);

  getActualCoordinates = toSignal(
    from(MyGeolocation.getLocation().then((c) => c))
  );

  loginForm = this.#fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    lat: [0, Validators.required],
    lng: [0, Validators.required],
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
        this.loginForm.controls.lat.setValue(coords.latitude);
        this.loginForm.controls.lng.setValue(coords.longitude);
      }
    });
  }

  login() {
    const userLogin: UserLogin = {
      ...this.loginForm.getRawValue(),
      lat: this.loginForm.controls.lat.value,
      lng: this.loginForm.controls.lng.value,
    };
    this.#authService
      .postLogin(userLogin)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (res) => {
          console.log(res.accessToken);
          this.#router.navigate(['/restaurants']);
        },
        error: (err) => {
          this.alertModal(
            'Error',
            'Error al iniciar sesión : ' + err.statusText
          );
        },
      });
  }

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    console.log(resp.credential);
    const userLoginGoogle: UserLoginGoogle = {
      token: resp.credential,
      lat: this.loginForm.controls.lat.value,
      lng: this.loginForm.controls.lng.value,
    };
    console.log(userLoginGoogle);
    this.#authService
      .postLoginGoogle(userLoginGoogle)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.#router.navigate(['/restaurants']);
        },
        error: (err) => {
          this.alertModal(
            'Error',
            'Error al iniciar sesión : ' + err.statusText
          );
        },
      });
  }
  iconFacebook = faFacebook;
  //...
  loggedFacebook(resp: fb.StatusResponse) {
    const UserLoginFacebook: UserLoginFacebook = {
      token: resp.authResponse.accessToken!,
      lat: this.loginForm.controls.lat.value,
      lng: this.loginForm.controls.lng.value,
    };
    this.#authService
      .postLoginFacebook(UserLoginFacebook)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.#router.navigate(['/restaurants']);
        },
        error: (err) => {
          this.alertModal(
            'Error',
            'Error al iniciar sesión : ' + err.statusText
          );
        },
      });
    console.log(resp.authResponse.accessToken);
    console.log(resp.authResponse);
  }

  showError(error: string) {
    console.error(error);
  }

  alertModal(title: string, body: string) {
    const modalRef = this.#modalService.open(AlertModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
  }
}
