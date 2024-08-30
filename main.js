var url;
var objJson;

const btnRequest = document.getElementById('btnRequest');
const btnExport = document.getElementById('btnExport');

const txtResponse = document.getElementById('result');

var optRegioes = document.getElementById('regiao');
var optEstados = document.getElementById('estado');
var optCidades = document.getElementById('cidade');
var optCargo = document.getElementById('cargo');

var chkCor = document.getElementById('chkCor');
var chkGenero = document.getElementById('chkGenero'); 
var chkQuilombola = document.getElementById('chkQuilombola'); 
var chkGrauInstrucao = document.getElementById('chkGrauInstrucao'); 
var chkBens = document.getElementById('chkBens'); 
var chkPartido = document.getElementById('chkPartido'); 

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
    txtResponse.value = '';
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

            url = " https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2024/" + codCidadeSelecionada + "/2045202024/" + tipoCargo + "/candidatos";
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
                                txtResponse.value += `${objJsonDadosCandidato.nomeUrna};${objJsonDadosCandidato.numero};`;
                               
                                if (chkPartido.checked) {
                                    txtResponse.value += `${objJsonDadosCandidato.partido.nome}; `;
                                }
                                if (chkCor.checked) {
                                    txtResponse.value += `${objJsonDadosCandidato.descricaoCorRaca}; `;
                                }
                                if (chkQuilombola.checked) {
                                    txtResponse.value += `Quilombola: ${objJsonDadosCandidato.infoComplementar.quilombola}; `;
                                }
                                if (chkGenero.checked) {
                                    txtResponse.value += `${objJsonDadosCandidato.descricaoSexo}; `;
                                }
                                if (chkGrauInstrucao.checked) {
                                    txtResponse.value += `${objJsonDadosCandidato.grauInstrucao}; `;
                                }
                                if (chkBens.checked) {
                                    txtResponse.value += `Total de bens: ${objJsonDadosCandidato.totalDeBens.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}; `;
                                }

                                txtResponse.value += `\n`;

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

btnExport.addEventListener('click', exportCsv);
function exportCsv(event) {
    let csvContent = txtResponse.value;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' });
    const objUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', objUrl);
    link.setAttribute('download', `Candidatos-${optCargo.options[optCargo.selectedIndex].value}.csv`);
    link.textContent = 'Click to Download';

    document.querySelector('body').append(link);

    /*
    let csvContent = txtResponse.value;
    console.log(txtResponse.value);
    window.open("data:text/csv;charset=utf-8," + encodeURIComponent(txtResponse.value));


    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
    const objUrl = URL.createObjectURL(blob)*/
}

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
