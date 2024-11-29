import { MapService } from "./classes/map-service";
import { RestaurantService } from "./classes/restaurant-service";
import { Coordinates } from "./interfaces/coordinates";
import { Restaurant } from "./interfaces/restaurant";
import { Comment } from "./interfaces/comment";
import Swal from "sweetalert2";
const commnetTemplate = document.getElementById(
    "commentTemplate"
) as HTMLTemplateElement;
const cardContainer = document.getElementById(
    "cardContainer"
) as HTMLDivElement;
const template = document.getElementById(
    "restaurantTemplate"
) as HTMLTemplateElement;
const WEEKDAYS: string[] = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const creatorName = document.getElementById("creatorName") as HTMLInputElement;
const creatorEmail = document.getElementById(
    "creatorEmail"
) as HTMLInputElement;
const creatorImg = document.getElementById("creatorImg") as HTMLImageElement;
const commenst = document.getElementById("comments") as HTMLUListElement;
const commentForm = document.getElementById("commentForm") as HTMLFormElement;
const startValue = document.querySelectorAll<HTMLInputElement>("#stars i");
const restaruranService = new RestaurantService();
const stars = document.getElementById("stars") as HTMLInputElement;
const cardPulse = document.querySelector<HTMLDivElement>("#creatorCard > .card-body") as HTMLDivElement;
const logOut = document.getElementById("logout") as HTMLButtonElement;
logOut.addEventListener("click", () => {
    localStorage.removeItem("token");
    location.assign("./login.html");
});
let lat: number;
let lng: number;




commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = new URLSearchParams(window.location.search).get("id");
    
    const comment = {
        text: commentForm.comment.value,
        stars: +stars.value,
    };
    try {
        await restaruranService.postComment(+id!, comment);
        location.reload();
    } catch (e) {
        alert("¡Error publicando comentario!");
        console.error(e);
    }
});
startValue.forEach((e) => {
    e.addEventListener("click", () => {
        const score = e.getAttribute("data-score");
        stars.value = score!;
        startValue.forEach((e) => {
            e.classList.remove("bi-star-fill");
            e.classList.add("bi-star");
        });
        for (let i = 0; i < +score!; i++) {
            startValue[i].classList.remove("bi-star");
            startValue[i].classList.add("bi-star-fill");
        }   
    });
});


async function getRestaurant() {
    const id = new URLSearchParams(window.location.search).get("id");
    const resp = await restaruranService.getRestaurantId(+id!);
    showRestaurant(resp);
}

async function getComments() {
    const id = new URLSearchParams(window.location.search).get("id");
    const resp = await restaruranService.getRestaurantComments(+id!);
    showComeents(resp);
}
function showRestaurant(restaurant: Restaurant) {
    cardContainer.replaceChildren(restaurant2HTML(restaurant));
}
function showComeents(comments: Comment[]) {
    commenst.append(...comments.map((e) => comment2HTML(e)));
}

function comment2HTML(comment: Comment) {
    const clone = commnetTemplate.content.cloneNode(true) as DocumentFragment;
    const col = clone.children[0];
    col.querySelector<HTMLInputElement>(".rounded-circle")!.src =
        comment.user!.avatar;
    col.querySelector<HTMLInputElement>(".comment")!.textContent = comment.text;
    col.querySelector<HTMLInputElement>(".name")!.textContent =
        comment.user!.name;
    for (let i = 0; i < 5; i++) {
        if (i < comment.stars) {
            col.querySelector<HTMLInputElement>(".stars")!.append("★");
        } else {
            col.querySelector<HTMLInputElement>(".stars")!.append("☆");
        }
    }
    col.querySelector<HTMLInputElement>(".stars")!.append(
        comment.stars.toString()
    );
    col.querySelector<HTMLInputElement>(".date")!.append(
        comment.date!.toString()
    );
    return col;
}

function restaurant2HTML(restaurant: Restaurant) {
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const col = clone.children[0];
    lat = restaurant.lat;
    lng = restaurant.lng;
    showMap();
    col.querySelector<HTMLImageElement>(".card-img-top")!.src =
        restaurant.image;
    col.querySelector<HTMLInputElement>(".card-title")!.textContent =
        restaurant.name;
    col.querySelector<HTMLInputElement>(".card-text")!.textContent =
        restaurant.description;
    col.querySelector<HTMLInputElement>(".text-muted .days")?.append(
        restaurant.daysOpen.map((d) => WEEKDAYS[parseInt(d)]).join(",")
    );
    if (restaurant.daysOpen.includes(new Date().getDay().toString())) {
        col.querySelector<HTMLInputElement>(".badge.bg-danger")!.remove();
    } else {
        col.querySelector<HTMLInputElement>(".badge.bg-success")!.remove();
    }
    col.querySelector<HTMLInputElement>(".text-muted .phone")?.append(
        restaurant.phone
    );
    col.querySelector<HTMLInputElement>(".distance")?.prepend(
        restaurant.distance.toFixed(2) + " km"
    );
    col.querySelector<HTMLInputElement>(".cuisine")?.append(restaurant.cuisine);
    for (let i = 0; i < 5; i++) {
        if (i < restaurant.stars) {
            col.querySelector<HTMLInputElement>(".stars")?.append("★");
        } else {
            col.querySelector<HTMLInputElement>(".stars")?.append("☆");
        }
    }
    col.querySelector<HTMLInputElement>(".stars")?.append(
        restaurant.stars.toString()
    );

    cardContainer.replaceChildren(clone);
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
            }).then((result) => {
                if (result.isConfirmed) {
                    try {
                        restaruranService.delete(restaurant.id).then(() => {
                            location.assign("./index.html");
                        });
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
    
    if(restaurant.commented){
        commentForm.classList.add("d-none");
    }
    const address = document.getElementById("address") as HTMLInputElement;
    address.append(restaurant.address);

    creatorName.append(restaurant.creator.name);
    creatorEmail.append(restaurant.creator.email);
    creatorImg.src = restaurant.creator.avatar;
    cardPulse?.addEventListener("click", () => {
        location.assign(`./profile.html?id=${restaurant.creator.id}`);
    });
    return col;
}

getRestaurant();
getComments();

function showMap() {
    const coords: Coordinates = { latitude: lat, longitude: lng };
    const mapService = new MapService(coords, "map");
    mapService.createMarker(coords);
}



