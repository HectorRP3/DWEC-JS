import {RestaurantsService} from "./restaurant-service.class.js"


let restaurantService = new RestaurantsService();
let placesContainer = document.getElementById("placesContainer")
const restTemplate = document.getElementById("restaurantTemplate")
let filtar = document.getElementById("search")
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
let buttonDelete = document.querySelector(".delete")

function addEvent(rest) {
    let daysar=Array.from(rest.daysOpen)
    const userHTML = restTemplate.content.cloneNode(true);
    const col  = userHTML.firstElementChild;
    col.querySelector(".card-img-top").src = rest.image;
    col.querySelector(".card-title").textContent = rest.name;
    col.querySelector("p.card-text").textContent =rest.description;
    col
        .querySelector("div.card-text .text-muted")
        .append(daysar.map((d) => WEEKDAYS[d]).join(", "));
    if (daysar.includes(new Date().getDay().toString())) {
        col.querySelector(".badge.bg-danger").remove();
    } else {
        col.querySelector(".badge.bg-success").remove();
    }
    col.querySelector(".phone").append(rest.phone);
    col.querySelector(".card-footer small").textContent = rest.cuisine;
    col.querySelector(".delete").addEventListener("click",async() =>{
        await restaurantService.delete(rest.id)
        col.remove()
    })
    placesContainer.append(col);
}

async function getRestaurant(){
    const rest = await restaurantService.getAll()
    rest.forEach(addEvent);
}
getRestaurant()

function filterRestaurants(){
    let filter = filtar.value.toLowerCase()
    let rest = document.querySelectorAll(".col")
    rest.forEach((restaurant) => {
        let name = restaurant.querySelector(".card-title").textContent.toLowerCase()
        let description = restaurant.querySelector("p.card-text").textContent.toLocaleLowerCase()
        if(name.includes(filter)||description.includes(filter)){
            restaurant.classList.remove("d-none")
        }else{
            restaurant.classList.add("d-none")
        }
    })
}
filtar.addEventListener("input", filterRestaurants)
