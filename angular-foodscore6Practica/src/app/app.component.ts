import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('routeAnimation', [
      transition('restaurantsPage => restaurantsDetail', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateY(100%)' })),
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateY(-100%)' })),
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
        ]),
      ]),
      transition('restaurantsDetail => restaurantsPage', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateY(-100%)' })),
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateY(100%)' })),
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
        ]),
      ]),
      transition('restaurantsDetail => restaurantEdit', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(100%)' })),
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(-100%)' })),
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
        ]),
      ]),
      transition('restaurantEdit => restaurantsDetail', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(-100%)' })),
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(100%)' })),
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
        ]),
      ]),
      transition('restaurantsPage => restaurantEdit', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(100%)' })),
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(-100%)' })),
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
        ]),
      ]),
      transition('restaurantEdit => restaurantsPage', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
        query(':enter', style({ transform: 'translateX(-100%)' })),
        group([
          query(':leave', [
            animate('0.4s', style({ transform: 'translateX(100%)' })),
            animate('0.2s', style({ opacity: 0 })),
          ]),
          query(':enter', [animate('0.5s', style({ transform: 'none' }))]),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {
  getState(routerOutlet: RouterOutlet) {
    return routerOutlet.activatedRouteData['animation'] || 'None';
  }
}
