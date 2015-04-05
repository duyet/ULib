'use strict';

// Configuring the Articles module
angular.module('books').run(['Menus', 
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Books', 'books', 'dropdown', '/books(/create)?');
		Menus.addSubMenuItem('topbar', 'books', 'List Books', 'books');
		Menus.addSubMenuItem('topbar', 'books', 'New Book', 'books/create');
	}
]);