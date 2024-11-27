import { AuthService } from "./classes/auth-service";
import { Coordinates } from "./interfaces/coordinates";
import { User } from "./interfaces/user";


const authServices = new AuthService();
const form = document.getElementById("form-register") as HTMLFormElement;
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;

form.photo.addEventListener("change", loadImage);
form.addEventListener("submit", submitForm);
showMap();

function geolocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve(pos.coords);
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        reject("The request to get user location timed out.");
                        break;
                    default:
                        reject("An unknown error occurred.");
                        break;
                }
            }
        );
    });
}
async function showMap() {
    const coords = await geolocation();
    if (!coords) {
        alert("Coordenadas por defecto");
        form.lat.value = 38.40418795242372;
        form.lng.value = -0.5292668674082563;
    } else {
        form.lat.value = coords.latitude;
        form.lng.value = coords.longitude;
    }
}

async function submitForm(event: Event) {
    event.preventDefault();
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = form.email.value as string;
    const password = form.password.value as string;
    const lat = +form.lat.value;
    const lng = +form.lng.value;
    const avatar = imgPreview.src;

    const rest = createRestJson(name, email, password, lat, lng, avatar);

    const responses = await authServices.postRegister(rest);

    if(!responses){
        form.reset();
        imgPreview.classList.add("d-none");
        confirm("Metido");
        location.assign("./login.html");
    }else{
        alert("Error al insertar el usuario")
    } 
}
function createRestJson(
    name: string,
    email: string,
    password: string,
    lat: number,
    lng: number,
    avatar: string
): User {
    const rest = {
        name: name,
        email: email,
        password: password,
        lat: lat,
        lng: lng,
        avatar: avatar,
    };
    return rest;
}

function loadImage() {
    const file = (form.photo as HTMLInputElement).files![0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", () => {
        imgPreview.classList.remove("d-none");
        imgPreview.src = fileReader.result as string;
    });
}
