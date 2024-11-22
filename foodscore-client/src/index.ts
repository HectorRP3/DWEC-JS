import { RestaurantService } from "./classes/restaurant-service";
import { Restaurant } from "./interfaces/restaurant";

let restaurants: Restaurant[] = [];
const buttonLoad = document.getElementById("loadMore") as HTMLButtonElement;
const restaurantService = new RestaurantService();
const placesContainer = document.getElementById(
    "placesContainer"
) as HTMLDivElement;
const restTemplate = document.getElementById(
    "restaurantTemplate"
) as HTMLTemplateElement;
const WEEKDAYS: string[] = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
let page = 1;
const buttonSearch = document.getElementById("searchBtn") as HTMLButtonElement;
const inputSearch = document.getElementById("searchInput") as HTMLInputElement;

buttonSearch.addEventListener("click", async () => {
    const resp = await restaurantService.getRestaurantSearch(inputSearch.value);
    restaurants = resp;
    showRestaurants(restaurants);
});
buttonLoad.addEventListener("click", getrestaurants2);

async function getrestaurants2() {
    const more = await restaurantService.getMore(page);
    if (more) {
        page++;
        const res = await restaurantService.getNextRestaurants(page);
        restaurants = [...restaurants, ...res];
        showRestaurants(restaurants);
    } else {
        buttonLoad.classList.add("d-none");
    }
}

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
    const clone = restTemplate.content.cloneNode(true) as DocumentFragment;
    const col = clone.children[0];
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
    col.querySelector<HTMLInputElement>(".distance")?.prepend(restaurant.distance.toString());

    col.querySelector<HTMLButtonElement>("button.delete")?.classList.add(
        "d-none"
    );
    col.querySelector<HTMLButtonElement>("button.delete")?.addEventListener(
        "click",
        async () => {
            const del = confirm("¿Seguro que quieres borrar el restaurante?");
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
    if (restaurant.mine) {
        col.querySelector<HTMLButtonElement>("button.delete")?.classList.remove(
            "d-none"
        );
    }
    return col;
}

// Main
getrestaurants();
