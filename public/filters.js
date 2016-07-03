(function(){
"use strict";

angular.module("filters", [])
	.factory("moment", function($window) { return $window.moment; })
	.filter("fromNow", FromNowFilterFactory);

function FromNowFilterFactory(moment) {
	return function FromNowFilter(input) {
		return moment(input).fromNow();
	};
}
}());
