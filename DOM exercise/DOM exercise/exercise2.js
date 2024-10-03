/*****
 * DOM - Exercise 2
 * 
 * Cuando un usuario haga click sobre un div dentro del elemento div.container, añade o quita la clase CSS "selected".
 * Esta vez SOLO 1 div puede tener esa clase al mismo tiempo (quitala de otros elmentos cuando sea necesario)
 * 
 * El elemento button#insert-before creará un div NUEVO con el texto del elemento input#text antes 
 * del div seleccionado o al principio del elemento div.container si no hay nada selccionado (no 
 * olvides el evento de click del nuevo div).
 * 
 * El elemento button#insert-after hará lo mismo que el anterior pero lo insertará después del elemento seleccionado
 * o al principio de div.container si no hay nada selccionado.
 * 
 * El elemento button#replace, creará un NUEVO div con el texto y lo reemplazará por el seleccionado. Si no hay ninguno
 * seleccionado no hagas nada.
 * 
 * El elemento button#delete borrará el div seleccionado (si hay alguno)
 * 
 * El elemento button#clear borrará todo dentro de div.container.
 * 
 * NO USES innerHTML!!!!
 */
let cont = document.querySelector('.container')
let container = document.querySelectorAll('.container > div')
let cont2 = cont.childrens
let insertar = document.getElementById("insert-after")
let insertarAntes = document.getElementById("insert-before")
let replace = document.getElementById("replace")
let borrar = document.getElementById("delete")
let clear = document.getElementById("clear")
let inputText = document.getElementById("text")


insertar.addEventListener('click',(x)=>{
    let div = document.createElement("div")
    div.textContent = inputText.value
    x = document.querySelector(".selected")
    if(x){x.after(div)
    }else{cont.prepend(div)}
    container.forEach(anyadirClases)
})
insertarAntes.addEventListener('click',(x)=>{
    let div = document.createElement("div")
    div.textContent = inputText.value
    x = document.querySelector(".selected")
    if(x){x.before(div)
    }else{cont.prepend(div)}
    container.forEach(anyadirClases)
})

replace.addEventListener('click',(x)=>{
    x = document.querySelector(".selected")
    if(x){
        let div = document.createElement("div")
        div.textContent += inputText.value
        cont.replaceChild(div,x)
    }
    container.forEach(anyadirClases)
})



clear.addEventListener('click', ()=>{
    cont.replaceChildren()
})

borrar.addEventListener('click',(x)=>{
    x = document.querySelector(".selected");
    if(x){x.classList.remove("selected")}
})

container.forEach(anyadirClases)
function anyadirClases(){
    container = document.querySelectorAll('.container > div')
    container.forEach(x=>{
        x.addEventListener('click',()=>{
            container.forEach(x=>{x.classList.remove("selected")})
            x.classList.add("selected")
        })
    })
}

