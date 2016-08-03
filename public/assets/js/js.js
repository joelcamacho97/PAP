 window.onload = function () { // Faz iniciar a tabela ao iniciar a pagina !!
                    usuario();
                    // tabela_usuario();
                };

                function user() {
                    var usuario = '<%=user.local.usuario %>';
                    var nome = '<%=user.local.nome %>';
                    var emaill = '<%=user.local.email %>';
                    document.getElementById("alterar").innerHTML = '';
                    document.getElementById("usuario_in").innerHTML = '<input type="text" name="usuario" class="form-control" value="'+usuario+'">';
                    document.getElementById("nome_in").innerHTML = '<input type="text" name="nome" class="form-control" value="'+nome+'">';
                    document.getElementById("email_in").innerHTML = '<input type="email" class="form-control" name="email" value="'+emaill+'">';
                    document.getElementById("salvar_in").innerHTML = '<button type="submit" class="btn btn-success">Salvar</button>';
                    document.getElementById("cancelar").innerHTML = '<button type="button" class="btn btn-danger"  onclick="cancelar()">cancelar</button>';
                }

                function cancelar() {
                    document.getElementById("usuario_in").innerHTML = '<%=user.local.usuario %>';
                    document.getElementById("nome_in").innerHTML = '<%=user.local.nome %>';
                    document.getElementById("email_in").innerHTML = '<%=user.local.email %>';
                    document.getElementById("salvar_in").innerHTML = '';
                    document.getElementById("cancelar").innerHTML = '';
                    document.getElementById("alterar").innerHTML = '<button type="button" class="btn btn-warning" onclick="user()">Alterar</button>';
                }

                function usuario() { // Tabela de todos os arquivos em upload
                    var tabela = '';
                    var b = "'";
                    $.getJSON("../db", function (result) {
                        $.each(result, function (i, field) {
                            tabela += '<tr>';
                            tabela += '<td>' + field._id + '</td>';
                            tabela += '<td>' + field.local.nome + '</td>';
                            tabela += '<td>' + field.local.usuario + '</td>';
                            tabela += '<td>' + field.local.email + '</td>';
                            tabela += '<td>' + field.local.su + '</td>';
                            tabela += '<td>' + field.local.estado + '</td>';
                            tabela += '<td>' + field.local.size + ' MB</td>';
                            tabela += '<td>' + field.local.date.toString().replace(/T/, ' ').replace(/\..+/, '') + '</td>';
                            tabela += '<td> <a onclick="vizualizar(' + b + field._id + b + ',' + b + field.local.nome + b + ',' + b + field.local.usuario + b + ',' + b + field.local.email + b + (',') + b + field.local.date + b + (',') + b + field.local.size + b + (',') + b + field.local.estado + b + (',') + b + field.local.su + b + ')" class="btn btn-default"  data-toggle="modal" data-target="#vizualizar">Vizualizar</a> </td>'
                            tabela += '</tr>';
                            $('#user').html(tabela);
                        });
                        tabela_usuario();
                    });
                }
                
                function tabela_usuario() {
                    $(document).ready(function () {
                        $('#minhaTabela').dataTable();
                    });
                }

                var named = '';
                var user_mod = '';
                var emaill = '';
                var idss = '';
                var data = '';
                var tamanho = '';
                var state = '';
                var type = '';

                function vizualizar(id, nome, usuario, email, date, size, estado, tipo) {
                    window.idss = id;
                    window.named = nome;
                    window.user_mod = usuario;
                    window.emaill = email;
                    window.data = date;
                    window.tamanho = size;
                    window.state = estado;
                    window.type = tipo;
                    document.getElementById("id_modal").innerHTML = id;
                    document.getElementById("us").innerHTML = usuario;
                    document.getElementById("nome").innerHTML = nome;
                    document.getElementById("email").innerHTML = email;
                    document.getElementById("estado_modal").innerHTML = estado;
                    document.getElementById("tipo_modal").innerHTML = tipo;
                    document.getElementById("tamanho_modal").innerHTML = size + ' MB';
                    document.getElementById("data_modal").innerHTML = date.toString().replace(/T/, ' ').replace(/\..+/, '');
                    document.getElementById("salvar_modal").innerHTML = '';
                    document.getElementById("cancelar_modal").innerHTML = '';
                    document.getElementById("alterar_modal").innerHTML = '<button type="button" class="btn btn-warning" onclick="vizualizar_modal()">Alterar</button>';
                    document.getElementById("remover_conta").innerHTML = '<a href="../remover/'+id+'" class="btn btn-danger pull-right">Apagar conta</a>';
                }

                function vizualizar_modal() {
                    document.getElementById("us").innerHTML = '<input type="text" name="usuario" id="usuario" class="form-control" value="' + window.user_mod + '">';
                    document.getElementById("nome").innerHTML = '<input type="text" name="nome" id="nome" class="form-control" value="' + window.named + '">';
                    document.getElementById("email").innerHTML = '<input type="text" class="form-control" name="email" id="email" value="' + window.emaill + '">';
                    document.getElementById("tipo_modal").innerHTML = '<select name="tipo" class="form-control" id="tipo"> <option value="' + window.type + '">Selecione um:</option> <option value="usuario">usuario (normal)</option> <option value="admin">admin</option> </select>';
                    document.getElementById("estado_modal").innerHTML = '<select name="estado" class="form-control" id="estado"> <option value="' + window.state + '">Selecione um:</option> <option value="activa">activa</option> <option value="suspensa">suspensa</option><option value="desactivada">desactivada</option> </select>';
                    document.getElementById("tamanho_modal").innerHTML = '<input  class="form-control" type="number" id="size" name="size" value="' + window.tamanho + '" step="100">';
                    document.getElementById("cancelar_modal").innerHTML = '<button type="button" class="btn btn-warning" onclick="back_modal()">Cancelar</button>';
                    document.getElementById("salvar_modal").innerHTML = '<a onclick="enviar()" class="btn btn-success">Salvar</a>';
                    document.getElementById("alterar_modal").innerHTML = '';
                    
                    
                }

                function back_modal() {
                    document.getElementById("us").innerHTML = window.user_mod;
                    document.getElementById("nome").innerHTML = window.named;
                    document.getElementById("email").innerHTML = window.emaill;
                    document.getElementById("tipo_modal").innerHTML = window.type;
                    document.getElementById("estado_modal").innerHTML = window.state;
                    document.getElementById("tamanho_modal").innerHTML = window.tamanho + ' MB';
                    document.getElementById("salvar_modal").innerHTML = '';
                    document.getElementById("cancelar_modal").innerHTML = '';
                    document.getElementById("alterar_modal").innerHTML = '<button type="button" class="btn btn-warning" onclick="vizualizar_modal()">Alterar</button>';
                }

                function enviar() {

                    $.post("../user/admin", {
                            id: window.idss,
                            nome: $("input[name$='nome']").val(),
                            usuario: $("input[name$='usuario']").val(),
                            email: $("input[name$='email']").val(),
                            size: $("input[name$='size']").val(),
                            tipo: $("select[name$='tipo'] option:selected").val(),
                            estado: $("select[name$='estado'] option:selected").val()
                        },
                        function (data, status) {
                            usuario();
                            atualizar_dados_modal_e_back();
                            var papersObject = JSON.stringify(data.result);

                            if (papersObject == undefined) {
                                document.getElementById("erro2").innerHTML = ''

                            }
                            else {
                                if (papersObject.length > 0) {
                                    document.getElementById("erro2").innerHTML = '<div class="alert alert-dismissible alert-danger"> ' + papersObject.split('"').join('') + ' </div>'
                                }
                            }

                        });
                }
                
                 function atualizar_dados_modal_e_back() {
                    console.log(window.idss)
                    $.getJSON('../db/' + window.idss, function (result) {
                        
                    window.named = result.local.nome;
                    window.user_mod = result.local.usuario;
                    window.emaill = result.local.email;
                    window.tamanho = result.local.size;
                    window.state = result.local.estado;
                    window.type = result.local.su;
                        
                        document.getElementById("painel_email").innerHTML = result.local.email;
                        document.getElementById("us").innerHTML = result.local.usuario;
                        document.getElementById("nome").innerHTML = result.local.nome;
                        document.getElementById("email").innerHTML = result.local.email;
                        document.getElementById("tipo_modal").innerHTML = result.local.su;
                        document.getElementById("estado_modal").innerHTML = result.local.estado;
                        document.getElementById("tamanho_modal").innerHTML = result.local.size + ' MB';
                        document.getElementById("salvar_modal").innerHTML = '';
                        document.getElementById("cancelar_modal").innerHTML = '';
                        document.getElementById("alterar_modal").innerHTML = '<button type="button" class="btn btn-warning" onclick="vizualizar_modal()">Alterar</button>';
                    });
                }
                
                
                 function criar() {

                    $.post("../signup_admin", {
                            nome: $("input[name$='nome1']").val(),
                            usuario: $("input[name$='usuario1']").val(),
                            email: $("input[name$='email1']").val(),
                            password: $("input[name$='password1']").val()
                        },
                        function (data, status) {
                            usuario();
                            var papersObject = JSON.stringify(data.result1);
                            if (papersObject == undefined) {
                                document.getElementById("error3").innerHTML = '';
                                document.getElementById("myForm2").reset();
                            }
                            else {
                                if (papersObject.length > 0) {
                                    document.getElementById("error3").innerHTML = '<div class="alert alert-dismissible alert-danger"> ' + papersObject.split('"').join('') + ' </div>';
                                }
                            }

                        });
                }

                
                
                
                   