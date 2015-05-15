'use strict';

angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Quản lý danh mục', 'main-categories', 'dropdown', '/categories(/create)?');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Books', 'books');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Authors', 'authors');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Publishers', 'publishers');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Book Categories', 'categories');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Book Languages', 'languages');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Các dịch vụ', 'services');

		Menus.addMenuItem('topbar', 'Mượn trả', 'main-service', 'dropdown', '/categories(/create)?');
		Menus.addSubMenuItem('topbar', 'main-service', 'Mượn sách', 'loans');
		Menus.addSubMenuItem('topbar', 'main-service', 'Trả sách', 'returns');
		Menus.addSubMenuItem('topbar', 'main-service', 'Tra cứu', 'searches');
		Menus.addSubMenuItem('topbar', 'main-service', 'Dịch vụ', 'servicelogs');


		Menus.addMenuItem('topbar', 'Hệ thống', 'main-system', 'dropdown', '/categories(/create)?');
		Menus.addSubMenuItem('topbar', 'main-system', 'Thiết lập chung', 'settings/general');
		Menus.addSubMenuItem('topbar', 'main-system', 'Các quy định', 'settings/library');

		Menus.addMenuItem('topbar', '', 'main-roles', 'dropdown', '/categories(/create)?');
		Menus.addSubMenuItem('topbar', 'main-roles', 'Thiết lập chung', 'settings/general');
		Menus.addSubMenuItem('topbar', 'main-roles', 'Các quy định', 'settings/library');
	}
]);
