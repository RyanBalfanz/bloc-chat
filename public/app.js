(function(){
"use strict";

angular.module("app", [
	"ngComponentRouter",
	"filters",
	"rooms",
	"user",
])
	.constant('LOGIN_PROMPT', "What is your name?")
	.value('$routerRootComponent', 'app')
	.component("app", {
		templateUrl: "app.html",
		controller: AppController,
		$routeConfig: [
			{path: '/rooms/...', name: 'Rooms', component: 'rooms', useAsDefault: true },
		]
	})
	.run(Login);

function AppController($log, User) {
	var $ctrl = this;

	this.login = login;
	this.logout = logout;
	this.User = User;

	this.$onInit = function() {
		$log.debug("AppController");
	};

	function login(credentials) {
		User.login(credentials);
	}

	function logout() {
		User.logout();
	}
}

function Login($window, User, LOGIN_PROMPT) {
	var username;
	if (!User.is_authenticated()) {
		while (!username) {
			 // WARNING: This raw input is untrusted.
			var raw = $window.prompt(LOGIN_PROMPT);
			username = raw;
			User.login({username: username});
		}
	} else {
		username = User.get_username();
	}
}
}());
