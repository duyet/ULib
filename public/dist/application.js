'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'ulib';
	var applicationModuleVendorDependencies = [
		'ngResource', 
		'ngCookies',  
		'ngAnimate',  
		'ngTouch', 
		'ngSanitize',
		'ui.router', 
		'ui.bootstrap', 
		'ui.utils', 
		'ui.select',
		'angularFileUpload',
		'angular-loading-bar'
	];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('about');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('authors');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('books');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('categories');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('groups');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('import');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('languages');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('loans');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('publishers');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('servicelogs');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('services');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('students');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('user-managers');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

//Setting up route
angular.module('about').config(['$stateProvider',
	function($stateProvider) {
		// About state routing
		$stateProvider.
		state('pabout', {
			url: '/pabout',
			templateUrl: 'modules/about/views/about.client.view.html'
		}).
		state('about', {
			url: '/about',
			templateUrl: 'modules/about/views/about.client.view.html'
		});
	}
]);
'use strict';

angular.module('about').controller('AboutController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
	}
]);
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
'use strict';

//Setting up route
angular.module('authors').config(['$stateProvider',
	function($stateProvider) {
		// Authors state routing
		$stateProvider.
		state('listAuthors', {
			url: '/authors',
			templateUrl: 'modules/authors/views/list-authors.client.view.html'
		}).
		state('createAuthor', {
			url: '/authors/create',
			templateUrl: 'modules/authors/views/create-author.client.view.html'
		}).
		state('viewAuthor', {
			url: '/authors/:authorId',
			templateUrl: 'modules/authors/views/view-author.client.view.html'
		}).
		state('editAuthor', {
			url: '/authors/:authorId/edit',
			templateUrl: 'modules/authors/views/edit-author.client.view.html'
		});
	}
]);
'use strict';

// Authors controller
angular.module('authors').controller('AuthorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Authors',
	function($scope, $stateParams, $location, Authentication, Authors) {
		$scope.authentication = Authentication;

		// Create new Author
		$scope.create = function() {
			// Create new Author object
			var author = new Authors ({
				name: this.name,
				description: this.description
			});

			// Redirect after save
			author.$save(function(response) {
				$location.path('authors/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Author
		$scope.remove = function(author) {
			if ( author ) { 
				author.$remove();

				for (var i in $scope.authors) {
					if ($scope.authors [i] === author) {
						$scope.authors.splice(i, 1);
					}
				}
			} else {
				$scope.author.$remove(function() {
					$location.path('authors');
				});
			}
		};

		// Update existing Author
		$scope.update = function() {
			var author = $scope.author;

			author.$update(function() {
				$location.path('authors/' + author.id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Authors
		$scope.find = function() {
			$scope.authors = Authors.query();
		};

		// Find existing Author
		$scope.findOne = function() {
			$scope.author = Authors.get({ 
				authorId: $stateParams.authorId
			});
		};
	}
]);
'use strict';

//Authors service used to communicate Authors REST endpoints
angular.module('authors').factory('Authors', ['$resource',
	function($resource) {
		return $resource('authors/:authorId', { authorId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';

//Setting up route
angular.module('books').config(['$stateProvider',
	function($stateProvider) {
		// Books state routing
		$stateProvider.
		state('listBooks', {
			url: '/books',
			templateUrl: 'modules/books/views/list-books.client.view.html'
		}).
		state('createBook', {
			url: '/books/create',
			templateUrl: 'modules/books/views/create-book.client.view.html'
		}).
		state('bookReport', {
			url: '/books/report',
			templateUrl: 'modules/books/views/create-report-book.client.view.html'
		}).
		state('viewBook', {
			url: '/books/:bookId',
			templateUrl: 'modules/books/views/view-book.client.view.html'
		}).
		state('editBook', {
			url: '/books/:bookId/edit',
			templateUrl: 'modules/books/views/edit-book.client.view.html'
		});
	}
]);
'use strict';

// Books controller
angular.module('books').controller('BooksController', ['$scope', '$stateParams', '$location', '$upload', '$timeout', 'Authentication', 'Books', 'Categories', 'Languages', 'Publishers', 'Authors',
	function($scope, $stateParams, $location, $upload, $timeout, Authentication, Books, Categories, Languages, Publishers, Authors) {
		$scope.authentication = Authentication;
		$scope.categories = Categories.query();
		$scope.languages = Languages.query();
		$scope.publishers = Publishers.query();
		$scope.authors = Authors.query();

		$scope.currentUrl = $location.absUrl();
		$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

		$scope.available_number
		$scope.$watch('number', function () {
			$scope.available_number = $scope.number;
		});

		// Create new Book
		$scope.create = function() {
			// Create new Book object
			var book = new Books ({
				book_id: this.book_id,
				category_id: this.category_id,
				language_id: this.language_id,
				name: this.name,
				publisher_id: this.publisher_id,
				number: this.number,
				description: this.description,
				available_number: this.available_number,
				publish_date: this.publish_date,
				image: $scope.image_url || '',
				status: this.status,
			});

			// Redirect after save
			book.$save(function(response) {
				$location.path('books/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				var errors = errorResponse.data.message.filter(function(item, pos) {
					return errorResponse.data.message.indexOf(item) == pos;
				});
				$scope.error = errors.join("<br>");
			});
		};

		// Remove existing Book
		$scope.remove = function(book) {
			if ( book ) { 
				book.$remove();

				for (var i in $scope.books) {
					if ($scope.books [i] === book) {
						$scope.books.splice(i, 1);
					}
				}
			} else {
				$scope.book.$remove(function() {
					$location.path('books');
				});
			}
		};

		// Update existing Book
		$scope.update = function() {
			var book = $scope.book;

			book.$update(function() {
				$location.path('books/' + book.id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Books
		$scope.find = function() {
			$scope.books = Books.query();
		};

		// Find existing Book
		$scope.findOne = function() {
			$scope.book = Books.get({ 
				bookId: $stateParams.bookId
			});
		};

		$scope.loadAuthors = function(query) {
			return $scope.authors;
		};

		$scope.go = function(path) {
			$location.path(path);
		}

		// Auto upload when select
		$scope.$watch('image_upload', function () {
			$scope.upload($scope.image_upload);
		});

		$scope.upload = function(files) {
		    if (files && files.length) {
		        for (var i = 0; i < files.length; i++) {
		            var file = files[i];

		            $scope.uploadStatus = false;
		            $upload.upload({
		                url: 'books/image_upload',
		                fields: {
		                
		                },
		                file: file
		            }).progress(function(evt) {
		                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

		                $scope.uploadStatus = 'Uploading ' + progressPercentage + '%';

						console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
		            }).success(function(data, status, headers, config) {
						console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
						
						$scope.image_url = data;
		            });
		        }
		    }
		};

		$scope.generateThumb = function(file) {
			if (file != null) {
				if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
					$timeout(function() {
						var fileReader = new FileReader();
						fileReader.readAsDataURL(file);
						fileReader.onload = function(e) {
							$timeout(function() {
								file.dataUrl = e.target.result;
							});
						}
					});
				}
			}
		};

	}
]);
'use strict';

//Books service used to communicate Books REST endpoints
angular.module('books').factory('Books', ['$resource',
	function($resource) {
		return $resource('books/:bookId', { bookId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('categories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Categories', 'categories', 'dropdown', '/categories(/create)?');
		Menus.addSubMenuItem('topbar', 'categories', 'List Categories', 'categories');
		Menus.addSubMenuItem('topbar', 'categories', 'New Category', 'categories/create');
		Menus.addSubMenuItem('topbar', 'categories', 'Import Category', 'categories/import');
	}
]);
'use strict';

//Setting up route
angular.module('categories').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
		$stateProvider.
		state('listCategories', {
			url: '/categories',
			templateUrl: 'modules/categories/views/list-categories.client.view.html'
		}).
		state('createCategory', {
			url: '/categories/create',
			templateUrl: 'modules/categories/views/create-category.client.view.html'
		}).
		state('importCategory', {
			url: '/categories/import',
			templateUrl: 'modules/categories/views/import-category.client.view.html'
		}).
		state('viewCategory', {
			url: '/categories/:categoryId',
			templateUrl: 'modules/categories/views/view-category.client.view.html'
		}).
		state('editCategory', {
			url: '/categories/:categoryId/edit',
			templateUrl: 'modules/categories/views/edit-category.client.view.html'
		});
	}
]);
'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', '$upload', 'Authentication', 'Categories',
	function($scope, $stateParams, $location, $upload, Authentication, Categories) {
		$scope.authentication = Authentication;

		// Create new Category
		$scope.create = function() {
			// Create new Category object
			var category = new Categories ({
				name: this.name,
				description: this.description,
				loan_time: this.loan_time
			});

			// Redirect after save
			category.$save(function(response) {
				$location.path('categories/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.$watch('fileimport', function () {
			if ($scope.fileimport && $scope.fileimport.length > 0 && $scope.fileimport[0].name.length > 0) $scope.uploadBtnStatus = $scope.fileimport[0].name;
		});

		// Import Categories
		$scope.import = function() {
			if (!$scope.fileimport || $scope.fileimport.length == 0) {
				$scope.error = 'Please choose import file.';
				return false;
			}

			$scope.uploadStatus = '';
			$upload.upload({
				url: 'categories/import',
				fields: {

				},
				file: $scope.fileimport,
			}).progress(function(evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				$scope.uploadStatus = 'Uploading ' + progressPercentage + '%';

				if (progressPercentage == 100) $scope.uploadStatus = 'Importing ...';

				console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
			}).success(function(data, status, headers, config) {
				console.log(data, status, headers, config);
				$scope.uploadStatus = '';
				$scope.success = data;
			}).error(function(err) {
				$scope.error = err.message;
			});
		};

		// Remove existing Category
		$scope.remove = function(category) {
			if ( category ) { 
				category.$remove();

				for (var i in $scope.categories) {
					if ($scope.categories [i] === category) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		// Update existing Category
		$scope.update = function() {
			var category = $scope.category;

			category.$update(function() {
				$location.path('categories/' + category.id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.query();
		};

		// Find existing Category
		$scope.findOne = function() {
			$scope.category = Categories.get({ 
				categoryId: $stateParams.categoryId
			});
		};
	}
]);
'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
	function($resource) {
		return $resource('categories/:categoryId', { categoryId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
			$('#side-menu').metisMenu();
		});

		
	}
]);
	
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Setting up route
angular.module('groups').config(['$stateProvider',
	function($stateProvider) {
		// Groups state routing
		$stateProvider.
		state('listGroups', {
			url: '/groups',
			templateUrl: 'modules/groups/views/list-groups.client.view.html'
		}).
		state('createGroup', {
			url: '/groups/create',
			templateUrl: 'modules/groups/views/create-group.client.view.html'
		}).
		state('viewGroup', {
			url: '/groups/:groupId',
			templateUrl: 'modules/groups/views/view-group.client.view.html'
		}).
		state('editGroup', {
			url: '/groups/:groupId/edit',
			templateUrl: 'modules/groups/views/edit-group.client.view.html'
		});
	}
]);
'use strict';

// Groups controller
angular.module('groups').controller('GroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groups', 'UserManagers',
	function($scope, $stateParams, $location, Authentication, Groups, UserManagers) {
		$scope.authentication = Authentication;

		$scope.go = function (path) {
			$location.path(path);
		};

		// Create new Group
		$scope.create = function() {
			// Create new Group object
			var group = new Groups ({
				name: this.name,
				description: this.description
			});

			// Redirect after save
			group.$save(function(response) {
				$location.path('groups/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Group
		$scope.remove = function(group) {
			if ( group ) { 
				group.$remove();

				for (var i in $scope.groups) {
					if ($scope.groups [i] === group) {
						$scope.groups.splice(i, 1);
					}
				}
			} else {
				$scope.group.$remove(function() {
					$location.path('groups');
				});
			}
		};

		// Update existing Group
		$scope.update = function() {
			var group = $scope.group;

			group.$update(function() {
				$location.path('groups/' + group.id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Groups
		$scope.find = function() {
			$scope.groups = Groups.query();
		};

		$scope.getListStaff = function() { 
			$scope.staffs = UserManagers.query();
		}

		// Find existing Group
		$scope.findOne = function() {
			$scope.group = Groups.get({ 
				groupId: $stateParams.groupId
			});
		};
	}
]);
'use strict';

//Groups service used to communicate Groups REST endpoints
angular.module('groups').factory('Groups', ['$resource',
	function($resource) {
		return $resource('groups/:groupId', { groupId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('import').config(['$stateProvider',
	function($stateProvider) {
		// Import state routing
		$stateProvider.
		state('import', {
			url: '/import',
			templateUrl: 'modules/import/views/import.client.view.html'
		}).state('importForModule', {
			url: '/books/:module',
			templateUrl: 'modules/import/views/import-module.client.view.html'
		});
	}
]);
'use strict';

angular.module('import').controller('ImportController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
	}
]);
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
'use strict';

//Setting up route
angular.module('languages').config(['$stateProvider',
	function($stateProvider) {
		// Languages state routing
		$stateProvider.
		state('listLanguages', {
			url: '/languages',
			templateUrl: 'modules/languages/views/list-languages.client.view.html'
		}).
		state('createLanguage', {
			url: '/languages/create',
			templateUrl: 'modules/languages/views/create-language.client.view.html'
		}).
		state('viewLanguage', {
			url: '/languages/:languageId',
			templateUrl: 'modules/languages/views/view-language.client.view.html'
		}).
		state('editLanguage', {
			url: '/languages/:languageId/edit',
			templateUrl: 'modules/languages/views/edit-language.client.view.html'
		});
	}
]);
'use strict';

// Languages controller
angular.module('languages').controller('LanguagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Languages',
	function($scope, $stateParams, $location, Authentication, Languages) {
		$scope.authentication = Authentication;

		// Create new Language
		$scope.create = function() {
			// Create new Language object
			var language = new Languages ({
				name: this.name,
				description: this.description
			});

			// Redirect after save
			language.$save(function(response) {
				$location.path('languages/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Language
		$scope.remove = function(language) {
			if ( language ) { 
				language.$remove();

				for (var i in $scope.languages) {
					if ($scope.languages [i] === language) {
						$scope.languages.splice(i, 1);
					}
				}
			} else {
				$scope.language.$remove(function() {
					$location.path('languages');
				});
			}
		};

		// Update existing Language
		$scope.update = function() {
			var language = $scope.language;

			language.$update(function() {
				$location.path('languages/' + language.id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Languages
		$scope.find = function() {
			$scope.languages = Languages.query();
		};

		// Find existing Language
		$scope.findOne = function() {
			$scope.language = Languages.get({ 
				languageId: $stateParams.languageId
			});
		};
	}
]);
'use strict';

//Languages service used to communicate Languages REST endpoints
angular.module('languages').factory('Languages', ['$resource',
	function($resource) {
		return $resource('languages/:languageId', { languageId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';

//Setting up route
angular.module('loans').config(['$stateProvider',
	function($stateProvider) {
		// Loans state routing
		$stateProvider.
		state('listLoans', {
			url: '/loans',
			templateUrl: 'modules/loans/views/list-loans.client.view.html'
		}).
		state('createLoan', {
			url: '/loans/create',
			templateUrl: 'modules/loans/views/create-loan.client.view.html'
		}).
		state('viewLoan', {
			url: '/loans/:loanId',
			templateUrl: 'modules/loans/views/view-loan.client.view.html'
		}).
		state('editLoan', {
			url: '/loans/:loanId/edit',
			templateUrl: 'modules/loans/views/edit-loan.client.view.html'
		});
	}
]);
'use strict';

// Loans controller
angular.module('loans').controller('LoansController', ['$scope', '$stateParams', '$location', 'Authentication', 'Loans', 'Books', 'Students',
	function($scope, $stateParams, $location, Authentication, Loans, Books, Students) {
		$scope.authentication = Authentication;
		$scope.books = Books.query();
		$scope.students = Students.query();

		// Create new Loan
		$scope.create = function() {
			// Create new Loan object
			var loan = new Loans ({
				student_id: this.student_id,
				staff_id: this.user.id,
				book_id: this.book_ids
			});

			// Redirect after save
			loan.$save(function(response) {
				$location.path('loans/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Loan
		$scope.remove = function(loan) {
			if ( loan ) { 
				loan.$remove();

				for (var i in $scope.loans) {
					if ($scope.loans [i] === loan) {
						$scope.loans.splice(i, 1);
					}
				}
			} else {
				$scope.loan.$remove(function() {
					$location.path('loans');
				});
			}
		};

		// Update existing Loan
		$scope.update = function() {
			var loan = $scope.loan;

			loan.$update(function() {
				$location.path('loans/' + loan._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Loans
		$scope.find = function() {
			$scope.loans = Loans.query();
		};

		// Find existing Loan
		$scope.findOne = function() {
			$scope.loan = Loans.get({ 
				loanId: $stateParams.loanId
			});
		};
	}
]);
'use strict';

//Loans service used to communicate Loans REST endpoints
angular.module('loans').factory('Loans', ['$resource',
	function($resource) {
		return $resource('loans/:loanId', { loanId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';

//Setting up route
angular.module('publishers').config(['$stateProvider',
	function($stateProvider) {
		// Publishers state routing
		$stateProvider.
		state('listPublishers', {
			url: '/publishers',
			templateUrl: 'modules/publishers/views/list-publishers.client.view.html'
		}).
		state('createPublisher', {
			url: '/publishers/create',
			templateUrl: 'modules/publishers/views/create-publisher.client.view.html'
		}).
		state('viewPublisher', {
			url: '/publishers/:publisherId',
			templateUrl: 'modules/publishers/views/view-publisher.client.view.html'
		}).
		state('editPublisher', {
			url: '/publishers/:publisherId/edit',
			templateUrl: 'modules/publishers/views/edit-publisher.client.view.html'
		});
	}
]);
'use strict';

// Publishers controller
angular.module('publishers').controller('PublishersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Publishers',
	function($scope, $stateParams, $location, Authentication, Publishers) {
		$scope.authentication = Authentication;

		// Create new Publisher
		$scope.create = function() {
			// Create new Publisher object
			var publisher = new Publishers ({
				name: this.name,
				description: this.description,
			});

			// Redirect after save
			publisher.$save(function(response) {
				$location.path('publishers/' + response.id);

				// Clear form fields
				$scope.name = '';
				$scope.description = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Publisher
		$scope.remove = function(publisher) {
			if ( publisher ) { 
				publisher.$remove();

				for (var i in $scope.publishers) {
					if ($scope.publishers [i] === publisher) {
						$scope.publishers.splice(i, 1);
					}
				}
			} else {
				$scope.publisher.$remove(function() {
					$location.path('publishers');
				});
			}
		};

		// Update existing Publisher
		$scope.update = function() {
			var publisher = $scope.publisher;

			publisher.$update(function() {
				$location.path('publishers/' + publisher.id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Publishers
		$scope.find = function() {
			$scope.publishers = Publishers.query();
		};

		// Find existing Publisher
		$scope.findOne = function() {
			$scope.publisher = Publishers.get({ 
				publisherId: $stateParams.publisherId
			});
		};
	}
]);
'use strict';

//Publishers service used to communicate Publishers REST endpoints
angular.module('publishers').factory('Publishers', ['$resource',
	function($resource) {
		return $resource('publishers/:publisherId', { publisherId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';

//Setting up route
angular.module('servicelogs').config(['$stateProvider',
	function($stateProvider) {
		// Servicelogs state routing
		$stateProvider.
		state('listServicelogs', {
			url: '/servicelogs',
			templateUrl: 'modules/servicelogs/views/list-servicelogs.client.view.html'
		}).
		state('createServicelog', {
			url: '/servicelogs/create',
			templateUrl: 'modules/servicelogs/views/create-servicelog.client.view.html'
		}).
		state('viewServicelog', {
			url: '/servicelogs/:servicelogId',
			templateUrl: 'modules/servicelogs/views/view-servicelog.client.view.html'
		}).
		state('editServicelog', {
			url: '/servicelogs/:servicelogId/edit',
			templateUrl: 'modules/servicelogs/views/edit-servicelog.client.view.html'
		});
	}
]);
'use strict';

// Servicelogs controller
angular.module('servicelogs').controller('ServicelogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Servicelogs', 'Services',
	function($scope, $stateParams, $location, Authentication, Servicelogs, Services) {
		$scope.authentication = Authentication;
		console.log($scope.authentication);
		
		// Load services
		$scope.services = Services.query(function(data) {
			$scope.service_type_id = data[0].id;
		});

		// Create new Servicelog
		$scope.create = function() {
			// Create new Servicelog object
			var servicelog = new Servicelogs ({
				service_type_id: this.service_type_id,
				prices: this.prices,
				note: this.note,
				staff_id: $scope.authentication.user.id
			});

			// Redirect after save
			servicelog.$save(function(response) {
				$location.path('servicelogs/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// View modal service info 
		$scope.viewServiceInfo = function(serviceData) {
			$scope.serviceInfo = serviceData;
			$('#serviceInfo').modal('show');
		}

		// Remove existing Servicelog
		$scope.remove = function(servicelog) {
			if ( servicelog ) { 
				servicelog.$remove();

				for (var i in $scope.servicelogs) {
					if ($scope.servicelogs [i] === servicelog) {
						$scope.servicelogs.splice(i, 1);
					}
				}
			} else {
				$scope.servicelog.$remove(function() {
					$location.path('servicelogs');
				});
			}
		};

		// Update existing Servicelog
		$scope.update = function() {
			var servicelog = $scope.servicelog;

			servicelog.$update(function() {
				$location.path('servicelogs/' + servicelog._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Servicelogs
		$scope.find = function() {
			$scope.servicelogs = Servicelogs.query();
		};

		// Find existing Servicelog
		$scope.findOne = function() {
			$scope.servicelog = Servicelogs.get({ 
				servicelogId: $stateParams.servicelogId
			});
		};
	}
]);
'use strict';

//Servicelogs service used to communicate Servicelogs REST endpoints
angular.module('servicelogs').factory('Servicelogs', ['$resource',
	function($resource) {
		return $resource('servicelogs/:servicelogId', { servicelogId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('services').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Services', 'services', 'dropdown', '/services(/create)?');
		Menus.addSubMenuItem('topbar', 'services', 'List Services', 'services');
		Menus.addSubMenuItem('topbar', 'services', 'New Service', 'services/create');
	}
]);
'use strict';

//Setting up route
angular.module('services').config(['$stateProvider',
	function($stateProvider) {
		// Services state routing
		$stateProvider.
		state('listServices', {
			url: '/services',
			templateUrl: 'modules/services/views/list-services.client.view.html'
		}).
		state('createServices', {
			url: '/services/create',
			templateUrl: 'modules/services/views/create-services.client.view.html'
		}).
		state('viewServices', {
			url: '/services/:serviceId',
			templateUrl: 'modules/services/views/view-services.client.view.html'
		}).
		state('editServices', {
			url: '/services/:serviceId/edit',
			templateUrl: 'modules/services/views/edit-services.client.view.html'
		});
	}
]);
'use strict';

// Services controller
angular.module('services').controller('ServicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Services',
	function($scope, $stateParams, $location, Authentication, Services) {
		$scope.authentication = Authentication;

		// Create new Service
		$scope.create = function() {
			// Create new Service object
			var service = new Services ({
				name: this.name,
				description: this.description,
			});

			// Redirect after save
			service.$save(function(response) {
				$location.path('services/' + response.id);

				// Clear form fields
				$scope.name = '';
				$scope.description = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Service
		$scope.remove = function(service) {
			if ( service ) { 
				service.$remove();

				for (var i in $scope.services) {
					if ($scope.services [i] === service) {
						$scope.services.splice(i, 1);
					}
				}
			} else {
				$scope.service.$remove(function() {
					$location.path('services');
				});
			}
		};

		// Update existing Service
		$scope.update = function() {
			var service = $scope.service;

			service.$update(function() {
				$location.path('services/' + service.id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Services
		$scope.find = function() {
			$scope.services = Services.query();
		};

		// Find existing Service
		$scope.findOne = function() {
			$scope.service = Services.get({ 
				serviceId: $stateParams.serviceId
			});
		};
	}
]);
'use strict';

//Services service used to communicate Services REST endpoints
angular.module('services').factory('Services', ['$resource',
	function($resource) {
		return $resource('services/:serviceId', { serviceId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('students').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Students', 'students', 'dropdown', '/students(/create)?');
		Menus.addSubMenuItem('topbar', 'students', 'List Students', 'students');
		Menus.addSubMenuItem('topbar', 'students', 'New Student', 'students/create');
	}
]);
'use strict';

//Setting up route
angular.module('students').config(['$stateProvider',
	function($stateProvider) {
		// Students state routing
		$stateProvider.
		state('listStudents', {
			url: '/students',
			templateUrl: 'modules/students/views/list-students.client.view.html'
		}).
		state('createStudent', {
			url: '/students/create',
			templateUrl: 'modules/students/views/create-student.client.view.html'
		}).
		state('importStudent', {
			url: '/students/import',
			templateUrl: 'modules/students/views/import-student.client.view.html'
		}).
		state('viewStudent', {
			url: '/students/:studentId',
			templateUrl: 'modules/students/views/view-student.client.view.html'
		}).
		state('editStudent', {
			url: '/students/:studentId/edit',
			templateUrl: 'modules/students/views/edit-student.client.view.html'
		});
	}
]);
'use strict';

// Students controller
angular.module('students').controller('StudentsController', ['$scope', '$stateParams', '$location', '$upload', 'Authentication', 'Students',
	function($scope, $stateParams, $location, $upload, Authentication, Students) {
		$scope.authentication = Authentication;

		// Create new Student
		$scope.create = function() {
			// Create new Student object
			var student = new Students ({
				student_id: this.student_id,
				name: this.name,
				subject: this.subject,
				sex: this.sex,
				email: this.email
			});

			// Redirect after save
			student.$save(function(response) {
				$location.path('students/' + response.student_id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.$watch('fileimport', function () {
			if ($scope.fileimport && $scope.fileimport.length > 0 && $scope.fileimport[0].name.length > 0) $scope.uploadBtnStatus = $scope.fileimport[0].name;
		});

		// Import Students
		$scope.import = function() {
			if (!$scope.fileimport || $scope.fileimport.length == 0) {
				$scope.error = 'Please choose import file.';
				return false;
			}

			$scope.uploadStatus = '';
			$upload.upload({
				url: 'students/import',
				fields: {

				},
				file: $scope.fileimport,
			}).progress(function(evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				$scope.uploadStatus = 'Uploading ' + progressPercentage + '%';

				if (progressPercentage == 100) $scope.uploadStatus = 'Importing ...';

				console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
			}).success(function(data, status, headers, config) {
				console.log(data, status, headers, config);
				$scope.uploadStatus = '';
				$scope.success = data;
			}).error(function(err) {
				$scope.error = err.message;
			});
		};

		// Remove existing Student
		$scope.remove = function(student) {
			if ( student ) { 
				student.$remove();

				for (var i in $scope.students) {
					if ($scope.students [i] === student) {
						$scope.students.splice(i, 1);
					}
				}
			} else {
				$scope.student.$remove(function() {
					$location.path('students');
				});
			}
		};

		// Update existing Student
		$scope.update = function() {
			var student = $scope.student;

			console.log(student);

			student.$update(function() {
				$location.path('students/' + student.student_id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Students
		$scope.find = function() {
			$scope.students = Students.query();
		};

		// Find existing Student
		$scope.findOne = function() {
			$scope.student = Students.get({ 
				studentId: $stateParams.studentId
			});
		};
	}
]);
'use strict';

//Students service used to communicate Students REST endpoints
angular.module('students').factory('Students', ['$resource',
	function($resource) {
		return $resource('students/:studentId', { studentId: '@student_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
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
'use strict';

//Setting up route
angular.module('user-managers').config(['$stateProvider',
	function($stateProvider) {
		// User managers state routing
		$stateProvider.
		state('listUserManagers', {
			url: '/user-managers',
			templateUrl: 'modules/user-managers/views/list-user-managers.client.view.html'
		}).
		state('createUserManager', {
			url: '/user-managers/create',
			templateUrl: 'modules/user-managers/views/create-user-manager.client.view.html'
		}).
		state('viewUserManager', {
			url: '/user-managers/:userManagerId',
			templateUrl: 'modules/user-managers/views/view-user-manager.client.view.html'
		}).
		state('editUserManager', {
			url: '/user-managers/:userManagerId/edit',
			templateUrl: 'modules/user-managers/views/edit-user-manager.client.view.html'
		});
	}
]);
'use strict';

// User managers controller
angular.module('user-managers').controller('UserManagersController', ['$scope', '$stateParams', '$location', 'Authentication', 'UserManagers',
	function($scope, $stateParams, $location, Authentication, UserManagers) {
		$scope.authentication = Authentication;

		$scope.go = function (path) {
			$location.path(path);
		};

		// Create new User manager
		$scope.create = function() {
			// Create new User manager object
			var userManager = new UserManagers ({
				name: this.name,
				username: this.username, 
				password: this.password, 
				email: this.email
			});

			// Redirect after save
			userManager.$save(function(response) {
				$location.path('user-managers/' + response.id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing User manager
		$scope.remove = function(userManager) {
			if ( userManager ) {
				userManager.$remove();

				for (var i in $scope.userManagers) {
					if ($scope.userManagers [i] === userManager) {
						$scope.userManagers.splice(i, 1);
					}
				}

				$location.path('user-managers');
			} else {
				$scope.userManager.$remove(function() {
					$location.path('user-managers');
				});
			}
		};

		// Update existing User manager
		$scope.update = function() {
			var userManager = $scope.userManager;

			userManager.$update(function() {
				$location.path('user-managers/' + userManager._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of User managers
		$scope.find = function() {
			$scope.userManagers = UserManagers.query();
		};

		// Find existing User manager
		$scope.findOne = function() {
			$scope.userManager = UserManagers.get({ 
				userManagerId: $stateParams.userManagerId
			});
		};
	}
]);
'use strict';

//User managers service used to communicate User managers REST endpoints
angular.module('user-managers').factory('UserManagers', ['$resource',
	function($resource) {
		return $resource('user-managers/:userManagerId', { userManagerId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
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
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/profile.client.view.html'
		}).
		state('edit-profile', {
			url: '/settings/edit-profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('ProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);