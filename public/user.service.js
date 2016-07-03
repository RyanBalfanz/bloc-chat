(function(){
"use strict";

angular.module("user", [])
	.constant("FIREBASE_CONFIG", {
		apiKey: "AIzaSyBTIG5wJbWU1lBfF_bRbqs5bEs2wkWy-9M",
		authDomain: "bloc-chat-9444b.firebaseapp.com",
		databaseURL: "https://bloc-chat-9444b.firebaseio.com",
		storageBucket: "",
	})
	.factory("firebase", InitializedFirebaseFactory)
	.factory("User", UserFactory);

function InitializedFirebaseFactory($window, FIREBASE_CONFIG) {
	var fb = $window.firebase.initializeApp(FIREBASE_CONFIG);
	return fb;
}

function UserFactory($log, firebase) {
	function BaseUser() {

	}

	BaseUser.prototype.is_anonymous = function(){};
	BaseUser.prototype.is_authenticated = function(){};
	BaseUser.prototype.is_anonymous = function(){};

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

	function FirebaseUser() {
		// var USERNAME_FIELD = "username";
		var ANONYMOUS_USERNAME = "Anonymous";
		var firebaseUser;

		this.get_username = get_username;
		this.is_authenticated = is_authenticated;
		this.login = function(credentials) {
			var auth = firebase.auth();
			auth.signInWithEmailAndPassword(credentials.email, credentials.password);
		};
		this.logout = function() { unset_username(); };

		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				firebaseUser = user;
			} else {
				// No user is signed in.
				firebaseUser = undefined;
			}
		});

		function get_username() {
			// https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
			if (angular.isDefined(firebaseUser)) {
				var username;
				var firebaseUserUsername = firebaseUser.displayName || firebaseUser.email;
				return !firebaseUser.isAnonymous ? firebaseUserUsername : ANONYMOUS_USERNAME;
			}
		}

		function is_anonymous() {
			return angular.isDefined(firebaseUser) && firebaseUser.isAnonymous;
		}

		function is_authenticated() {
			return angular.isDefined(firebaseUser);
		}

		function link(credentials) {
			var auth = firebase.auth();

			var credential = auth.EmailPasswordAuthProvider.credential(credentials.email, credentials.password);

			auth.currentUser.link(credential).then(function(user) {
				console.log("Anonymous account successfully upgraded", user);
			}, function(error) {
				console.log("Error upgrading anonymous account", error);
			});
		}

		function set_username(username) {
			firebaseUser.updateProfile({
				displayName: username,
				// photoURL: "https://example.com/jane-q-user/profile.jpg"
			}).then(function() {
				// Update successful.
				$log.debug("Username was set");
			}, function(error) {
				// An error happened.
				$log.error(error);
			});
		}
	}

	// return new LocalStorageUser();
	return new FirebaseUser();
}
}());
