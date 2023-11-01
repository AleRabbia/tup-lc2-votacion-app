const tipoEleccion = 0;
const tipoRecuento = 1;
const añoSelect = document.getElementById("año");

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

            if (añoSeleccionado !== "") {
                const apiUrl = "https://resultados.mininterior.gob.ar/api/menu?año=" + añoSeleccionado;

                fetch(apiUrl)
                    .then((response) => {
                        console.log(response);
                        if (response.ok) {
                            return response.json();

                        } else {
                            throw new Error('Error al obtener los datos');
                        }
                    })
                    .then((data) => {
                        const select = document.getElementById("cargo");
                        console.log(data);
                        select.innerHTML = "";

                        data[tipoEleccion].Cargos.forEach((cargo) => {
                            const option = document.createElement("option");
                            option.value = cargo.IdCargo;
                            option.text = cargo.Cargo;
                            select.appendChild(option);
                        });
                        const cargoSelect = document.getElementById("cargo");

                        cargoSelect.addEventListener("change", function () {
                            const idCargo = cargoSelect.value;

                            const distritos = data[tipoEleccion].Cargos[idCargo].Distritos;

                            const distritoSelect = document.getElementById("distrito");
                            distritoSelect.innerHTML = "";

                            distritos.forEach((distrito) => {
                                const option = document.createElement("option");
                                option.value = distrito.IdDistrito;
                                option.text = distrito.Distrito;
                                distritoSelect.appendChild(option);
                            });
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