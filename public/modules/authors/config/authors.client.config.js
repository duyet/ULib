'use strict';

// Configuring the Articles module
angular.module('authors').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Authors', 'authors', 'dropdown', '/authors(/create)?');
		Menus.addSubMenuItem('topbar', 'authors', 'List Authors', 'authors');
		Menus.addSubMenuItem('topbar', 'authors', 'New Author', 'authors/create');
	}
]);