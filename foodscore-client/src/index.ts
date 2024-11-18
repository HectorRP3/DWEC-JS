import { RestaurantService } from "./classes/restaurant-service";
import { Restaurant } from "./interfaces/restaurant";

let restaurants: Restaurant[] = [];
const restaurantService = new RestaurantService();
const placesContainer = document.getElementById(
    "placesContainer"
) as HTMLDivElement;
const restTemplate = document.getElementById(
    "restaurantTemplate"
) as HTMLTemplateElement;
const WEEKDAYS: string[] = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

async function getrestaurants() {
    restaurants = await restaurantService.getAll();
    showRestaurants(restaurants);
}

function showRestaurants(restaurants: Restaurant[]) {
    placesContainer.replaceChildren(
        ...restaurants.map((e) => restaurant2HTML(e))
    );
}

function restaurant2HTML(restaurant: Restaurant) {
    let clone = restTemplate.content.cloneNode(true) as DocumentFragment;
    let col = clone.children[0];
    col.querySelector<HTMLImageElement>(".card-img-top")!.src =
        restaurant.image;
    col.querySelector<HTMLInputElement>(".card-title")!.textContent =
        restaurant.name;
    col.querySelector<HTMLInputElement>("p.card-text")!.textContent =
        restaurant.description;
    col.querySelector<HTMLInputElement>(".text-muted .days")?.append(
        restaurant.daysOpen.map((d) => WEEKDAYS[parseInt(d)]).join(",")
    );
    if (restaurant.daysOpen.includes(new Date().getDay().toString())) {
        col.querySelector<HTMLInputElement>(".badge.bg-danger")!.remove();
    } else {
        col.querySelector<HTMLInputElement>(".badge.bg-success")!.remove();
    }
    col.querySelector<HTMLInputElement>(".phone")!.append(restaurant.phone);
    col.querySelector<HTMLInputElement>(".card-footer small")!.textContent =
        restaurant.cuisine;
    col.querySelector<HTMLButtonElement>("button.delete")?.addEventListener(
        "click",
        async () => {
            let del = confirm("¿Seguro que quieres borrar el restaurante?");
            if (del) {
                try {
                    await restaurantService.delete(restaurant.id);
                    restaurants = restaurants.filter(
                        (r) => r.id !== restaurant.id
                    );
                    col.remove();
                } catch (e) {
                    alert("¡Error borrando restaurante!");
                    console.error(e);
                }
            }
        }
    );
    return col;
}

// Main
getrestaurants();
