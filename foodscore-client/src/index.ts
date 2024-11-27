import Swal from "sweetalert2";
import { RestaurantService } from "./classes/restaurant-service";
import { Restaurant } from "./interfaces/restaurant";
import { UserService } from "./classes/user-service";

let restaurants: Restaurant[] = [];
const buttonLoad = document.getElementById("loadMore") as HTMLButtonElement;
const restaurantService = new RestaurantService();
const userService = new UserService();
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
const filterInfo = document.getElementById("filterInfo") as HTMLDivElement;


const creator = new URLSearchParams(window.location.search).get("creator");
if (creator == null) {
    getrestaurants();
    buttonSearch.addEventListener("click", async () => {
        page = 1;
        const resp = await restaurantService.getRestaurantSearch(
            inputSearch.value,
            page
        );
        restaurants = resp;
        filterInfo.append(`Filtrando por: ${inputSearch.value}`);
        showRestaurants(restaurants);
        const more = await restaurantService.getMore(page);
        if (more) {
            buttonLoad.classList.add("d-none");
        }
    });
    buttonLoad.addEventListener("click", getrestaurants2);
} else {
    page = 1;
    getRestaurantByCreator();
    const information = await userService.getInformationUser(+creator!);
    filterInfo.prepend("Creator: " + information.name + " ");
    const more = await restaurantService.getRestaurantByCreatorMore(
        +creator,
        page
    );
    if (!more) {
        buttonLoad.classList.add("d-none");
    }
    buttonSearch.addEventListener("click", async () => {
        page = 1;
        const resp = await restaurantService.getRestaurantByCreatorSearch(
            +creator,
            page,
            inputSearch.value,
        );
        restaurants = resp;
        filterInfo.append(`Filtrando por: ${inputSearch.value}`);
        showRestaurants(restaurants);
        const more = await restaurantService.getRestaurantByCreatorMore(
            +creator,
            page
        );
        if (!more) {
            buttonLoad.classList.add("d-none");
        }
    });
    buttonLoad.addEventListener("click", getRestaurantByCreatorSearch);
}

async function getRestaurantByCreatorSearch(){
    const resp = await restaurantService.getRestaurantByCreatorSearch(+creator!,page,inputSearch.value);
    restaurants = resp;
    showRestaurants(restaurants);
}
async function getRestaurantByCreator() {
    const resp = await restaurantService.getRestaurantByCreator(+creator!);
    restaurants = resp;
    showRestaurants(restaurants);
}



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
    getrestaurants2();
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
    col.querySelector<HTMLAnchorElement>("div.shadow > a")!.href =
        "/restaurant-detail.html?id=" + restaurant.id;
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
    col.querySelector<HTMLInputElement>(".distance")?.prepend(
        restaurant.distance.toFixed(2).toString()
    );

    col.querySelector<HTMLButtonElement>("button.delete")?.classList.add(
        "d-none"
    );
    col.querySelector<HTMLButtonElement>("button.delete")?.addEventListener(
        "click",
        () => {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "No podrás recuperar el restaurante",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí",
                cancelButtonText: "Cancelar",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await restaurantService.delete(restaurant.id);
                        restaurants = restaurants.filter(
                            (r) => r.id !== restaurant.id
                        );
                        col.remove();
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
        }
    );
    if (restaurant.mine) {
        col.querySelector<HTMLButtonElement>("button.delete")?.classList.remove(
            "d-none"
        );
    }
    return col;
}
