const tipoEleccion = 1;
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

function agregarInforme() {
    try {
        if (Object.keys(infoJSON).length !== 0) {

            var dataInforme = {
                año: datos.anioEleccion,
                tipo: 'PASO',
                recuento: 'Provisorio',
                cargo: datos.cargoTxt,
                distrito: datos.distritoTxt,
                seccion: datos.seccionTxt,
                distritoId: parseInt(datos.distritoId),
                informe: infoJSON
            };
        } else {
            console.error('infoJSON está vacío. No se guardará en localStorage.');

            mensajito = 'rojo';
            crearMensaje(mensajito, 'No se guardará el informe vacío');
        }

        var storageActual = localStorage.getItem('dataInforme');

        if (storageActual) {

            var existente = JSON.parse(storageActual);
            var existe = false;

            for (var i = 0; i < existente.length; i++) {
                if (JSON.stringify(existente[i]) === JSON.stringify(dataInforme)) {
                    existe = true;
                    break;
                }
            }

            if (!existe) {
                existente.push(dataInforme);

                // Guardar el objeto actualizado en el localStorage
                localStorage.setItem('dataInforme', JSON.stringify(existente));
                console.log('JSON agregado correctamente.');
                mensajito = 'verde-informe';
                crearMensaje(mensajito, 'Informe cargado correctamente');
            } else {

                mensajito = 'amarillo';
                crearMensaje(mensajito, 'El informe ya existe');
                console.log('El JSON ya existe, no se puede agregar.');
            }
        } else {
            localStorage.setItem('dataInforme', JSON.stringify([dataInforme]));
            console.log('Primer JSON guardado correctamente.');
            mensajito = 'verde-informe';
            crearMensaje(mensajito, 'Informe cargado correctamente');
        }
    } catch (error) {
        console.error('Se produjo un error:', error);
        mensajito = 'rojo';
        crearMensaje(mensajito, 'No se guardará el informe vacío');
    }
}
