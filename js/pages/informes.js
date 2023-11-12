{/*  */ }

var localJson;


document.addEventListener('DOMContentLoaded', function () {



    var storageActual = localStorage.getItem('dataInforme');
    let mensajito;
    console.log(storageActual);

    if (!storageActual) {

        mensajito = 'amarillo';
        crearMensaje(mensajito, 'No hay informes guardados para mostrar');

    }
    else {

        localJson = JSON.parse(storageActual);
        console.log(localJson);
        cargarHtml();

    }


});


function cargarHtml() {

    var cont = 0;
    var cuadroInforme = document.getElementById('cuadroInformes');
    localJson.forEach(element => {
        cuadroInforme.innerHTML += `<tr>
        <td>${element.distrito}<br>
            ${provincias[element.distritoId]}
            </td>
            <td id="titulo">Elecciones ${element.año}| ${element.tipo} <br><br>
                <p class="2020"> ${element.año} >${element.tipo} >Provisorio >${element.cargo}} >${element.seccion} </p>
            </td>
                <td class="datos-generales">
                
                <div class="datos-div">
                    <div class="column mesas">
                        ${logos.mesas}
                            <p>Mesas Escrutadas ${element.informe.estadoRecuento.mesasTotalizadas}</p> 
                    </div>
                    <div class="column electores">
                        ${logos.electores}
                            <p>Electores ${element.informe.estadoRecuento.cantidadElectores}</p>
                    </div>
                    <div class="column participacion">
                        ${logos.participacion}
                            <p>Participacion sobre escrutado ${element.informe.estadoRecuento.participacionPorcentaje}%</p>
                    </div><br>
                    </div>
                </td>
                
                <td id="datos-agrupacion-${cont}">
                
                </td>

            </tr>`
        element.informe.valoresTotalizadosPositivos.forEach(agrupacion => {

            var datosAgrupacion = document.getElementById(`datos-agrupacion-${cont}`);
            datosAgrupacion.innerHTML += `<p>${agrupacion.nombreAgrupacion}</p>
            <p>${agrupacion.votosPorcentaje}%<br> ${agrupacion.votos} votos</p>
            <hr>    `

        })
        cont += 1;
    });



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

    if (mensajito == 'amarillo') {
        colorMensaje.setAttribute('class', 'exclamacion');
        valorMensaje.setAttribute('class', 'fas fa-exclamation');
        valorMensaje.innerText = texto; //'No hay informes guardados para mostrar'
        setTimeout(function () {
            colorMensaje.setAttribute('class', 'hidden');
        }, 4000)
    }
}

