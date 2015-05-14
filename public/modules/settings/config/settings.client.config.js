'use strict';

// Configuring the Articles module
angular.module('settings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Settings', 'settings', 'dropdown', '/settings(/create)?');
		Menus.addSubMenuItem('topbar', 'settings', 'General Settings', 'settings/general');
		Menus.addSubMenuItem('topbar', 'settings', 'Library Options', 'settings/library');
		Menus.addSubMenuItem('topbar', 'settings', 'Debugs', 'settings/debug');
	}
]);