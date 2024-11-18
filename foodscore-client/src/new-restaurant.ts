"use strict";

import { RestaurantService } from "./classes/restaurant-service";

let newPlaceForm = document.getElementById("newRestaurant") as HTMLFormElement;
let imgPreview = document.getElementById("imgPreview") as HTMLImageElement;

newPlaceForm.image.addEventListener("change", loadImage);
newPlaceForm.addEventListener("submit", validateForm);
let restaurantService = new RestaurantService();

function testInputExpr(input: HTMLInputElement, expr: RegExp) {
    input.classList.remove("is-valid", "is-invalid");
    let valid = expr.test(input.value);
    input.classList.add(valid ? "is-valid" : "is-invalid");
    return valid;
}

function validatePhone() {
    return testInputExpr(newPlaceForm.phone, /^[0-9]{9}$/);
}

function validateName() {
    return testInputExpr(
        newPlaceForm.elements.namedItem("name") as HTMLInputElement,
        /^[a-z][a-z ]*$/i
    );
}

function validateDescription() {
    return testInputExpr(newPlaceForm.description, /\S/);
}

function validateCuisine() {
    return testInputExpr(newPlaceForm.cuisine, /\S/);
}

function validateDays(daysArray: number[]) {
    let daysError = document.getElementById("daysError") as HTMLElement;
    if (!daysArray.length) daysError.classList.remove("d-none");
    else daysError.classList.add("d-none");
    return daysArray.length > 0;
}

function validateImage() {
    let validate = false;
    let imgInput = document.getElementById("image") as HTMLInputElement;
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
    let name = (newPlaceForm.elements.namedItem("name") as HTMLInputElement)
        .value;
    let image = imgPreview.src;
    let cuisine = newPlaceForm.cuisine.value;
    let description = newPlaceForm.description.value;
    let phone = newPlaceForm.phone.value;
    let daysOpen = Array.from(newPlaceForm.days as HTMLInputElement[])
        .filter((dc) => dc.checked)
        .map((dc) => +dc.value);

    let validations = [
        validateName(),
        validateDescription(),
        validateCuisine(),
        validateDays(daysOpen),
        validatePhone(),
        validateImage(),
    ];

    if (validations.every((v) => v === true)) {
        //check all validations
        let rest = createRestJson(
            name,
            image,
            cuisine,
            description,
            phone,
            daysOpen
        );
        await restaurantService.post(rest);

        newPlaceForm.reset();
        imgPreview.classList.add("d-none");

        document
            .querySelectorAll(".form-control")
            .forEach((input) =>
                input.classList.remove("is-valid", "is-invalid")
            );
        document.getElementById("daysError")!.classList.add("d-none");
        location.assign("./index.html");
    }
}
function createRestJson(
    name: string,
    image: string,
    cuisine: string,
    description: string,
    phone: string,
    daysOpen: number[]
) {
    const rest = {
        name: name,
        image: image,
        description: description,
        cuisine: cuisine,
        phone: phone,
        daysOpen: daysOpen,
    };
    return rest;
}

function loadImage() {
    let file = (newPlaceForm.image as HTMLInputElement).files![0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", () => {
        imgPreview.classList.remove("d-none");
        imgPreview.src = fileReader.result as string;
    });
}
