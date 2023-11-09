const tipoEleccion = 1;
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

function filtrarDatos() {
    datos.seccionId = seccionSelect.value;
    let seccionSeleccionada = seccionSelect.options[seccionSelect.selectedIndex];
    datos.seccionTxt = seccionSeleccionada.textContent;

    console.log(datos);
    //limpiarAño();
    limpiarCargo();
    limpiarDistrito();
    limpiarSeccion();
    crearTitulo();

    const fetchUrl = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${datos.anioEleccion}&tipoRecuento=${datos.tipoRecuento}&tipoEleccion=${datos.tipoEleccion}&categoriaId=${datos.categoriaId}&distritoId=${datos.distritoId}&seccionProvincialId=${datos.seccionProvincialId}&seccionId=${datos.seccionId}&circuitoId=${datos.circuitoId}&mesaId=${datos.mesaId}`;
    console.log(fetchUrl)
    fetch(fetchUrl)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al obtener los datos');
            }
        })
        .then((data) => {
            console.log(data);
            infoJSON = data;
            rellenarDatos();
        })
        .catch((error) => {
            console.log(error);
        });

}
function crearTitulo() {

    const titulo = document.getElementById('titulo');

    titulo.innerHTML = `<div class="" id="titulo">
    <h2>Elecciones ${datos.anioEleccion} | PASO</h2>
    <p class="texto-path">${datos.anioEleccion} > PASO > Provisorio > ${datos.cargoTxt} > ${datos.distritoTxt} > ${datos.seccionTxt}</p>
</div>`

}

function rellenarDatos() {
    const mesa = document.getElementById("mesaEscrutada");
    const electores = document.getElementById("electores");
    const participacion = document.getElementById("participacion");
    const barras = document.getElementById("grid");
    const mapas = document.getElementById("mapaprovincia");
    const tituloProv = document.getElementById("nombreProvincia");
    const cuadros = document.getElementById("cuadro-partido");

    let textomesa = infoJSON.estadoRecuento.mesasTotalizadas;
    let textoelectores = infoJSON.estadoRecuento.cantidadElectores;
    let textoparticipacion = infoJSON.estadoRecuento.participacionPorcentaje
    let indice = 0;

    mesa.textContent = `Mesas Escrutadas ${textomesa}`;
    electores.textContent = `Electores ${textoelectores}`;
    participacion.textContent = `Participacion sobre escrutado ${textoparticipacion}%`;
    tituloProv.textContent = `${datos.distritoTxt}`;
    mapas.innerHTML = provincias[datos.distritoId];

    infoJSON.valoresTotalizadosPositivos.forEach(agrupacion => {
        cuadros.innerHTML += `<h2>${agrupacion.nombreAgrupacion}</h2>`;
        agrupacion.listas.forEach(lista => {
            const agrupaciones = `<div><p>${lista.nombre}</p>
                <p>${((lista.votos / agrupacion.votos) * 100).toFixed(2)}%<br>${lista.votos} votos</p>
                <div class="progress" style="background: ${colores[indice].colorClaro};">
                <div class="progress-bar" style="width:${((lista.votos / agrupacion.votos) * 100).toFixed(2)}%; background: ${colores[indice].color};"> <span
                class="progress-bar-text">${((lista.votos / agrupacion.votos) * 100).toFixed(2)}%</span> </div>
                </div></div>`;
            cuadros.innerHTML += agrupaciones;
        })


        const bar = `<div class="bar" style="--bar-value:${agrupacion.votosPorcentaje}%;" data-name="${agrupacion.nombreAgrupacion}" title="${agrupacion.nombreAgrupacion} ${agrupacion.votosPorcentaje}%"></div>`;
        barras.innerHTML += bar;
        indice++;
    })
}

function limpiarAño() {
    añoSelect = document.getElementById("año");
    añoSelect.innerHTML = `<option disabled selected>Año</option>`;
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

