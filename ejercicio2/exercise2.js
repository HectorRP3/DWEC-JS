"use strict";

const newProdForm = document.getElementById("newRestaurant")
let valorImage

newProdForm.image.addEventListener('change', event => {
    let file = event.target.files[0]
    let reader = new FileReader()
    if (file) reader.readAsDataURL(file)
    reader.addEventListener('load', e => {
        // Borra la clase d-none del elemento “imgPreview”
        imgPreview.classList.remove("d-none")
        imgPreview.src = reader.result
        valorImage = reader.result
    });
});

newProdForm.addEventListener('submit',(e) =>{
    e.preventDefault()
    // nombrar varibles
    const arrayFechas = {
        0 : "Dom",
        1 : "Lun",
        2 : "Mar",
        3 : "Mie",
        4 : "Jue",
        5 : "Vie",
        6 : "Sab"
    }
    let arrayDias = []
    const container = document.getElementById("placesContainer")
    const name = newProdForm.elements.namedItem("name")
    const description = newProdForm.elements.namedItem("description")
    const cuisine = newProdForm.elements.namedItem("cuisine")
    const days = Array.from(newProdForm.elements.namedItem("days"))
                        .filter((input) => input.checked)
                        .map((input)=>input.value)
    const phone = newProdForm.elements.namedItem("phone")
    let resultado,resultado2,resultado3,resultado4,resultado5,resultado6=false
    resultado= comprobarName()
    resultado2 = comprobarDescription()
    resultado3 = comprobarCocina()
    resultado4 = comprobarDays()
    resultado5 = comprobarPhone()
    resultado6 = ComprobarImg()
    // construccion del template
    const userHTML = userTemplate.content.cloneNode(true);
    const div  = userHTML.firstElementChild;
    div.querySelector("img").src = valorImage;
    div.querySelector("h4").textContent = name.value;
    div.querySelector("p").textContent = description.value;
    const [daysElement, phoneElement, cocinaElement] = div.querySelectorAll("small")
    days.forEach(d=>{
        arrayDias.push(arrayFechas[d])
    })
    daysElement.append(arrayDias)
    phoneElement.append(phone.value)
    cocinaElement.append(cuisine.value)
    const [abierto,cerrado] = div.querySelectorAll("span")
    dayOpenClose(abierto,cerrado,days)
    

    if(resultado && resultado2 && resultado3 && resultado4 && resultado5 && resultado6){
        container.append(div)
        newProdForm.reset()
        imgPreview.classList.add("d-none")
        limpiarClases()

    }
    
})
function limpiarClases(){
    const name = document.getElementById("name")
    const description = document.getElementById("description")
    const cuisine = document.getElementById("cuisine")
    const phone = document.getElementById("phone")
    const img= document.querySelector("#image")
    name.classList.remove("is-valid")
    name.classList.remove("is-invalid")
    description.classList.remove("is-invalid")
    description.classList.remove("is-valid")
    cuisine.classList.remove("is-invalid")
    cuisine.classList.remove("is-valid")
    phone.classList.remove("is-valid")
    phone.classList.remove("is-invalid")
    img.classList.add("d-none")
}

function dayOpenClose(abierto,cerrado,days){
    const date = new Date()
    if(days.includes(date.getDay().toString())){
        abierto.classList.remove("d-none")
        cerrado.classList.add("d-none")
    }else{
        abierto.classList.add("d-none")
        cerrado.classList.remove("d-none")
    }
}

function comprobarName(){
    const name = document.getElementById("name")
    if(name.value.match(/^[a-z\s]+/)){
        name.classList.add("is-valid")
        name.classList.remove("is-invalid")
        return true
    }else{
        name.classList.add("is-invalid")
        name.classList.remove("is-valid")
    }

}
function comprobarDescription(){
    const description = document.getElementById("description")
    if(description.value.match(/^\w+/)){
        description.classList.add("is-valid")
        description.classList.remove("is-invalid")
        return true
    }else{
        description.classList.add("is-invalid")
        description.classList.remove("is-valid")
    }
}
function comprobarCocina(){
    const cuisine = document.getElementById("cuisine")
    if(cuisine.value.match(/^\w+/)){
        cuisine.classList.add("is-valid")
        cuisine.classList.remove("is-invalid")
        return true
    }else{
        cuisine.classList.add("is-invalid")
        cuisine.classList.remove("is-valid")
    }
}
function comprobarDays(){
    const days = Array.from(newProdForm.elements.namedItem("days"))
        .filter((input) => input.checked)
    let daysError = document.getElementById("daysError")

        if(days.length>0){
            daysError.classList.add("d-none")
            return true
        }else{
            daysError.classList.remove("d-none")
            return false
        }

}

function comprobarPhone(){
    const phone = document.getElementById("phone")
    if(phone.value.match(/^[0-9]{9}/)){
        phone.classList.add("is-valid")
        phone.classList.remove("is-invalid")
        return true
    }else{
        phone.classList.add("is-invalid")
        phone.classList.remove("is-valid")
    }
}
function ComprobarImg(){
    const img = document.getElementById("image")
    if(img.value){
        img.classList.add("is-valid")
        img.classList.remove("is-invalid")
        return true
    }else{
        img.classList.add("is-invalid")
        img.classList.remove("is-valid")
    }
}

