module.exports = function(app){

	var Jardim 	= app.models.jardim;	//instancia classe Model - jardim
	var Usuario	= app.models.usuario;	//instancia classe Model - usuario
	var Planta = app.models.planta;   //instancia classe Model - Plantas

	var JardimController = {

		//metodo exibe pagina de cadastro
		cadastro: function(req, res){
			if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
				res.redirect('/');
			}else{
				res.render('novojardim');
			}
		},

		//metodo cadastar novo jardim 
		cadastrar: function(req, res){
			var nome 			= req.body.nome,
			serial_ione			= req.body.serial,
			sensores_umidade	= req.body.sensores,
			id_usuario			= req.session.user.id,
			estado				= req.body.estado,
			cidade				= req.body.cidade,
			novoJardim 			= {nome, serial_ione, sensores_umidade, estado, cidade, id_usuario};
			planta  			= req.body.planta;

			model = new Jardim(novoJardim);
			model.save(function(err, data){ //cadastra jardim no banco de dados
				if (err) {
					console.log('erro ao gravar novo jardim '+err);
				}else{

				//relacionar o jardim às plantas selecionadas
				for (var i = 0; i < planta.length; i++) {
					Planta.update({nome:planta[i]},{$set:{jardim:data[0].nome}}, function(err,data){
						if (err) console.log('cadastrarJardim - associar planta '+err);
					});
				}			
				
				//relacionar o jardim à conta de usuario
				var idUsuario = req.session.user.id;
				Usuario.update({_id:idUsuario},{$set:{jardim: data[0].nome}}, function(err, data){
					if (err) console.log('cadastrarJardim - associar conta usuario '+err);
				});
				
				res.render('/home');
			}
		});

		},

		//metodo exibir detalhes do jardim
		exibir: function(req, res){

			var id = req.session.user.id;

			//procura jardim no banco de dados
			Jardim.find({id_usuario:id}, function(err, data){
				if (err) {
					console.log('exibirJardim - erro localizar jardim '+err);
				}else{
					var jardim = data;

			//pricura as plantas que estão associadas ao jardim no banco de dados
			Planta.find({jardim:{$exist:true}}, function(err, data){
				if (err) {
					console.log('exibirJardim - erro localizar plantas '+err);		
				}else{
					var plantas = data;

					res.render('meujardim', {jardim:jardim, plantas:plantas});
				}
			});
		}
	})
		},

		//metodo alterar dados do jardim
		editar: function(req, res){
			var nome 			= req.body.nome,
			serial_ione 		= req.body.serial,
			sensores_umidade 	= req.body.sensores,
			id_usuario			= req.session.user.id,
			planta 				= req.body.planta;

			//altera os dados do jardim cadastrado
			Jardim.update({id_usuario:id_usuario},{$set:{
				nome:nome,
				serial_ione:serial_ione,
				sensores_umidade:sensores_umidade}}, function(err, data){
					if(err){
						console.log('alterarJardim - erro update jardim '+err);
					}else{
						
						//atualiza a associação do jardim às plantas

						//remove associação do jardim
						Planta.update({jardim:{$exist:true}},{$unset:{jardim:1}}, function(err, data){
							if (err) {
								console.log('alterarJardim - erro remover jardim das plantas '+err);		
							}else{
						//insere associação do jardim
						for (var i = 0; i < planta.length; i++) {
							Planta.update({nome:planta[i]},{$set:{jardim:data[0].nome}}, function(err,data){
								if (err) console.log('alterarJardim - associar planta '+err);
							});
						}	
						res.render('/home');
					}
				});
					}
				});

		},

		//metodo deletar jardim
		deletar: function(req, res){

			var id_usuario = req.session.user.id;

			Jardim.delete({id_usuario:id_usuario}, function(err, data){
				if (err) {
					console.log('deletarJardim - erro ao deletar jardim '+err);
				}else{
					//remove associação do jardim com as plantas
					Planta.update({jardim:{$exist:true}},{$unset:{jardim:1}}, function(err, data){
						if (err) {
							console.log('deletarJardim - erro remover jardim das plantas '+err);
						}else{
							Usuario.update({_id:id_usuario}, {$unset:{jardim:1}}, function(err, data){
								if (err) {
									console.log('deletarJardim - erro remover jardim de conta do usuario '+err);
								}else{
									res.redirect('/home');
								}
							});

						}
					});
				}
			});
		},

		//metodo listar jardim
		listar: function(req, res){
			//opção de administrador do sistema - fora do escopo
		}
	}

	return JardimController;
}