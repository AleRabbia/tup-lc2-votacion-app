const tipoEleccion = 2;
const tipoRecuento = 1;
var añoSelect = document.getElementById("año");
var idCargo = document.getElementById("cargo");
var idDistritoOpt = document.getElementById("distrito");
var seccionSelect = document.getElementById("seccion");
let datosJSON;
let infoJSON;
let idCargos;
const datos = {
    anioEleccion: 0,
    tipoRecuento: tipoRecuento,
    tipoEleccion: tipoEleccion,
    categoriaId: 2,
    distritoId: 0,
    seccionProvincialId: '',
    seccionId: 0,
    circuitoId: '',
    mesaId: '',
    cargoTxt: '',
    distritoTxt: '',
    seccionTxt: ''
};


document.addEventListener("DOMContentLoaded", function () {
    cargarFetch();
});

function cargarFetch() {
    fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al obtener los datos');
            }
        })
        .then((data) => {
            añoSelect = document.getElementById("año");

            data.forEach((year) => {
                const option = document.createElement("option");
                option.value = year;
                option.text = year;
                añoSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

function cargaDatos() {
    limpiarCargo();
    limpiarDistrito();
    limpiarSeccion();

    datos.anioEleccion = añoSelect.value;
    if (datos.anioEleccion !== "") {
        const apiUrl = "https://resultados.mininterior.gob.ar/api/menu?año=" + datos.anioEleccion;

        fetch(apiUrl)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al obtener los datos');
                }
            })
            .then((data) => {
                datosJSON = data;
                console.log(datosJSON)


                datosJSON.forEach(eleccion => {
                    if (eleccion.IdEleccion == tipoEleccion) {
                        eleccion.Cargos.forEach((cargo) => {
                            const option = document.createElement("option");
                            option.value = cargo.IdCargo;
                            option.text = cargo.Cargo;
                            idCargo.appendChild(option);
                        });
                    }
                })

            })
            .catch((error) => {
                console.log(error);
            });
    }
}

function cargarDistrito() {
    limpiarDistrito();
    limpiarSeccion();
    idCargos = idCargo.value;

    let cargoSeleccionado = idCargo.options[idCargo.selectedIndex];
    datos.cargoTxt = cargoSeleccionado.textContent;


    datosJSON.forEach(eleccion => {
        if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach((cargo) => {
                if (cargo.IdCargo == idCargos) {
                    cargo.Distritos.forEach((distrito) => {
                        const option = document.createElement("option");
                        option.value = distrito.IdDistrito;
                        option.text = distrito.Distrito;
                        idDistritoOpt.appendChild(option);
                    });
                }
            });
        }
    })

}

function cargarSeccion() {
    limpiarSeccion()
    datos.distritoId = document.getElementById("distrito").value;

    let distritoSeleccionado = idDistritoOpt.options[idDistritoOpt.selectedIndex];
    datos.distritoTxt = distritoSeleccionado.textContent;

    datosJSON.forEach(eleccion => {
        if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach((cargo) => {
                if (cargo.IdCargo == idCargos) {
                    cargo.Distritos.forEach((distrito) => {
                        if (distrito.IdDistrito == datos.distritoId) {
                            distrito.SeccionesProvinciales.forEach((seccionesProvinciales) => {
                                seccionesProvinciales.Secciones.forEach((distrito) => {
                                    const option = document.createElement("option");
                                    option.value = distrito.IdSeccion;
                                    option.text = distrito.Seccion;
                                    seccionSelect.appendChild(option);
                                });
                            })
                        }
                    });
                }
            });
        }
    })
}

function mostrarLoader() {
    // Muestra el GIF de carga
    const loader = document.getElementById("loader");
    loader.style.display = "block";
}

function ocultarLoader() {
    // Oculta el GIF de carga
    const loader = document.getElementById("loader");
    loader.style.display = "none";
}


function filtrarDatos() {

    seccionSelect = document.getElementById("seccion");
    mostrarLoader();
    let mensajito;
    console.log('Comienza la carga de datos... rueda gira')
    if (
        añoSelect.value == "0" ||
        idCargo.value == "Cargo" ||
        idDistritoOpt.value == "Distrito" ||
        seccionSelect.value == "Seccion"
    ) {

        ocultarLoader();
        mensajito = 'rojo';
        console.log("Mensaje rojo activado: Campos de los selects vacíos detectados.");
        crearMensaje(mensajito, "Seleccione todas las opciones antes de filtrar los datos.");
        return; // Detener la ejecución si hay campos vacíos
    }
    datos.seccionId = seccionSelect.value;
    let seccionSeleccionada = seccionSelect.options[seccionSelect.selectedIndex];
    datos.seccionTxt = seccionSeleccionada.textContent;
    

    console.log(añoSelect.value)
    // Validación de combos 
    

    console.log("Continuando con la ejecución...");

    console.log(datos, añoSelect.value, idCargo.value, idDistritoOpt.value, seccionSelect.value);
    limpiarAño();
    limpiarCargo();
    limpiarDistrito();
    limpiarSeccion();
    crearTitulo();

    const fetchUrl = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${datos.anioEleccion}&tipoRecuento=${datos.tipoRecuento}&tipoEleccion=${datos.tipoEleccion}&categoriaId=${datos.categoriaId}&distritoId=${datos.distritoId}&seccionProvincialId=${datos.seccionProvincialId}&seccionId=${datos.seccionId}&circuitoId=${datos.circuitoId}&mesaId=${datos.mesaId}`;
    console.log(fetchUrl);

    fetch(fetchUrl)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al obtener los datos');
            }
        })
        .then((data) => {
            infoJSON = data;
            console.log(infoJSON);
            ocultarLoader();
            console.log('Datos cargados exitosamente.. se detiene la ruedita');
            rellenarDatos();
            mensajito = 'verde-informe';
            crearMensaje(mensajito, 'Datos cargados correctamente');
        })
        .catch((error) => {
            ocultarLoader();
            console.log(error);
            mensajito = 'amarillo';
            crearMensaje(mensajito, 'La operacion no se pudo completar');
        });
}


function crearTitulo() {

    const titulo = document.getElementById('titulo');

    titulo.innerHTML = `<div class="" id="titulo">
    <h2>Elecciones ${datos.anioEleccion} | Generales</h2>
    <p class="texto-path">${datos.anioEleccion} > Generales > Provisorio > ${datos.cargoTxt} > ${datos.distritoTxt} > ${datos.seccionTxt}</p>
</div>`

}

function crearMensaje(mensajito, texto) {

    const colorMensaje = document.getElementById('color-mensaje');
    const valorMensaje = document.getElementById('valor-mensaje');

    if (mensajito == 'verde') {
        colorMensaje.setAttribute('class', 'exito');
        valorMensaje.setAttribute('class', 'fas fa-thumbs-up');
        valorMensaje.innerText = texto; //'Datos cargados correctamente'
        setTimeout(function () {
            colorMensaje.setAttribute('class', 'hidden');
        }, 4000)
    }

    if (mensajito == 'verde-informe') {
        colorMensaje.setAttribute('class', 'exito');
        valorMensaje.setAttribute('class', 'fas fa-thumbs-up');
        valorMensaje.innerText = texto; //'Se agrego con éxito el resultado del informe'
        setTimeout(function () {
            colorMensaje.setAttribute('class', 'hidden');
        }, 4000)
    }

    if (mensajito == 'rojo') {
        colorMensaje.setAttribute('class', 'error');
        valorMensaje.setAttribute('class', 'fas fa-exclamation-triangle');
        valorMensaje.innerText = texto;//'Error: Se produjo un error al intentar agregar resultado al informe';
        setTimeout(function () {
            colorMensaje.setAttribute('class', 'hidden');
        }, 4000)
    }

    if (mensajito == 'amarillo') {
        colorMensaje.setAttribute('class', 'exclamacion');
        valorMensaje.setAttribute('class', 'fas fa-exclamation');
        valorMensaje.innerText = texto; //'La operacion no se pudo completar'
        setTimeout(function () {
            colorMensaje.setAttribute('class', 'hidden');
        }, 4000)
    }
}


function rellenarDatos() {
    const mesa = document.getElementById("mesaEscrutada");
    const electores = document.getElementById("electores");
    const participacion = document.getElementById("participacion");
    const barras = document.getElementById("grid");
    const mapas = document.getElementById("mapaprovincia");
    const tituloProv = document.getElementById("nombreProvincia");

    let textomesa = infoJSON.estadoRecuento.mesasTotalizadas;
    let textoelectores = infoJSON.estadoRecuento.cantidadElectores;
    let textoparticipacion = infoJSON.estadoRecuento.participacionPorcentaje;
    let indice = 0;

    mesa.textContent = `Mesas Escrutadas ${textomesa}`;
    electores.textContent = `Electores ${textoelectores}`;
    participacion.textContent = `Participacion sobre escrutado ${textoparticipacion}%`;
    tituloProv.textContent = `${datos.distritoTxt}`;
    mapas.innerHTML = provincias[datos.distritoId];

    infoJSON.valoresTotalizadosPositivos.forEach(agrupacion => {
        const cuadros = document.getElementById("cuadro-partido");
        const agrupaciones = `<div><p>${agrupacion.nombreAgrupacion}</p>
                <p>${agrupacion.votosPorcentaje}%<br>${agrupacion.votos} votos</p>
                <div class="progress" style="background: ${colores[indice].colorClaro};">
                <div class="progress-bar" style="width:${agrupacion.votosPorcentaje}%; background: ${colores[indice].color};"> <span
                class="progress-bar-text">${agrupacion.votosPorcentaje}%</span> </div>
                </div></div>`;
        cuadros.innerHTML += agrupaciones;
        const bar = `<div class="bar" style="--bar-value:${agrupacion.votosPorcentaje}%;" data-name="${agrupacion.nombreAgrupacion}" title="${agrupacion.nombreAgrupacion} ${agrupacion.votosPorcentaje}%"></div>`;
        barras.innerHTML += bar;
        indice++;
    })
}

function agregarInforme() {

    if (Object.keys(infoJSON).length !== 0) {

        var dataInforme = {
            año: datos.anioEleccion,
            tipo: 'Generales',
            recuento: 'Provisorio',
            cargo: datos.cargoTxt,
            distrito: datos.distritoTxt,
            seccion: datos.seccionTxt,
            informe: infoJSON
        };

        var dataStorage = JSON.stringify(dataInforme);
    } else {
        console.error('infoJSON está vacío. No se guardará en localStorage.');
    }

    var storageActual = localStorage.getItem('dataInforme');


    if (storageActual != "") {
        try {
            if (storageActual == dataStorage) {
                console.log('same data')
            } else {

            }
            var storageJSON = JSON.parse(storageActual);
        } catch (error) {

        }
    } else {

        localStorage.setItem('dataInforme', dataStorage);
    }

}

function limpiarAño() {
    añoSelect = document.getElementById("año");
    añoSelect.innerHTML = `<option disabled selected>Año</option>`;
    cargarFetch();
}
function limpiarCargo() {
    idCargo = document.getElementById("cargo");
    idCargo.innerHTML = `<option disabled selected>Cargo</option>`;
}
function limpiarDistrito() {
    idDistritoOpt = document.getElementById("distrito");
    idDistritoOpt.innerHTML = `<option disabled selected>Distrito</option>`;
}
function limpiarSeccion() {
    seccionSelect = document.getElementById("seccion");
    seccionSelect.innerHTML = `<option disabled selected>Seccion</option>`;
}

