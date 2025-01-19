"use strict";
import { RestaurantService } from "./classes/restaurant-service";

const newPlaceForm = document.getElementById("newRestaurant") as HTMLFormElement;
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;

newPlaceForm.image.addEventListener("change", loadImage);
newPlaceForm.addEventListener("submit", validateForm);
const restaurantService = new RestaurantService();

function testInputExpr(input : HTMLInputElement, expr: RegExp) : boolean {
    input.classList.remove("is-valid", "is-invalid");
    const valid = expr.test(input.value);
    input.classList.add(valid ? "is-valid" : "is-invalid");
    return valid;
}

function validatePhone(): boolean {
    return testInputExpr(newPlaceForm.phone as HTMLInputElement, /^[0-9]{9}$/);
}

function validateName(): boolean {
    return testInputExpr(newPlaceForm.name as unknown as HTMLInputElement, /^[a-z][a-z ]*$/i);
}

function validateDescription() : boolean{
    return testInputExpr(newPlaceForm.description  as HTMLInputElement, /\S/);
}

function validateCuisine() : boolean {
    return testInputExpr(newPlaceForm.cuisine as HTMLInputElement, /\S/);
}

function validateDays(daysArray : number[]) : boolean {
    const daysError = document.getElementById("daysError");
    if (!daysArray.length) daysError!.classList.remove("d-none");
    else daysError!.classList.add("d-none");
    return daysArray.length > 0;
}

function validateImage() : boolean {
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

function validateForm(event : Event) {
    event.preventDefault();
    const name = newPlaceForm.name;
    const image = imgPreview.src;
    const cuisine = newPlaceForm.cuisine.value as string;
    const description = newPlaceForm.description.value as string;
    const phone = newPlaceForm.phone.value as string;
    const daysOpen= Array.from(newPlaceForm.days as unknown as HTMLInputElement[])
        .filter((dc) => dc.checked)
        .map((dc) => +dc.toString());
    const daysOpenString = daysOpen.map((d) => d.toString());
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
            daysOpenString,
            0,
            0,
            "",
        );
        restaurantService.post(rest);

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
function createRestJson(name : string, image:string, cuisine:string, description:string, phone:string, daysOpen:string[],lat:number,lng:number,address:string) {
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
    if(!file) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", () => {
        imgPreview.classList.remove("d-none");
        imgPreview.src = fileReader.result as string;
    });
}
