 window.onload = function () { // Faz iniciar a tabela ao iniciar a pagina !!
     populateTable();
     
 }

 var a = [];
 var b = "'";
 
//  $(document).ready(function() {
//     $("#fileuploader").uploadFile({
//         url: '../api/photo?name='+window['a'].join(""),
//         fileName: "myfile"
//     })
// });

 function populateTable(tableContent, ver) {  // Tabela de todos os arquivos em upload
 
 
 $("#fileuploader").uploadFile({
        url: '../api/photo?name='+window['a'].join(""),
        fileName: "myfile"
    });

     document.getElementById("titulo").innerHTML = ' Inicio' + window['a'].join("");

     $.getJSON("/download" + window['a'].join(""), function (data) {
// console.log(window.a)
     
     
         if (data == "" && window.a != '' ) {
             // console.log("erro")
             tableContent += '<tr>';
             tableContent += '<td><h3>NADA</h3></td>';
             tableContent += '<td></td>';
             tableContent += '<td> <div class="btn-group"> <a onclick="back(' + window.b + data + window.b + ')" class="btn btn-info">Voltar Atrás</a><a href="../eliminar' + window.a + '" class="btn btn-danger">Apagar</a></ul></div></td>';
             tableContent += '</tr>';
         }
          
          else if (data == "" && window.a == '' ) {
             // console.log("erro")
             tableContent += '<tr>';
             tableContent += '<td><h3>NADA</h3></td>';
             tableContent += '<td></td>';
             tableContent += '<td> <div class="btn-group"> <a type="button" class="btn btn-success pull-right" style="margin:6px" data-toggle="modal" data-target="#criar"> Criar nova pasta </a></ul></div></td>';
             tableContent += '</tr>';
         }
          
         else {

             for (var item in data) {
                 var encodedUrl = escape(encodeURI(item));
                 var decoded = decodeURIComponent(escape(encodedUrl));
                 var str = data[decoded];
                 var res = (str.substring(str.lastIndexOf("."))).toLowerCase();
                 var pasta = (str.substring(str.lastIndexOf(".")));

                 tableContent += '<tr>';

                 // console.log(data[decoded])

                 if (data == "error") {
                     tableContent += '<td>ERRO</td>';
                     tableContent += '<td> <div class="btn-group"> <a href="../eliminar/' + window.a + '/' + data[decoded] + '" class="btn btn-danger">Apagar</a></ul></div></td>';
                     tableContent += '</tr>';
                 }
                 else {
                     tableContent += '<td>' + data[item] + '</td>';

                     if (res == '.mp3') {
                         tableContent += '<td>  <audio controls> <source src="/uploads/' + window.a + '/' + data[decoded] + '"> </audio> </td>';
                         tableContent += '<td>  <div class="btn-group"> <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">   Opções <span class="caret"></span>  </button>  <ul class="dropdown-menu">    <li><a href="../uploads/' + window.a + '/' + data[decoded] + '">Vizualizar</a></li>    <li><a href="../data/' + data[decoded] + '">Download</a></li>  <li><a type="button" onclick="link('+ window.b + window['a'].join("")  + window.b + ',' + window.b+data[decoded]+window.b+')" data-toggle="modal" data-target="#megashare">Share</a></li>   <li role="separator" class="divider"></li>    <li><a href="/ELIMINAR/' + data[decoded] + '">Eliminar</a></li>  </ul></div></td>';

                     }
                     else if (res == '.png' || res == '.jpg' || res == '.gif') {
                         tableContent += '<td> <img src="/uploads/' + window.a + '/' + data[decoded] + '" alt="HTML tutorial" style="width:42px;height:42px;"><br></td>';
                         tableContent += '<td> <div class="btn-group"> <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">   Opções <span class="caret"></span>  </button>  <ul class="dropdown-menu">    <li><a href="../uploads/' + window.a + '/' + data[decoded] + '">Vizualizar</a></li>    <li><a href="../data/' + data[decoded] + '">Download</a></li>   <li><a type="button" onclick="link('+ window.b + window['a'].join("")  + window.b + ',' + window.b+data[decoded]+window.b+')" data-toggle="modal" data-target="#megashare">Share</a></li>  <li role="separator" class="divider"></li>    <li><a href="/ELIMINAR/' + data[decoded] + '">Eliminar</a></li>  </ul></div></td>';

                     }
                     else if (res == '.mp4') {
                         tableContent += '<td><video width="320" height="240"> <source src="/uploads/' + window.a + '/' + data[decoded] + '" type="video/mp4"> Your browser does not support the video tag.</video></td>';
                         tableContent += '<td> <div class="btn-group"> <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">   Opções <span class="caret"></span>  </button>  <ul class="dropdown-menu">    <li><a href="../uploads/' + window.a + '/' + data[decoded] + '">Vizualizar</a></li>    <li><a href="../data/' + data[decoded] + '">Download</a></li>  <li><button type="button" "data-toggle="modal" data-target="#myModal">Share</a></li>   <li role="separator" class="divider"></li>    <li><a href="/ELIMINAR/' + data[decoded] + '">Eliminar</a></li>  </ul></div></td>';

                     }
                     else if (pasta == data[decoded]) {
                         //  window['a'] += '/' + data[decoded];

                         tableContent += '<td><img src="/imagens/pasta.png" alt="HTML tutorial" style="width:42px;height:42px;"></td>';
                         tableContent += '<td> <div class="btn-group"> <a  onclick="add(' + window.b + data[decoded] + window.b + ')" class="btn btn-info">Vizualizar</a></ul></div> <a  href="../zip?dest[dest]='+window['a'].join("")+'/&file[file]='+ data[decoded] +'" class="btn btn-info">Compactar</a> <div class="btn-group"> <a href="../eliminar/' + window.a + '/' + data[decoded] + '" class="btn btn-danger">Apagar</a></ul></div></td>';

                     }
                     else {
                         tableContent += '<td><img src="/imagens/noimage.png" alt="HTML tutorial" style="width:42px;height:42px;"></td>';
                         tableContent += '<td> <div class="btn-group"> <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">   Opções <span class="caret"></span>  </button>  <ul class="dropdown-menu">    <li><a href="../uploads/' + window.a + '/' + data[decoded] + '">Vizualizar</a></li>    <li><a href="../data/' + data[decoded] + '">Download</a></li> <li><a type="button" onclick="link('+window.b+data[decoded]+window.b+')" data-toggle="modal" data-target="#megashare">Share</a></li>   <li role="separator" class="divider"></li>    <li><a href="/ELIMINAR/' + data[decoded] + '">Eliminar</a></li>  </ul></div></td>';
                     }
                     tableContent += '</tr>';
                 }
             }
         }
         $('#ola').html(tableContent);
     });

     if (window.a != "") {
         document.getElementById("back").innerHTML = '<a onclick="back()" class="btn btn-info pull-right" style="margin:6px">Voltar Atras</a>';
     }
     else {
         document.getElementById("back").innerHTML = '';
     };
 }

 function add(d) { // Adiciona ao ur da tabela o novo edereço ...
     window['a'].push('/' + d);
     populateTable();
 };

 function back(a) { // Volta atraz na variavel e manda para url da tabela
     window['a'].pop();
     populateTable();
 };


 function criar() { // Cria novas pastas || alem disso da avisos de erro

     var valor = $("#ajaxform");
     if (valor.val() == '' || valor.val() == '.' || valor.val().indexOf("../") == 0 || valor.val().indexOf("./") == 0 || valor.val().indexOf("/") == 0 ) {
         document.getElementById("erro").innerHTML = '<div id="error2" class="alert alert-dismissible alert-danger"> <center><strong>Introduza algo valido !!</strong></center></div>';
     }
     else {
         $.post("../criar/pasta", {
                 pasta: '/' + window.a.join("") + '/' + valor.val().replace('/', '')
             },
             function (data, status) {
                 valor.val("");
                 populateTable();
                 $("#erro").empty();
             });
     }
 };