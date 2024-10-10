/*****
 * DOM - Exercise 1
 * 
 * Cuando un usuario haga click en un div dentro del elemento div.container, añade o quita (toggle) la clase CSS
 * "selected". 
 * El elemento button#delete borrará todos los divs seleccionados del DOM.
 */

let container = document.querySelectorAll('.container > div');

// let contain = document.querySelector(".container")

// let elemento = contain.children

container.forEach(x=>{
    x.addEventListener('click',()=>{
        x.classList.toggle("selected")
    })
})

let borrar = document.getElementById("delete")

borrar.addEventListener('click',()=>{
    container.forEach(x=>{
        x.classList.remove("selected")
    })
})

