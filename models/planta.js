module.exports = function(){
	var mongoose = require('mongoose');		//instancia midleware do banco de dados
	var Schema = mongoose.Schema;			//instancia metodo de schema do banco de dados

	//cria coleção de usuarios
	var planta = new Schema({
		nome: String,
		cientifico: String,
		temperatura: String,
		cuidados:String,
		grupo:String,
		umidade_minima:String,
		umidade_maxima:String,
		data_cad: {type: Date, default: Date.now},
	});
	return mongoose.model('Planta', planta);
}
