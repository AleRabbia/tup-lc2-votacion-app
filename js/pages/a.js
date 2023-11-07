const tipoEleccion = 1;
const tipoRecuento = 1;
const añoSelect = document.getElementById("año");
const idCargo = document.getElementById("cargo");
const idDistrito = document.getElementById("distrito");
const seccionSelect = document.getElementById("seccion");
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
        const select = document.getElementById("año");

        data.forEach((year) => {
            const option = document.createElement("option");
            option.value = year;
            option.text = year;
            select.appendChild(option);
        });
        select.addEventListener("change", function () {
            const añoSeleccionado = select.value;
            datos.anioEleccion = select.value;
            if (añoSeleccionado !== "") {
                const apiUrl = "https://resultados.mininterior.gob.ar/api/menu?año=" + añoSeleccionado;

                fetch(apiUrl)
                    .then((response) => {
                        if (response.ok) {
                            return response.json();

                        } else {
                            throw new Error('Error al obtener los datos');
                        }
                    })
                    .then((data) => {
                        const cargoSelect = document.getElementById("cargo");
                        console.log(data);
                        while (cargoSelect.options.length > 1) {
                            cargoSelect.remove(1);
                        }

                        data[tipoEleccion].Cargos.forEach((cargo) => {
                            const option = document.createElement("option");
                            option.value = cargo.IdCargo;
                            option.text = cargo.Cargo;
                            cargoSelect.appendChild(option);
                        });
                        cargoSelect.addEventListener("change", function () {
                            const idCargo = cargoSelect.value;
                            const distritos = data[tipoEleccion].Cargos[idCargo - 1].Distritos;
                            console.log(idCargo)
                            const distritoSelect = document.getElementById("distrito");

                            while (distritoSelect.options.length > 1) {
                                cargoSelect.remove(1);
                            }

                            console.log(distritos)
                            distritos.forEach((distrito) => {
                                const option = document.createElement("option");
                                option.value = distrito.IdDistrito;
                                option.text = distrito.Distrito;
                                distritoSelect.appendChild(option);
                                datos.distritoId = distrito.IdDistrito;
                            });
                        });
                        const distritoSelect = document.getElementById("distrito");
                        distritoSelect.addEventListener("change", function () {
                            const IdDistrito = distritoSelect.value;
                            const idCargo = cargoSelect.value;
                            const secciones = data[tipoEleccion].Cargos[idCargo - 1].Distritos[IdDistrito].SeccionesProvinciales[0].Secciones;
                            datos.distritoId = distritoSelect.value;
                            console.log(secciones)
                            const seccionSelect = document.getElementById("seccion");
                            while (seccionSelect.options.length > 1) {
                                cargoSelect.remove(1);
                            }
                            secciones.forEach((distrito) => {
                                const option = document.createElement("option");
                                option.value = distrito.IdSeccion;
                                option.text = distrito.Seccion;
                                seccionSelect.appendChild(option);

                            });
                        });
                        
                        const seccionSelect = document.getElementById("seccion");
                        seccionSelect.addEventListener("change", function () {
                            const idSeccion = seccionSelect.value
                            datos.seccionId = idSeccion;
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    })
    .catch((error) => {
        console.log(error);
    });

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
