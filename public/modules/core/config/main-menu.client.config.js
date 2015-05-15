'use strict';

angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Quản lý danh mục', 'main-categories', 'dropdown', '/');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Books', 'books');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Authors', 'authors');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Publishers', 'publishers');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Book Categories', 'categories');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Book Languages', 'languages');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Các dịch vụ', 'services');

		Menus.addMenuItem('topbar', 'Mượn trả', 'main-service', 'dropdown', '/');
		Menus.addSubMenuItem('topbar', 'main-service', 'Mượn sách', 'loans');
		Menus.addSubMenuItem('topbar', 'main-service', 'Trả sách', 'returns');
		Menus.addSubMenuItem('topbar', 'main-service', 'Tra cứu', 'searches');
		Menus.addSubMenuItem('topbar', 'main-service', 'Dịch vụ', 'servicelogs');


		Menus.addMenuItem('topbar', 'Hệ thống', 'main-system', 'dropdown', '/');
		Menus.addSubMenuItem('topbar', 'main-system', 'Thiết lập chung', 'settings/general');
		Menus.addSubMenuItem('topbar', 'main-system', 'Các quy định', 'settings/library');

		Menus.addMenuItem('topbar', 'Tài khoản', 'main-user', 'dropdown', '/');
		Menus.addSubMenuItem('topbar', 'main-user', 'Sinh viên', 'students');
		Menus.addSubMenuItem('topbar', 'main-user', 'Tài khoản quản trị', 'user-managers');
		Menus.addSubMenuItem('topbar', 'main-user', 'Quản lý nhóm', 'groups');
		Menus.addSubMenuItem('topbar', 'main-user', 'Phân quyền', 'roles');


		Menus.addMenuItem('topbar', 'Khác', 'main-other', 'dropdown', '/');
		Menus.addSubMenuItem('topbar', 'main-other', 'Thông tin', 'students');
		Menus.addSubMenuItem('topbar', 'main-other', 'Trợ giúp', 'students');
		
	}
]);
