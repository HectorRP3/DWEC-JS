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

    const container = document.getElementById("placesContainer")
    const name = newProdForm.elements.namedItem("name")
    const description = newProdForm.elements.namedItem("description")
    const cuisine = newProdForm.elements.namedItem("cuisene")
    const days = Array.from(newProdForm.elements.namedItem("days"))
                        .filter((input) => input.checked)
                        .map((input) => input.value)
    const phone = newProdForm.elements.namedItem("phone")
    const img = valorImage
    //create div 1
    // let div = document.createElement("div")
    // div.classList.add("col")
    //create div 2
    // let div2 = document.createElement("div")
    // div2.classList.add("card", "h-100", "shadow")
    // div.append(div2)
    // obtain image
    // let image = obtainImage(img)
    //append image to div2
    // div2.append(image)
    //create elemet div 3
    // let div3 = document.createElement("div")
    // div3.classList.add("card-body")
    //append div3 to div2
    // div2.append(div3)
    //create elemet h4
    // let h4 = obtainH4(name)
    //append h4 to div3
    // div3.append(h4)

    // appent to container
    //container.append(div)

    const userHTML = userTemplate.content.cloneNode(true);
    const div  = userHTML.firstElementChild;
    div.querySelector("img").src = valorImage;
    div.querySelector("h4").textContent = name.value;
    div.querySelector("p").textContent = description.value;
    container.append(div)

})
//create element image
// function obtainImage(img){
//     let image =  document.createElement("img")
//     image.classList.add("card-img-top")
//     image.src = img
//     return image
// }
// create element h4
// function obtainH4(name){
//     let nombre = document.createElement("h4")
//     nombre.classList.add("card-title")
//     nombre.textContent=name.value
//     return nombre
// }
