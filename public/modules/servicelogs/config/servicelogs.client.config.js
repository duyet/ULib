'use strict';

// Configuring the Articles module
angular.module('servicelogs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Servicelogs', 'servicelogs', 'dropdown', '/servicelogs(/create)?');
		Menus.addSubMenuItem('topbar', 'servicelogs', 'List Servicelogs', 'servicelogs');
		Menus.addSubMenuItem('topbar', 'servicelogs', 'New Servicelog', 'servicelogs/create');
	}
]);