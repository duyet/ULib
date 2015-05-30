'use strict';

/*
angular.module('user-managers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Users and Groups', 'user-managers', 'dropdown', '/user-managers(/create)?');

		// Groups
		Menus.addSubMenuItem('topbar', 'user-managers', 'List Groups', 'groups');
		Menus.addSubMenuItem('topbar', 'user-managers', 'New Group', 'groups/create');
		
		// Users
		Menus.addSubMenuItem('topbar', 'user-managers', 'List User managers', 'user-managers');
		Menus.addSubMenuItem('topbar', 'user-managers', 'New User manager', 'user-managers/create');
	}
]);
*/

// Config HTTP Error Handling
angular.module('user-managers').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);