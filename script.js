const INDICADORPOP = "SP.POP.TOTL";

const PAISES = [
 { code: "ARG", name: "Argentina" },
 { code: "BRA", name: "Brasil" },
 { code: "MEX", name: "México" },
 { code: "USA", name: "Estados Unidos" },
 { code: "CHN", name: "China" },
 { code: "IND", name: "India" },
 { code: "FRA", name: "Francia" },
 { code: "DEU", name: "Alemania" }
];

// genera un indice aleatorio
function azar(max) {
 return Math.floor(Math.random() * max);
}

// formatea poblacion a "X millones de habitntes"
function textoMillones(valor) {
 const m = Math.round(valor / 1_000_000);
 return m + " millones de habitantes";
}

// obtiene dos indices de paises diferentes
function obtenerIndicesDiferentes() {
 const i1 = azar(PAISES.length);
 let i2;
 do {
 i2 = azar(PAISES.length);
 } while (i2 === i1);
 return [i1, i2];
}

//consultar a la api

function obtenerPoblacion(codigo, callback) {
 const url ="https://api.worldbank.org/v2/country/" + codigo + "/indicator/" + INDICADORPOP + "?format=json&per_page=5";

 fetch(url)
 .then(datapop => datapop.json()) 
 .then(datapop => { 
 if (!datapop[1]) return callback(null, null);
 const fila = datapop[1].find(f => f.value !== null);
 if (!fila) return callback(null, null);
 callback(fila.value, fila.date);
 })
 .catch(() => callback(null, null));
}

// juego 1 

let j1Correcto = -1;
let j1Paises = [];

function juego1Nueva() {
 const res = document.getElementById("pop-resultado");
 res.textContent = "Cargando...";

 const [i1, i2] = obtenerIndicesDiferentes();
 const p1 = PAISES[i1];
 const p2 = PAISES[i2];
 j1Paises = [p1, p2];

 obtenerPoblacion(p1.code, (pop1, year1) => {
 if (!pop1) return (res.textContent = "Error al obtener datos.");
 obtenerPoblacion(p2.code, (pop2, year2) => {
 if (!pop2) return (res.textContent = "Error al obtener datos.");

 document.getElementById("pop-opcion1").textContent = p1.name;
 document.getElementById("pop-opcion2").textContent = p2.name;
 
 j1Correcto = pop1 >= pop2 ? 0 : 1;
 res.textContent = "Elegi un pais";
 });
 });
}

function juego1Respuesta(indice) {
 const res = document.getElementById("pop-resultado");
 if (j1Correcto === -1) return (res.textContent = "Primero generá una pregunta.");
 
 if (indice === j1Correcto) {
 res.textContent = "¡Correcto!";
 } else {
 res.textContent =
 "Incorrecto. El pais con más poblacion es " + j1Paises[j1Correcto].name + ".";
 }
}

// juego 2 

let j2Correcto = -1;
let j2ValorReal = 0;

function juego2Nueva() {
 const res = document.getElementById("aprox-resultado");
 res.textContent = "Cargando...";

 const pais = PAISES[azar(PAISES.length)];

 obtenerPoblacion(pais.code, (valor, year) => {
 if (!valor) return (res.textContent = "Error al obtener datos.");

 j2ValorReal = valor;
 document.getElementById("aprox-pais").textContent = pais.name;
 document.getElementById("aprox-anio").textContent = "Poblacion aproximada año " + year;

const base = Math.round(valor / 1_000_000);
const opciones = [
 base,
 base - (5 + azar(6)), 
 base + (5 + azar(6))
];

 const textos = opciones.map(
 n => "Alrededor de " + n + " millones de habitantes"
 );
 textos.sort(() => Math.random() - 0.5);

 const textoBaseCorrecto = base;
 //j2correcto= -1;
 textos.forEach((t, i) => {
 document.getElementById("aprox-opc" + (i + 1)).textContent = t;
 if (t.includes(textoBaseCorrecto)) j2Correcto = i;
 });

 res.textContent = "Elegi la opción que creas correcta.";
 });
}

function juego2Respuesta(indice) {
 const res = document.getElementById("aprox-resultado");
 if (j2Correcto === -1) return (res.textContent = "Primero genera una pregunta.");
 
 const textoReal = textoMillones(j2ValorReal);
 
 if (indice === j2Correcto) {
 res.textContent = "¡Correcto! La población real es aproximadamente " + textoReal + ".";
 } else {
 res.textContent = "No es la mejor aproximacion. La poblacion real es aproximadamente " + textoReal + ".";
 }
}

// juego 3 

let j3EsVerdadero = null;

function juego3Nueva() {

  const res = document.getElementById("vf-resultado");
  res.textContent = "Cargando...";

  const [i1, i2] = obtenerIndicesDiferentes();
  const p1 = PAISES[i1];
  const p2 = PAISES[i2];


  obtenerPoblacion(p1.code, (pop1, year1) => {
    if (!pop1) return (res.textContent = "Error al obtener datos.");

  
    obtenerPoblacion(p2.code, (pop2, year2) => {
      if (!pop2) return (res.textContent = "Error al obtener datos.");

  
      document.getElementById("vf-frase").textContent =
        "La población de " + p1.name + " es mayor que la de " + p2.name + ".";
      
      const anio = 2024
      document.getElementById("vf-anio").textContent = "Datos aproximados año " + anio;


      j3EsVerdadero = pop1 > pop2;
      res.textContent = "Elegí Verdadero o Falso.";
    });
  });
}

function juego3Respuesta(usuarioDiceVerdadero) {

  const res = document.getElementById("vf-resultado");
  if (j3EsVerdadero === null) return (res.textContent = "Primero generá una frase.");
  
 
  if (usuarioDiceVerdadero === j3EsVerdadero) {
    res.textContent = "¡Correcto!";
  } else {
    res.textContent = "Incorrecto según los datos del Banco Mundial.";
  }
}