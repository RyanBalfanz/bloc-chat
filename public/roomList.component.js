(function(){
"use strict";

angular.module("rooms")
	.component("roomList", {
		templateUrl: "roomList.html",
		controller: RoomListComponent,
	});

function RoomListComponent($log, roomService) {
	var $ctrl = this;
	var emptyRoom = {};

	this.submit = submit;

	this.$routerOnActivate = function(next) {
		$log.debug("RoomListComponent");
		$ctrl.rooms = roomService.list();
		reset();
	};

	function submit(newRoom) {
		roomService.create({
			name: newRoom.name,
		});
		reset();
	}

	function reset() {
		$ctrl.newRoom = angular.copy(emptyRoom);
	}
}
}());
