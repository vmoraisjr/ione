module.exports = function(){
	var mongoose = require('mongoose');		//instancia midleware do banco de dados
	var Schema = mongoose.Schema;			//instancia metodo de schema do banco de dados

	//cria coleção de usuarios
	var usuario = new Schema({
		nome: String,
		sobrenome: String,
		email: String,
		senha: String,
		data_cad: {type: Date, default: Date.now},
	});

	

	return mongoose.model('Usuarios', usuario);
}