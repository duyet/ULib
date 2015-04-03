'use strict';

// Configuring the Articles module
angular.module('publishers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Publishers', 'publishers', 'dropdown', '/publishers(/create)?');
		Menus.addSubMenuItem('topbar', 'publishers', 'List Publishers', 'publishers');
		Menus.addSubMenuItem('topbar', 'publishers', 'New Publisher', 'publishers/create');
	}
]);