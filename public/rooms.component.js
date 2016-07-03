(function(){
"use strict";

angular.module("rooms", ["firebase"])
	.constant("FIREBASE_CONFIG", {
		apiKey: "AIzaSyBTIG5wJbWU1lBfF_bRbqs5bEs2wkWy-9M",
		authDomain: "bloc-chat-9444b.firebaseapp.com",
		databaseURL: "https://bloc-chat-9444b.firebaseio.com",
		storageBucket: "",
	})
	.factory("firebase", InitializedFirebaseFactory)
	.factory("RoomFactory", RoomFactory)
	.factory("Room", Room)
	.factory("roomService", RoomService)
	.factory("messageService", MessageService)
	.component("rooms", {
		templateUrl: 'rooms.html',
		$routeConfig: [
			{path: '/',    name: 'RoomList',   component: 'roomList', useAsDefault: true},
			{path: '/:id', name: 'RoomDetail', component: 'roomDetail'},
		]
	});

function InitializedFirebaseFactory($window, FIREBASE_CONFIG) {
	var fb = $window.firebase.initializeApp(FIREBASE_CONFIG);
	return fb;
}

function RoomService($q, $firebaseArray, firebase, Room) {
	var service = {
		create: function(room) { return get_rooms_array().$add(room); },
		list: function() { return get_rooms_array(); },
		get: function(id) { return Room(id); },
	};

	return service;

	function get_rooms_reference() {
		return firebase.database().ref().child("rooms");
	}

	function get_rooms_array() {
		return $firebaseArray(get_rooms_reference());
	}
}

function Room(firebase, RoomFactory) {
	return function(roomId) {
		var roomRef = firebase.database().ref().child("rooms").child(roomId);
		return new RoomFactory(roomRef);
	};
}

function RoomFactory($window, $firebaseObject, messageService) {
	return $firebaseObject.$extend({
		addMessage: function(m) {
			return messageService.add({
				room: this.$id,
				author: m.author,
				content: m.content,
				created_at: $window.firebase.database.ServerValue.TIMESTAMP,
			});
		},
		getMessages: function() {
			var roomId = this.$id;
			return messageService.all_for_room(roomId);
		},
		getLatestMessages: function(n) {
			var roomId = this.$id;
			return messageService.latest_for_room(roomId, n);
		}
	});
}

function MessageService($q, $firebaseArray, firebase) {
	var database = firebase.database();
	var messagesRef = database.ref().child("messages");

	return {
		add: add_message,
		all: list_messages,
		all_for_room: list_room_messages,
		latest_for_room: latest_for_room,
	};

	function add_message(message) {
		return $firebaseArray(messagesRef).$add(message);
	}

	function list_messages() {
		return $firebaseArray(messagesRef);
	}

	function list_room_messages(room, limit) {
		var messagesQuery = messagesRef.orderByChild("room").equalTo(room);
		return $firebaseArray(messagesQuery);
	}

	function latest_for_room(room, n) {
		var messagesQuery = messagesRef.orderByChild("room").equalTo(room).limitToLast(n);
		return $firebaseArray(messagesQuery);
	}
}

}());
