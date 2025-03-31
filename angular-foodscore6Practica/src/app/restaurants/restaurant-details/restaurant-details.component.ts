import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { OlMapDirective } from '../../shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/ol-maps/ol-marker.directive';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RestaurantsService } from '../services/restaurants.service';
import { Comment } from '../interfaces/comments';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'restaurant-details',
  imports: [
    RouterLink,
    RestaurantCardComponent,
    OlMapDirective,
    OlMarkerDirective,
    StarRatingComponent,
    StarRatingComponent,
    ReactiveFormsModule,
    ValidationClassesDirective,
    DatePipe,
  ],
  templateUrl: './restaurant-details.component.html',
  styleUrl: './restaurant-details.component.css',
})
export class RestaurantDetailsComponent {
  id = input.required<number>();
  #restaurantService = inject(RestaurantsService);
  // restaurant = input.required<Restaurant>();
  weekDay: number = new Date().getDay();
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  coordinates = signal<[number, number]>([-0.5, 38.5]);
  #title = inject(Title);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #destroyRef = inject(DestroyRef);
  #modalService = inject(NgbModal);
  message = 'No hay Comentarios';
  contructor() {
    console.log('Detailil');
  }
  commented = signal(false);

  restaurantResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) =>
      this.#restaurantService.getRestaurant(id).pipe(
        tap((r) => {
          this.coordinates.set([r.lng, r.lat]);
          this.#title.setTitle(r.name + ' | FoodScore');
        }),
        catchError(() => {
          this.#router.navigate(['/restaurants']);
          return EMPTY;
        })
      ),
  });

  commentsResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) =>
      this.#restaurantService.getCommentById(id).pipe(
        tap((r) => {
          console.log(r.comments);
        }),
        catchError(() => {
          this.message = 'Error cogiendo los comentarios';
          return EMPTY;
        })
      ),
  });

  commentForm = this.#fb.group({
    text: ['', [Validators.required, Validators.minLength(3)]],
    stars: [1, [Validators.required]],
  });

  addComment() {
    console.log('AddComment');
    const newComment: Comment = {
      stars: this.commentForm.controls.stars.value!,
      text: this.commentForm.controls.text.value!,
    };
    this.#restaurantService
      .postComment(newComment, this.id())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.commentForm.reset();
          // preguntar
          // const comments = this.commentsResource.value();
          // this.commentsResource.set({ comments: [...comments!.comments, res] });
          this.commentsResource.reload();
          this.commented.set(true);
        },
        error: () => {
          const modalRef = this.#modalService.open(ConfirmModalComponent);
          modalRef.componentInstance.title = 'Error al postear el comentario';
          modalRef.componentInstance.body =
            'En la insercion de comentario hubo un error, prueba a renviarlo más tarde';
        },
      });
  }

  changeRating(rating: number) {
    this.commentForm.controls.stars.setValue(rating);
    console.log(this.commentForm.controls.stars.value);
  }

  getOpenDayNames(daysOpen: string[]) {
    return daysOpen.map((d) => this.days[+d]).join(', ');
  }
}
