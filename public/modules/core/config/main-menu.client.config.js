'use strict';

angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '<i class="md md-home"></i> Home', 'main-page', '/');

		Menus.addMenuItem('topbar', '<i class="md md-loop"></i> Nghiệp vụ', 'main-service', 'dropdown', '#');
		Menus.addSubMenuItem('topbar', 'main-service', 'Mượn sách', 'loans/create');
		Menus.addSubMenuItem('topbar', 'main-service', 'Trả sách', 'returns/create');
		Menus.addSubMenuItem('topbar', 'main-service', 'Tra cứu', 'searches');
		Menus.addSubMenuItem('topbar', 'main-service', 'Dịch vụ', 'servicelogs/create');

		Menus.addMenuItem('topbar', '<i class="md md-book"></i> Quản lý danh mục', 'main-categories', 'dropdown', '#');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Books', 'books');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Authors', 'authors');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Publishers', 'publishers');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Book Categories', 'categories');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Book Languages', 'languages');
		Menus.addSubMenuItem('topbar', 'main-categories', 'Các dịch vụ', 'services');

		Menus.addMenuItem('topbar', '<i class="md md-search"></i> Tra cứu', 'main-search', 'dropdown', '#');
		Menus.addSubMenuItem('topbar', 'main-search', 'Danh sách mượn', 'loans');
		Menus.addSubMenuItem('topbar', 'main-search', 'Danh sách trả', 'returns');
		Menus.addSubMenuItem('topbar', 'main-search', 'Danh sách SV', 'students');

		Menus.addMenuItem('topbar', '<i class="md md-settings"></i> Hệ thống', 'main-system', 'dropdown', '#');
		Menus.addSubMenuItem('topbar', 'main-system', 'Thiết lập chung', 'settings/general');
		Menus.addSubMenuItem('topbar', 'main-system', 'Các quy định', 'settings/library');

		Menus.addMenuItem('topbar', '<i class="md md-account-box"></i> Tài khoản', 'main-user', 'dropdown', '#');
		Menus.addSubMenuItem('topbar', 'main-user', 'Quản lý tài khoản', 'user-managers');
		Menus.addSubMenuItem('topbar', 'main-user', 'Quản lý nhóm', 'groups');
		Menus.addSubMenuItem('topbar', 'main-user', 'Phân quyền', 'roles');

		Menus.addMenuItem('topbar', '<i class="md md-assessment"></i> Báo cáo', 'main-report', 'dropdown', '#');

		Menus.addMenuItem('topbar', '<i class="md md-info-outline"></i> Khác', 'main-other', 'dropdown', '#');
		Menus.addSubMenuItem('topbar', 'main-other', 'Thông tin', 'students');
		Menus.addSubMenuItem('topbar', 'main-other', 'Trợ giúp', 'students');


		
	}
]);


angular.module('core').run(['$rootScope', '$location', 'Authentication', function ($rootScope, $location, Authentication) {
    $rootScope.$on('$routeChangeStart', function (event) {

        if (!Authentication.isAuthorized) $location.path('signin');
        
    });
}]);