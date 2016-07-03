(function(){
"use strict";

angular.module("rooms")
	.component("roomDetail", {
		templateUrl: "roomDetail.html",
		bindings: { $router: "<" },
		controller: RoomDetailComponent,
	});

function RoomDetailComponent($log, Room, User) {
	var $ctrl = this;
	var emptyMessage = {};

	this.add_message = add_message;
	this.is_own_message = is_own_message;
	this.messages = null;
	this.room = null;
	this.User = User;

	this.$routerOnActivate = function(next) {
		$log.debug("RoomDetailComponent");
		var roomId = next.params.id;
		var room = Room(roomId);
		$ctrl.room = room;
		// room.$bindTo($ctrl, "room");
		$ctrl.messages = room.getLatestMessages(3);
		reset();
	};

	function add_message(message) {
		if (!User.is_authenticated()) {
			alert("You are not authorized to do that.");
			return;
		}
		var username = User.get_username();
		$ctrl.room.addMessage({
			author: username,
			content: message.content,
		});
		reset();
	}

	function is_own_message(message) {
		return message.author == User.get_username();
	}

	function reset() {
		$ctrl.newMessage = angular.copy(emptyMessage);
	}
}
}());
