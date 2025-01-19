import { RestaurantService } from "./classes/restaurant-service.js";
import {  Restaurant} from "./interfaces/restaurant.js";

let restaurant: Restaurant[];
const restaurantService = new RestaurantService();
const placesContainer = document.getElementById("placesContainer") as HTMLElement;
const searchInput = document.getElementById("search") as HTMLInputElement;
const restTemplate = document.getElementById("restaurantTemplate") as HTMLTemplateElement;
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function addEvent(rest: Restaurant) {
    const col = restTemplate.content.cloneNode(true) as HTMLElement;
    col.querySelector<HTMLImageElement>(".card-img-top")!.src = rest.image;
    col.querySelector(".card-title")!.textContent = rest.name;
    col.querySelector("p.card-text")!.textContent = rest.description;
    col.querySelector("div.card-text .text-muted")?.append(
        rest.daysOpen.map((d) => WEEKDAYS[d]).join(", ")
    );
    if (rest.daysOpen.includes(new Date().getDay().toString())) {
        col.querySelector(".badge.bg-danger")!.remove();
    } else {
        col.querySelector(".badge.bg-success")!.remove();
    }
    col.querySelector(".phone")!.append(rest.phone);
    col.querySelector(".card-footer small")!.textContent = rest.cuisine;
    col.querySelector("button.delete")?.addEventListener("click", async () => {
        const del = confirm("¿Seguro que quieres borrar el restaurante?");
        if (del) {
            try {
                await restaurantService.delete(rest.id);
                restaurant = restaurant.filter((r) => r.id !== rest.id);
                col.remove();
            } catch (e) {
                alert("¡Error borrando restaurante!");
                console.error(e);
            }
        }
    });
    return col;
}

async function getRestaurant() {
    restaurant= await restaurantService.getAll();
    showRestaurants(restaurant);
}

function showRestaurants(restaurant: Restaurant[]) {
    placesContainer.replaceChildren(
        ...restaurant.map((rest) => addEvent(rest))
    );
}

//main
getRestaurant();

searchInput.addEventListener("keyup", () => {
    const filtered = restaurant.filter(
        (rest) =>
        rest.name.toLowerCase().includes(searchInput.value.toLocaleLowerCase()) ||
        rest.description
            .toLowerCase()
            .includes(searchInput.value.toLocaleLowerCase())
    );
    showRestaurants(filtered);
});

