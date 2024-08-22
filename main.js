var url;
var objJson;

const btnRequest = document.getElementById('btnRequest');
const txtResponse = document.getElementById('result');

var optRegioes = document.getElementById('regiao');
var optEstados = document.getElementById('estado');
var optCidades = document.getElementById('cidade');
var optCargo = document.getElementById('cargo');

var chkCor = document.getElementById('chkCor');
optRegioes.addEventListener('change', changeOptRegioes);
function changeOptRegioes(event) {
    console.log(event);
    optCidades.innerText = null;
    optEstados.innerText = null;

    if (optRegioes.options[optRegioes.selectedIndex].value == 'NACIONAL') {
        optEstados.add(new Option('-'));
        optCidades.add(new Option('-'));
    } else {
        url = "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/eleicao/eleicao-atual?idEleicao=2045202024";
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        xhr.responseType = "json";

        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                objJson = xhr.response;
                console.log(objJson.ues);
                console.log(objJson.ues.length);

                for (var i = 0; i < objJson.ues.length; i++) {
                    if (objJson.ues[i].regiao == optRegioes.options[optRegioes.selectedIndex].value) {
                        optEstados.add(new Option(objJson.ues[i].sigla));
                    }
                }
            } else {
                console.log(`Erro na busca dados da API: ${xhr.status}`);
            }
        };
    }
}

optEstados.addEventListener('change', changeOptEstados);
function changeOptEstados(event) {
    var objJsonEstate;
    console.log(event);
    optCidades.innerText = null;
    const uf = optEstados.options[optEstados.selectedIndex].value;

    url = "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/eleicao/buscar/" + uf + "/2045202024/municipios";

    console.log(url);
    const xhrEstate = new XMLHttpRequest();
    xhrEstate.open("GET", url);
    xhrEstate.send();
    xhrEstate.responseType = "json";

    xhrEstate.onload = () => {
        if (xhrEstate.readyState == 4 && xhrEstate.status == 200) {
            objJsonEstate = xhrEstate.response;
            console.log(objJsonEstate.municipios);
            console.log(objJsonEstate.municipios.length);

            for (var i = 0; i < objJsonEstate.municipios.length; i++) {
                optCidades.add(new Option(objJsonEstate.municipios[i].nome));
                codCidadeSelecionada = objJsonEstate.municipios[i].codigo
            }
        } else {
            console.log(`Erro na busca dados da API: ${xhrEstate.status}`);
        }
    };
}

btnRequest.addEventListener('click', getCandidates);
function getCandidates(event) {
    var objJsonCity;
    var objJsonCandidatos;
    var objJsonDadosCandidato;
    var codCidadeSelecionada;
    console.log(event);
    const uf = optEstados.options[optEstados.selectedIndex].value;
    const cidadeAtual = optCidades.options[optCidades.selectedIndex].value;
    const tipoCargo = optCargo.options[optCargo.selectedIndex].value == 'PREFEITO' ? '11' : '13';

    url = "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/eleicao/buscar/" + uf + "/2045202024/municipios";

    console.log(url);
    const xhrCity = new XMLHttpRequest();
    xhrCity.open("GET", url);
    xhrCity.send();
    xhrCity.responseType = "json";

    xhrCity.onload = () => {
        if (xhrCity.readyState == 4 && xhrCity.status == 200) {
            objJsonCity = xhrCity.response;
            console.log(objJsonCity.municipios);
            console.log(objJsonCity.municipios.length);

            for (var i = 0; i < objJsonCity.municipios.length; i++) {
                if (objJsonCity.municipios[i].nome == cidadeAtual) {
                    codCidadeSelecionada = objJsonCity.municipios[i].codigo;
                    console.log("Codigo cidade atual: " + codCidadeSelecionada);
                }
            }

            url = " https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2024/" + codCidadeSelecionada + "/2045202024/"+tipoCargo+"/candidatos";
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.send();
            xhr.responseType = "json";
            console.log(url);

            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    objJsonCandidatos = xhr.response;
                    console.log(objJsonCandidatos.candidatos);
                    console.log(objJsonCandidatos.candidatos.length);

                    for (var i = 0; i < objJsonCandidatos.candidatos.length; i++) {
                        url = "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/2024/" + codCidadeSelecionada + "/2045202024/candidato/" + objJsonCandidatos.candidatos[i].id;
                        console.log(url);
                        const xhrCandidato = new XMLHttpRequest();
                        xhrCandidato.open("GET", url);
                        xhrCandidato.send();
                        xhrCandidato.responseType = "json";

                        xhrCandidato.onload = () => {
                            if (xhrCandidato.readyState == 4 && xhrCandidato.status == 200) {
                                objJsonDadosCandidato = xhrCandidato.response;
                                txtResponse.value += `${objJsonDadosCandidato.nomeUrna}: ${objJsonDadosCandidato.numero} cor/raça: ${objJsonDadosCandidato.descricaoCorRaca} \n`;
                            } else {
                                console.log(`Erro na busca de dados de candidatos: ${xhrCandidato.status}`);
                            }
                        };
                    }

                } else {
                    console.log(`Erro na busca de candidatos: ${xhr.status}`);
                }
            };
        };
    }
}


/*
onclick = function (event) {
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
                        console.log(objJsonDadosCandidato.nomeUrna + '-> ' + objJsonDadosCandidato.numero + ' cor/raça: ' + objJsonDadosCandidato.descricaoCorRaca);

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
*/



/*
onclick = function (evento) {
    let objJsonCandidatos;
    let objJsonDadosCandidato;
    url = "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2024/49590/2045202024/13/candidatos";

    objJsonCandidatos =  getResponseHttpAsync(url);
    console.log('teste');
    console.log(objJson);

    for (var i = 0; i < objJsonCandidatos.length; i++) {
        url = "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/2024/49590/2045202024/candidato/" + objJsonCandidatos[i].id;
        objJsonDadosCandidato = getResponseHttpAsync(url);
        console.log(objJsonDadosCandidato.nomeUrna + '-> ' + objJsonDadosCandidato.numero + ' cor/raça: ' + objJsonDadosCandidato.descricaoCorRaca);
    };
}

async function getResponseHttpAsync(url) {
    var  objJson;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.responseType = "json";

    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            objJson = xhr.response;
            console.log(objJson);
            return objJson;
        } else {
            console.log(`Erro na busca dados da API: ${xhr.status}`);
        }
    };
}*/
