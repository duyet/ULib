'use strict';

// Configuring the Articles module
angular.module('languages').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Languages', 'languages', 'dropdown', '/languages(/create)?');
		Menus.addSubMenuItem('topbar', 'languages', 'List Languages', 'languages');
		Menus.addSubMenuItem('topbar', 'languages', 'New Language', 'languages/create');
	}
]);