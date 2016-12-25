(function(){
"use strict";

angular.module("user", [])
	.factory("User", UserFactory);

function UserFactory($window) {
	function LocalStorageUser() {
		var USERNAME_FIELD = "username";
		var storage = $window.localStorage;

		this.get_username = get_username;
		this.is_authenticated = function() { return get_username() ? true : false; };
		this.login = function(credentials) { set_username(credentials.username); };
		this.logout = function() { unset_username(); };

		function get_username() {
			return storage.getItem(USERNAME_FIELD);
		}

		function set_username(username) {
			return storage.setItem(USERNAME_FIELD, username);
		}

		function unset_username(username) {
			return storage.removeItem(USERNAME_FIELD);
		}
	}

	return new LocalStorageUser();
}
}());
