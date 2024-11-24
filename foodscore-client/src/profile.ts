import { MapService } from "./classes/map-service";
import { UserService } from "./classes/user-service";
import { Coordinates } from "./interfaces/coordinates";
import { User } from "./interfaces/user";

const user = new UserService();
const name = document.getElementById("name") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const image = document.getElementById("avatar") as HTMLImageElement;
const buttonEditProfike = document.getElementById(
    "editProfile"
) as HTMLButtonElement;
const buttonEditPassword = document.getElementById(
    "editPassword"
) as HTMLButtonElement;
const buttonEditPhoto = document.getElementById(
    "photoInput"
) as HTMLInputElement;

let lat: number;
let lng: number;

async function getInformationMe() {
    const resp = await user.getInformationMe();
    user2HTML(resp);
}

function user2HTML(user: User) {
    name.replaceChildren(user.name);
    email.replaceChildren(user.email);
    image.src = user.avatar;
    lat = user.lat;
    lng = user.lng;
    showMap();

    if (!user.me) {
        buttonEditProfike.classList.add("d-none");
        buttonEditPassword.classList.add("d-none");
        buttonEditPhoto.classList.add("d-none");
    }
}

getInformationMe();

function showMap() {
    const coords: Coordinates = { latitude: lat, longitude: lng };
    const mapService = new MapService(coords, "map");
    mapService.createMarker(coords);
}
