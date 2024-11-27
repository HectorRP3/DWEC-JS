import Swal from "sweetalert2";
import { AuthService } from "./classes/auth-service";
import { Coordinates } from "./interfaces/coordinates";
import { UserLogin } from "./interfaces/user";

const authService = new AuthService();
const form = document.getElementById("form-login") as HTMLFormElement;
let lat: number;
let lng: number;
form.addEventListener("submit", submitLogin);

async function submitLogin(event: Event) {
    event.preventDefault();
    const email = form.email.value as string;
    const password = form.password.value as string;
    chargeLocation();
    const rest = createResJson(email, password, lat, lng);

   await authService.postLogin(rest).then((res) => {
        localStorage.setItem("token", res.accessToken);
        location.assign("./index.html");
    }).catch(() => {
        Swal.fire({
            title: "Error",
            text: "Usuario o contraseña incorrectos",
            icon: "error",
            });
        return null;
    });


   
}

function createResJson(
    email: string,
    password: string,
    lat: number,
    lng: number
): UserLogin {
    const rest = {
        email: email,
        password: password,
        lat: lat,
        lng: lng,
    };
    return rest;
}

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
async function chargeLocation() {
    const coords = await geolocation();
    if (!coords) {
        alert("Coordenadas por defecto");
        lat = 38.40418795242372;
        lng = -0.5292668674082563;
    } else {
        lat = +coords.latitude;
        lng = +coords.longitude;
    }
}
