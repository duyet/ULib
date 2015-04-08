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