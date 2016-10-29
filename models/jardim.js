module.exports = function(){
	var mongoose = require('mongoose');		//instancia midleware do banco de dados
	var Schema = mongoose.Schema;			//instancia metodo de schema do banco de dados

	//cria coleção de usuarios
	var jardim = new Schema({
		nome: String,
		serial_ione: String,
		sensores_umidade: String,
		id_usuario:String,
		data_cad: {type: Date, default: Date.now},
	});

	return mongoose.model('Jardim', jardim);
}
