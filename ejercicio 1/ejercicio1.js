/**
 * Parte 1
 * Crea una función que tome una cadena como entrada y compruebe si es un palíndromo (es igual cuando se invierte).
 * Haz esto sin usar bucles (puedes usar Array.from para convertir una cadena en un array).
 * Comprueba que el tipo del parámetro es "string" y que la longitud es al menos 1 o muestra un error.
 * Ejemplo: esPalindromo("abeceba") -> true
 */

console.log("EJERCICIO 1 - PARTE 1");

function esPolindromo(cadena){
    let cadena2= Array.from(cadena).reverse()
    console.log(`¿La palabra ${cadena} es un Polindromo? ${cadena.toLocaleLowerCase()===cadena2.join('').toLocaleLowerCase()}`)
    
}
esPolindromo("abeceba")


/**
 * Parte 2
 * Desarrolla una función que comprima una cadena reemplazando caracteres repetitivos consecutivos con
 * el carácter y el número de repeticiones. Por ejemplo, "AAAABBBCC" se convertiría en "4A3B2C".
 * Ejemplo: stringCompression("GGGHHRRRRRRRUIIIOOOO") -> 3G2H7R1U3I4O
 */

console.log("EJERCICIO 1 - PARTE 2");
function stringCompression(cadena){
    let letraAnterior = cadena[0]
    let contador = 0
    let registroPalabra = ""
    for(let i in cadena){
        if(letraAnterior === cadena[i]){
            contador++
            letraAnterior = cadena[i]
        }
        else{
            registroPalabra += contador + letraAnterior 
            letraAnterior = cadena[i]
            contador = 1
        }
    }
    registroPalabra +=  contador + letraAnterior
    console.log(registroPalabra);
}
stringCompression("AAAABBBCC")

/**
 * Parte 3
 * Crea una función que tome un array de números que contenga valores duplicados. Debería devolver el
 * primer número que se repite en el array, o -1 si no hay duplicados.
 * No uses bucles, y si no sabes cómo hacerlo sin bucles, solo puedes usar un bucle
 * (.forEach cuenta como un bucle).
 * Ejemplo: encuentraRepetido([1,4,7,3,8,7,4,5,5,1]) -> 7 (se repite antes que el 4)
 */

console.log("EJERCICIO 1 - PARTE 3");

function encuentraRepetido(cadena){
    let cadena2 = cadena.filter((num,index)=>cadena.indexOf(num)!==index)
    console.log(cadena2[0])
}
encuentraRepetido([1,4,7,3,8,7,4,5,5,1])

/**
 * Parte 4
 * Crea una función que tome un array de cadenas como primer parámetro y una cadena como segundo.
 * Debería devolver un nuevo array que contenga las palabras del primer array cuyas letras estén todas presentes
 * en la segunda cadena. Intenta no usar bucles a no ser que no sepas hacerlo de otra manera.
 * Ejemplo: fitraPalabras(["house", "car", "watch", "table"], "catboulerham") -> ['car', 'table']
 */

console.log("EJERCICIO 1 - PARTE 4");
function filtraPalabras(array, cadena){
    let array2 = array.filter((palabra)=> (Array.from(palabra).every((letra)=>cadena.includes(letra))))
    console.log(array2);
}
filtraPalabras(["house", "car", "watch", "table"], "catboulerham")


/**
 * Parte 5
 * Crea una función que tome un array de luces representadas por los caracteres '🔴' y '🟢'.
 * La función debe comprobar si las luces están alternando (por ejemplo, ['🔴', '🟢', '🔴', '🟢', '🔴']).
 * Devuelve el número mínimo de luces que necesitan ser cambiadas para que las luces alternen.
 * Ejemplo: ajustaLuces(['🔴', '🔴', '🟢', '🔴', '🟢'])  -> 1 (cambia la primera luz a verde)
 */
console.log("EJERCICIO 1 - PARTE 5");

function ajustaLuces(cadena){
    let cadena2 = cadena.filter((luz,index)=>luz===cadena[index+1])
    console.log(cadena2.length)

}
ajustaLuces(['🔴', '🔴', '🟢', '🔴', '🟢'])
/**
 * Parte 5
 * Crea una colección Map donde la clave es el nombre de un plato y el valor es un array de ingredientes.
 * Realiza el código para crear otro Map donde la clave sea el nombre del ingrediente y el valor sea el array de
 * platos donde aparece ese ingrediente.
 */

console.log("EJERCICIO 1 - PARTE 6");

let miMapa = new Map()
miMapa.set("Pasta",["Tomate","Carne","Pasta"])
miMapa.set("Pizza",["Tomate","Peperoni","masa"])
miMapa.set("Empanadillas",["Tomate","Peperoni","Hojaldre"])

let miMapa2 = new Map()
let array
console.log(miMapa);
miMapa.forEach((ingredientes,comida)=>{
    console.log(comida+" "+ingredientes)
    for(let i in ingredientes){
        // console.log(ingredientes[i]);
        array = miMapa.has(ingredientes => ingredientes[i].includes(comida))
        miMapa2.set(ingredientes[i],array)
        array = 0
    }
});
console.log(miMapa2);

/**
 * Parte 7
 * Crea una función que pueda recibir tantos números como quieras por parámetro. Utiliza rest para agruparlos en
 * un array e imprimir los que son pares y los que son impares por separado.
 * NO uses bucles (for, while, etc.)
 */

console.log("EJERCICIO 1 - PARTE 7");


/**
 * Parte 8
 * Crea una función que reciba un array y sume los primeros tres números del array.
 * Utiliza desestructuración de arrays en los parámetros para obtener esos tres números.
 * Si alguno de esos números no está presente en el array, se asignará un valor predeterminado de 0.
 * Devuelve el resultado de sumar esos tres números.
 */

console.log("EJERCICIO 1 - PARTE 8");


/**
 * Crea una función que tome un número indeterminado de cadenas como argumentos,
 * las agrupa en un array y devuelve un nuevo array que contiene la longitud de cada cadena.
 * No uses bucles.
 * Ejemplo: stringLenghts("potato", "milk", "car", "table") -> [6, 4, 3, 5]
 */

console.log("EJERCICIO 1 - PARTE 9");


/**
 * Parte 10
 * Crea un array y, sin modificarlo, genera los siguientes arrays derivados (cada nuevo array deriva del anterior):
 * - Agrega 2 elementos al principio del array
 * - Elimina las posiciones 4 y 5
 * - Concatena los elementos de otro array al final Muestra el array resultante después de cada operación.
 * Ninguna operación realizada debe modificar el array sobre el que opera. Muestra el array original al final.
 */

console.log("EJERCICIO 1 - PARTE 10");
