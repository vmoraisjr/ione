module.exports = function(app){
	
	var home		= app.controllers.home;
	var usuario		= app.controllers.usuario;
	var jardim 		= app.controllers.jardim;

	//express-session: cria seção de usuario, impedindo que acesso páginas internas sem estar logado.
	
	//rotas - pagina principal 
	app.get('/', home.index);
	app.get('/home', home.home); //*session
	
	//rotas - usuario
	app.post('/login', usuario.login);								//rota - login no sistema
	app.post('/cadastrarUsuario', usuario.cadastrar);				//rota - cadastrar novo usuario
	app.get('/exibirConta', usuario.exibirConta);					//rota - exibe página com detalhes da conta
	app.post('/altrarConta', usuario.alterarConta);					//rota - alterar dados da conta
	app.post('/recuperarSenha', usuario.recuperarSenha);			//rota - recuperar senha (link email)
	app.get('/redefinirEmail', usuario.redefinirEmail);				//rota - exibe página para inserir nova senha (link email)
	app.post('/redefinirSenhaEmail', usuario.redefinirSenhaEmail);	//rota - redefine senha (link email)
	app.get('/redefinirHome', usuario.redefinirHome);//*session		//rota - exibe página para inserir nova senha (link home)
	app.post('/redefinirSenhaHome', usuario.redefinirSenhaHome);	//rota - redefine senha (link home)
	app.get('/listarUsuarios', usuario.listar);						//rota - listar todos usuarios
	
	//rotas - jardim

	app.post('/cadastrarJardim', jardim.cadastrar);					//rota - cadastrar jardim
	app.get('/exibirJardim', jardim.exibirJardim);					//rota - exibe página com detalhes do jardim
	app.post('/alterarJardim', jardim.alterarJardim);				//rota - alterar dados do jardim
	app.post('/deletarJardim', jardim.deletarJardim);				//rota - deletar Jardim
	app.post('/listarJardim', jardim.listarJardim)					//rota - listar todos jardins

	//rotas - analize
	//rotas - relatorios

}

/*
campos devem ser inseridos na pagina definir nova senha encaminhada por email
<input type="hidden" name="key" value="<%- key %>" >
<input type="hidden" name="id" value="<%- id %>" >
*/