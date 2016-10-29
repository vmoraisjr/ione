module.exports = function(app){

	var nodemailer  = require('nodemailer');	//midleware para envio de email
	var bCrypt      = require('bcrypt-nodejs');	//midleware para criptografar senha
	var Usuario 	= app.models.usuario;		//instancia classe Model - usuario


	var UsuarioController = {
		//metodos da classe controllers.usuario

		//metodo - login
		login: function(req, res){

			var email 	= req.body.email,
			senha 		= req.body.senha,
			msgerr		= 'Dados inválidos';
			msgok		= 'login efetuado com sucesso';

			Usuario.find({email:email}, function(err, data){
				if (err) {
					console.log("Login - erro ao localizar conta "+err);
				}else{
					if (data.length == 1) {
					if (bCrypt.compareSync(senha, data[0].senha)) { //compara as senha (criptografia)
						var session = req.session.use ={ 
							id: id,
							nome: nome,
							sobrenome: sobrenome};
							res.redirect('/home', {msg:msgok});
						}

					}else{
						res.jason(msgerr);
						console.log(msgerr+" email não localizado");
					}
				}
			});
		},

		//metodo - cadastrar novo usuario
		cadastrar: function(req, res){ 
			var nome 	= req.body.nome,
			sobrenome	= req.body.sobrenome,
			email 		= req.body.email,
			senha 		= bCrypt.hashSync(req.body. senha),//criptografa senha a ser gravada no banco de dados
			novaConta 	= {nome, sobrenome, email, senha };
			
		//verifica email já possui conta cadastrada
		Usuario.find({email:email}, function(err, data){
			if (err) {
				console.log('cadastrar - erro ao localizar email '+err);
			}else{
		//se email já cadastrado, retorna sem cadastrar
		if (data.length == 1) {
			console.log('email já possu conta cadastrado');
			res.json('email já possui conta cadastrada.');
		}else{
		//cadastra nova conta de usuario
		var model = new Usuario(novaConta);
		model.save(function(err, data){
			if (err) {
				console.log('erro ao gravar novo usuario '+err);
			}else{
				res.redirect('/home');
			}
		});
	}
}
});
	},

	//metodo - exibe página de detalhes da conta de usuário, *session
	exibirConta: function(req, res){
		if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
			res.redirect('/');
		}else{
			res.render('/exibirConta');
		}
	},

	//metodo - alterar dados da conta do usuário
	alterarConta: function(req, res){
		var id 		= req.session.user.id,
		nome 		= req.body.nome,
		sobrenome 	= req.body.sobrenome;

		Usuario.update({_id:id},{$set:{nome:nome, sobrenome:sobrenome}}, function(err, data){
			if (err) {
				console.log('alterarConta - erro ao atualizar '+err);
			}else{
				res.redirect('/home');
			}
		});
	},

	//metodo - enviar link por email para recuperar senha
	recuperarSenha: function(req, res){
		var email = req.body.email;

		Usuario.find({email:email}, function(err, data){
			if (err) {
				console.log('recuperarSenha - email não localizado '+err);
			}else{
				//cria link a ser enviado por email com o endereço do servidor e id da conta
				var link = '/redefiniremail?K='+data[0].senha.substr(5,20)+'&I='+data[0].id
				//executa funcao que envia email
				new enviarEmailSenha(req, res, link, email);
			}
		})
	},

	//mtodo - exibe tela redirecionada pelo link do email, *session
	redefinirEmail: function(req, res){
		if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
			res.redirect('/');
		}else{
			var key = req.query.K,
			id 		= req.query.I,
			msgerr	= 'dados invalidos';

			Usuario.find({_id:id}, function(err, data){
				if(err){
					console.log('redefinirEmail - conta não localizada '+err);
				}else{
					if (data.length == 1) {
						if (data[0].senha.substr(5,20) == key) {
							res.render('redefiniremail', {key:key, id:id});
						}else{
							res.json(msgerr);
							console.log(msgerr+" redefinirEmail - substr de senha não confere");
						}
					}else{
						res.json(msgerr);
						console.log(msgerr+" redefinirEmail - conta não encontrada por Id");
					}
				}
			});
		}
	},

	//metodo - redefine a senha do usuario pelo link enviado por email
	redefinirSenhaEmail: function(req, res){

		var key = req.body.key,
		id 		= req.body.id,
		senha 	= bCrypt.hashSync(req.body.senha),
		msgerr	= 'dados invalidos';
		msgok	= 'senha alterada com sucesso'


		Usuario.find({_id:id}, function(err, data){
			if (err) {
				console.log('redefinirSenhaEmail - erro ao localizar conta por id '+err);
			}else{
				if (data.length == 1) {
					if (data[0].senha.substr(5,20) == key) {
						Usuario.update({_id:id},{$set:{senha:senha}});
						res.redirect('/home');
					}else{
						console.log(msgerr+" redefinirEmail - substr de senha não confere");	
						res.json(msgerr);
					}
				}else{
					console.log(msgerr+" redefinirEmail - conta não encontrada por Id");
					res.json(msgerr);
				}
			}
		});
	},

	//metodo - exibe tela redirecionada pelo link da página home
	redefinirHome: function(req, res){
		if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
			res.redirect('/');
		}else{
			res.render('redefinirhome');
		}
	},

	//metodo - redefinir senha pelo link da página home.
	redefinirSenhaHome: function(req, res){
		var id 	= req.session.user.id,
		senha 	= req.body.senha,
		msgerr	= 'dados invalidos';
		msgok	= 'senha alterada com sucesso'

		Usuario.find({_id:id}, function(err, data){
			if (err) {
				console.log('redefinirSenhaEmail - erro ao localizar conta por id '+err);
			}else{
				if (data.length == 1) {
					if (bCrypt.compareSync(senha, data[0].senha)) {
						Usuario.update({_id:id},{$set:{senha:senha}});
						res.json(msgok)
					}else{
						console.log(msgerr+" redefinirEmail - substr de senha não confere");	
						res.redirect('/home');
					}
				}else{
					console.log(msgerr+" redefinirEmail - conta não encontrada por Id");
					res.json(msgerr);
				}
			}
		});
	},

	//metodo - listar todos as contas
	listar: function(req, res){
		Usuario.find(function(err, user){
			if (err) {
				console.log('erro ao listar usuarios '+err);
			}else{
				res.json(user);
			}

		});
	}
}

return UsuarioController;


   //funções app.controllers.usuario

   //função para enviar email
   function enviarEmailSenha(req, res,link,email) {

   	//cria instancia de email a ser enviado
   	var mailOptions = {
   		from: 'ionegardensystem@gmail.com', 
   		to: email, 
   		subject: 'ione Jardim Inteligente | Redefinir de Senha',
   		text: 'Para redefinir sua senha click no link: http://localhost:3000'+link
   	};


   	var transporter = nodemailer.createTransport({
   		service: 'Gmail',
   		auth: {
            user: 'ionegardensystem@gmail.com', // Your email id
            pass: 'jardim10' // Your password
        }
    });

   	transporter.sendMail(mailOptions, function(err, info){
   		if(err){
   			console.log('recuperarSenha - erro ao enviar email '+err);
   			res.json("Erro ao enviar email");
   		}else{
   			console.log('Email enviado para: '+email);
   			res.json("Email encaminhado para "+email);
   		}
   	});    
   };

}

