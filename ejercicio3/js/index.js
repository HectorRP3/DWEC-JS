import { RestaurantsService } from "./restaurant-service.class.js";

let restaurant = [];
let restaurantService = new RestaurantsService();
const placesContainer = document.getElementById("placesContainer");
const searchInput = document.getElementById("search");
const restTemplate = document.getElementById("restaurantTemplate");
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
// let buttonDelete = document.querySelector(".delete")

function addEvent(restaurant) {
  let col = restTemplate.content.cloneNode(true).firstElementChild;
  col.querySelector(".card-img-top").src = restaurant.image;
  col.querySelector(".card-title").textContent = restaurant.name;
  col.querySelector("p.card-text").textContent = restaurant.description;
  col
    .querySelector("div.card-text .text-muted")
    .append(restaurant.daysOpen.map((d) => WEEKDAYS[d]).join(", "));
  if (restaurant.daysOpen.includes(new Date().getDay().toString())) {
    col.querySelector(".badge.bg-danger").remove();
  } else {
    col.querySelector(".badge.bg-success").remove();
  }
  col.querySelector(".phone").append(restaurant.phone);
  col.querySelector(".card-footer small").textContent = restaurant.cuisine;
  col.querySelector("button.delete").addEventListener("click", async (e) => {
    let del = confirm("¿Seguro que quieres borrar el restaurante?");
    if (del) {
      try {
        await restaurantService.delete(restaurant.id);
        restaurant = restaurant.filter((r) => r.id !== restaurant.id);
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
  restaurant = await restaurantService.getAll();
  showRestaurants(restaurant);
}

function showRestaurants(restaurants) {
  placesContainer.replaceChildren(...restaurants.map((rest) => addEvent(rest)));
}

//main
getRestaurant();

searchInput.addEventListener("keyup", (e) => {
  const filtered = restaurant.filter(
    (rest) =>
      rest.name.toLowerCase().includes(searchInput.value.toLocaleLowerCase()) ||
      rest.description
        .toLowerCase()
        .includes(searchInput.value.toLocaleLowerCase())
  );
  showRestaurants(filtered);
});
