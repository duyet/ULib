'use strict';

// Configuring the Articles module
angular.module('loans').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Loans', 'loans', 'dropdown', '/loans(/create)?');
		Menus.addSubMenuItem('topbar', 'loans', 'List Loans', 'loans');
		Menus.addSubMenuItem('topbar', 'loans', 'New Loan', 'loans/create');
	}
]);