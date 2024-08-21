const btnRequest = document.getElementsByClassName('send_request');
const txtResponse = document.getElementById("result");

onclick = function (evento) {

    var url = "http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2020/35157/2030402020/11/candidatos";//Sua URL

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    
    xhttp.onreadystatechange = function(){//Função a ser chamada quando a requisição retornar do servidor
        if ( xhttp.readyState == 4 && xhttp.status == 200 ) {//Verifica se o retorno do servidor deu certo
            console.log(':)');
        }else{
            console.log(':(');            
        }
       
         txtResponse.value = JSON.parse(xhttp.responseText);
         console.log(JSON.parse(xhttp.responseText));
        
        //console.log(xhttp.responseText);
    }
    
    xhttp.send();//A execução do script CONTINUARÁ mesmo que a requisição não tenha retornado do servidor
}
