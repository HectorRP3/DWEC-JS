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
 * "insert-before">Insert before</button>
    <button id="insert-after">Insert after</button>
    <button id="replace">Replace</button>
    <button id="delete">Delete selected</button>
    <button id="clear"
 */
let container = document.querySelectorAll('.container > div');
container.forEach(anyadirClases())

let insertar = document.querySelector("insert-after")
let replace = document.querySelector("replace")
let borrar = document.querySelector("delete")
let clear = document.querySelector("clear")



function anyadirClases(){
    container.forEach(x=>{
        x.addEventListener('click',()=>{
            container.forEach(x=>{x.classList.remove("selected")})
            x.classList.add("selected")
        })
    })
}

