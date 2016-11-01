module.exports = function(){
	var mongoose = require('mongoose');		//instancia midleware do banco de dados
	var Schema = mongoose.Schema;			//instancia metodo de schema do banco de dados

	//cria coleção de analise
	var analise = new Schema({

		jardim:String,
		clima: String,
		valor_sensores: String,
		status_solo: String,
		consumo_agua: String,
		data_cad: {type: Date, default: Date.now},
	});

	return mongoose.model('Analise', analise);
}
