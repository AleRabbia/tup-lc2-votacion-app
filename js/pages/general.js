const tipoEleccion = 0;
const tipoRecuento = 1;
var añoSelect = document.getElementById("año");
var idCargo = document.getElementById("cargo");
var idDistritoOpt = document.getElementById("distrito");
var seccionSelect = document.getElementById("seccion");
let datosJSON;
const datos = {
    anioEleccion: 0,
    tipoRecuento: tipoRecuento,
    tipoEleccion: tipoEleccion,
    categoriaId: 2,
    distritoId: 0,
    seccionProvincialId: 0,
    seccionId: 0,
    circuitoId: '',
    mesaId: '',
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
    idCargo = document.getElementById("cargo");
    idDistritoOpt = document.getElementById("distrito");
    seccionSelect = document.getElementById("seccion");
    limpiarCargo(idCargo)
    limpiarDistrito(idDistritoOpt)
    limpiarSeccion(seccionSelect)
    datos.anioEleccion = añoSelect.value;
    console.log(datos.anioEleccion)


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
    idDistritoOpt = document.getElementById("distrito");
    seccionSelect = document.getElementById("seccion");
    limpiarDistrito(idDistritoOpt)
    limpiarSeccion(seccionSelect)
    idCargo = document.getElementById("cargo").value;
    console.log(idCargo)
    const distritos = datosJSON[tipoEleccion].Cargos[idCargo - 1].Distritos;

    console.log(distritos)
    distritos.forEach((distrito) => {
        const option = document.createElement("option");
        option.value = distrito.IdDistrito;
        option.text = distrito.Distrito;
        idDistritoOpt.appendChild(option);
    });
}

function cargarSeccion() {
    seccionSelect = document.getElementById("seccion");
    limpiarSeccion(seccionSelect)

    const secciones = datosJSON[tipoEleccion].Cargos[idCargo - 1].Distritos[idDistritoOpt.value].SeccionesProvinciales[0].Secciones;
    datos.distritoId = idDistritoOpt.value;
    console.log(secciones)

    secciones.forEach((distrito) => {
        const option = document.createElement("option");
        option.value = distrito.IdSeccion;
        option.text = distrito.Seccion;
        seccionSelect.appendChild(option);
    });


}

function filtrarDatos() {

    console.log(datos);

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
        })
        .catch((error) => {
            console.log(error);
        });
}



function limpiarCargo(element) {
    element.innerHTML = `<option disabled selected>Cargo</option>`;
}
function limpiarDistrito(element) {
    element.innerHTML = `<option disabled selected>Distrito</option>`;
}
function limpiarSeccion(element) {
    element.innerHTML = `<option disabled selected>Seccion</option>`;
}