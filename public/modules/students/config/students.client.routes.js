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