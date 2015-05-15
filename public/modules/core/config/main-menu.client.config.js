'use strict';

// Configuring the Articles module
angular.module('categories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Quản lý danh mục', 'categories', 'dropdown', '/categories(/create)?');
		Menus.addSubMenuItem('topbar', 'categories', 'Books', 'books');
		Menus.addSubMenuItem('topbar', 'categories', 'Authors', 'authors');
		Menus.addSubMenuItem('topbar', 'categories', 'Publishers', 'publishers');
		Menus.addSubMenuItem('topbar', 'categories', 'Book Categories', 'categories');
		Menus.addSubMenuItem('topbar', 'categories', 'Book Languages', 'languages');
	}
]);