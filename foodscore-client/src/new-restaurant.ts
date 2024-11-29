"use strict";

import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { RestaurantService } from "./classes/restaurant-service";
import { Point } from "ol/geom";
import { RestaurantInsert } from "./interfaces/restaurant";
import { MyGeolocation } from "./classes/my-geolocation";
import { MapService } from "./classes/map-service";
import { useGeographic } from "ol/proj";
import Swal from "sweetalert2";

const logOut = document.getElementById("logout") as HTMLButtonElement;
logOut.addEventListener("click", () => {
    localStorage.removeItem("token");
    location.assign("./login.html");
});
const newPlaceForm = document.getElementById(
    "newRestaurant"
) as HTMLFormElement;
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;

newPlaceForm.image.addEventListener("change", loadImage);
newPlaceForm.addEventListener("submit", validateForm);
const restaurantService = new RestaurantService();
let lat: number;
let lng: number;

function testInputExpr(input: HTMLInputElement, expr: RegExp) {
    input.classList.remove("is-valid", "is-invalid");
    const valid = expr.test(input.value);
    input.classList.add(valid ? "is-valid" : "is-invalid");
    return valid;
}

function validatePhone() {
    return testInputExpr(
        newPlaceForm.elements.namedItem("phone") as HTMLInputElement,
        /^[0-9]{9}$/
    );
}

function validateName() {
    return testInputExpr(
        newPlaceForm.elements.namedItem("name") as HTMLInputElement,
        /^[a-z][a-z ]*$/i
    );
}

function validateDescription() {
    return testInputExpr(
        newPlaceForm.elements.namedItem("description") as HTMLInputElement,
        /\S/
    );
}

function validateCuisine() {
    return testInputExpr(
        newPlaceForm.elements.namedItem("cuisine") as HTMLInputElement,
        /\S/
    );
}

function validateDays(daysArray: number[]) {
    const daysError = document.getElementById("daysError") as HTMLElement;
    if (!daysArray.length) daysError.classList.remove("d-none");
    else daysError.classList.add("d-none");
    return daysArray.length > 0;
}

function validateImage() {
    let validate = false;
    const imgInput = document.getElementById("image") as HTMLInputElement;
    imgInput.classList.remove("is-valid", "is-invalid");
    if (imgInput.files!.length > 0) {
        imgInput.classList.add("is-valid");
        validate = true;
    } else {
        imgInput.classList.add("is-invalid");
    }
    return validate;
}

async function validateForm(event: Event) {
    event.preventDefault();
    const name = (newPlaceForm.elements.namedItem("name") as HTMLInputElement)
        .value;
    const image = imgPreview.src;
    const cuisine = newPlaceForm.cuisine.value as string;
    const description = newPlaceForm.description.value as string;
    const phone = newPlaceForm.phone.value as string;
    const daysOpen = Array.from(newPlaceForm.days as HTMLInputElement[])
        .filter((dc) => dc.checked)
        .map((dc) => +dc.value);
    const dayOpenString = daysOpen.map((d) => d.toString());
    const address = document.querySelector("input")!.value;
    const validations = [
        validateName(),
        validateDescription(),
        validateCuisine(),
        validateDays(daysOpen),
        validatePhone(),
        validateImage(),
    ];

    if (validations.every((v) => v === true)) {
        //check all validations
        const rest = createRestJson(
            name,
            image,
            cuisine,
            description,
            phone,
            dayOpenString,
            address,
            lat,
            lng
        );
        await restaurantService
            .post(rest)
            .then(() => {
                newPlaceForm.reset();
                imgPreview.classList.add("d-none");

                document
                    .querySelectorAll(".form-control")
                    .forEach((input) =>
                        input.classList.remove("is-valid", "is-invalid")
                    );
                document.getElementById("daysError")!.classList.add("d-none");
                location.assign("./index.html");
            })
            .catch(() => {
                Swal.fire({
                    title: "Error",
                    text: "Formulario incorrecto faltan datos",
                    icon: "error",
                });
                return null;
            });
    }
}
function createRestJson(
    name: string,
    image: string,
    cuisine: string,
    description: string,
    phone: string,
    daysOpen: string[],
    address: string,
    lat: number,
    lng: number
): RestaurantInsert {
    const rest = {
        name: name,
        image: image,
        description: description,
        cuisine: cuisine,
        phone: phone,
        daysOpen: daysOpen,
        address: address,
        lat: lat,
        lng: lng,
    };
    return rest;
}

function loadImage() {
    const file = (newPlaceForm.image as HTMLInputElement).files![0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", () => {
        imgPreview.classList.remove("d-none");
        imgPreview.src = fileReader.result as string;
    });
}
useGeographic();

async function showMap() {
    const coords = await MyGeolocation.getLocation();

    const mapService = new MapService(coords, "map");
    const marker = mapService.createMarker(coords);

    const autocomplete = new GeocoderAutocomplete(
        document.getElementById("autocomplete")!,
        "0e06ec1237024679917ce4cd898d1a99",
        { lang: "es", debounceDelay: 600 }
    );

    autocomplete.on("select", (location) => {
        marker.setGeometry(
            new Point(location.geometry.coordinates as [number, number])
        );
        mapService.view.setCenter(
            location.geometry.coordinates as [number, number]
        );
        lat = location.geometry.coordinates[1];
        lng = location.geometry.coordinates[0];
    });
}

showMap();
