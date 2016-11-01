module.exports = function(app){

	var HomeController = {

		index: function(req, res){
			res.render('index', {alert:false});	
		},

		login: function(req, res){
			res.render('login', {alert:false});
		},

		home: function(req, res){
			if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
				res.redirect('/');
			}else{
				
				res.render("home", {alert:false, jardim:false, analise:false});
			}
		}
	}

	return HomeController;
}