const btnRequest = document.getElementsByClassName('send_request');
const txtResponse = document.getElementById("result");
var url;

onclick = function (evento) {
    let objJsonCandidatos;
    let objJsonDadosCandidato;
    url = "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2024/49590/2045202024/13/candidatos";

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.responseType = "json";

    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            objJsonCandidatos = xhr.response;
            console.log(objJsonCandidatos.candidatos);
            console.log(objJsonCandidatos.candidatos.length);

            for (var i = 0; i < objJsonCandidatos.candidatos.length; i++) {
                url = "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/2024/49590/2045202024/candidato/" + objJsonCandidatos.candidatos[i].id;
               
                const xhrCandidato = new XMLHttpRequest();
                xhrCandidato.open("GET", url);
                xhrCandidato.send();
                xhrCandidato.responseType = "json";

                xhrCandidato.onload = () => {
                    if (xhrCandidato.readyState == 4 && xhrCandidato.status == 200) {
                        objJsonDadosCandidato = xhrCandidato.response;
                        console.log(objJsonDadosCandidato.nomeUrna + '-> '+objJsonDadosCandidato.numero + ' cor/raça: '+objJsonDadosCandidato.descricaoCorRaca);

                    } else {
                        console.log(`Erro na busca de dados de candidatos: ${xhrCandidato.status}`);
                    }
                };

            }

        } else {
            console.log(`Erro na busca de candidatos: ${xhr.status}`);
        }
    };
}

function getResponseHttpAsync(url) {  
}
