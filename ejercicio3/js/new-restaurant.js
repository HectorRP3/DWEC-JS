"use strict"
import {RestaurantsService} from "./restaurant-service.class.js"
let newPlaceForm = document.getElementById("newRestaurant")
let imgPreview = document.getElementById("imgPreview")

newPlaceForm.image.addEventListener("change",loadImage)
newPlaceForm.addEventListener("submit",validateForm)
let restaurantService = new RestaurantsService()


function testInputExpr(input,expr){
    input.classList.remove("is-valid","is-invalid")
    let valid = expr.test(input.value)
    input.classList.add(valid ? "is-valid" : "is-invalid")
    return valid
}

function validatePhone() {
    return testInputExpr(newPlaceForm.phone, /^[0-9]{9}$/);
}

function validateName() {
    return testInputExpr(newPlaceForm.name, /^[a-z][a-z ]*$/i);
}

function validateDescription() {
    return testInputExpr(newPlaceForm.description, /\S/);
}

function validateCuisine() {
    return testInputExpr(newPlaceForm.cuisine, /\S/);
}

function validateDays(daysArray){
    let daysError = document.getElementById("daysError")
    if(!daysArray.length) daysArray.classList.remove("d-none")
    else daysError.classList.add("d-none")
    return daysArray.length > 0;
}

function validateImage(){
    let validate = false
    let imgInput = document.getElementById("image")
    imgInput.classList.remove("is-valid", "is-invalid")
    if(imgInput.files.length> 0){
        imgInput.classList.add("is-valid")
        validate = true
    }else {
        imgInput.classList.add("is-invalid")
    }
    return validate
}

async function validateForm(event){
    event.preventDefault()
    let name = newPlaceForm.name.value;
    let image = imgPreview.src;
    let cuisine = newPlaceForm.cuisine.value;
    let description = newPlaceForm.description.value;
    let phone = newPlaceForm.phone.value;
    let daysOpen = Array.from(newPlaceForm.days)
    .filter((dc) => dc.checked)
    .map((dc) => +dc.value);

    let validations = [
        validateName(),
        validateDescription(),
        validateCuisine(),
        validateDays(daysOpen),
        validatePhone(),
        validateImage(),
    ]

    if(validations.every((v) => v === true)){
        //check all validations
        let rest = createRestJson(name, image,cuisine,description,phone,daysOpen)
        const rInsert = await restaurantService.post(rest)
    
        newPlaceForm.reset()
        imgPreview.classList.add("d-none")
        
        
        document
            .querySelectorAll(".form-control")
            .forEach((input) => input.classList.remove("is-valid","is-invalid"))
        document.getElementById("daysError").classList.add("d-none")
        location.assign("./index.html")
    }
}
function createRestJson(name, image,cuisine,description,phone,daysOpen){
    const rest = {
        name:name,
        image:image,
        description:description,
        cuisine:cuisine,
        phone:phone,
        daysOpen:daysOpen,
    }
    return rest
}

function loadImage(event){
    let file = event.target.files[0]
    let reader = new FileReader()
    if (file) reader.readAsDataURL(file)
    
    reader.addEventListener("load", (e)=> {
        imgPreview.classList.remove("d-none")
        imgPreview.src  = reader.result
    })
}





