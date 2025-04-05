import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideFacebookId } from './auth/facebook-login/facebook-login.config';
import { provideGoogleId } from './auth/google-login/google-login.config';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { baseUrlInterceptor } from './shared/interceptors/base-url.interceptor';

import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules)
    ),
    provideGoogleId(
      '746820501392-oalflicqch2kuc12s8rclb5rf7b1fist.apps.googleusercontent.com'
    ),
    provideFacebookId('9367752143315832', 'v15.0'),
    provideHttpClient(
      withInterceptors([baseUrlInterceptor, authInterceptor]),
      withFetch()
    ),
    provideAnimationsAsync(),
    provideClientHydration(withEventReplay()),
  ],
};
