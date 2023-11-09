{/* <tr>
    <td>nombre de la provincia<br>
        <aca va la provincia>
        </td>
        <td id="titulo">Elecciones 2020| Generales <br><br>
            <p class="2020"> 2020 >Generales >Provisorio >Senadores Nacionales >Buenos Aires </p>
        </td>
            <td class="datos-generales">
                <div class="column mesas">
                    <aca va mesas>
                        <p>Mesas Escrutadas</p>
                </div>
                <div class="column electores">
                    <aca va electores>
                        <p>Electores 62.71%</p>
                </div>
                <div class="column participacion">
                    <aca va participacion>
                        <p>Participacion sobre escrutado 62.71%</p>
                </div><br>
            </td>
            <td>
                <div class="agrupacion">
                    <p>Juntos</p>
                    <p>38%<br> 30000 votos</p>
                    <p>PJ</p>
                    <p>20%<br> 12000 votos</p>
                </div>
            </td>

        </tr> */}


document.addEventListener('DOMContentLoaded', function () {
    var jsonStr = localStorage.getItem('dataInforme');

    if (jsonStr) {
        try {
            var jsonArray = JSON.parse(jsonStr);

            
                console.log(jsonArray);
            
        } catch (error) {
            console.error("Error al analizar JSON:", error);
        }
    } else {
        console.log("El JSON en localStorage está vacío o no existe.");
    }

});
