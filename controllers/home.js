module.exports = function(app){

	var HomeController = {
		index: function(req, res){
			res.render("index");	
		},

		home: function(req, res){
			if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
				res.redirect('/');
			}else{
				res.render("home");
			}
		}
	}

	return HomeController;
}