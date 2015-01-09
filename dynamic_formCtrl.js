angular.module('AutoForm',['dynamicforms']).controller('DynamicFormCtrl', ['$scope', function($scope) {

  $scope.dynamicFormTemplate = {
		name : "Course",
		divArray: ['col-md-8', 'col-md-4'],
		fields :
		[
	{type: "text", name: "name", label: "Name", col: "1" ,properties: {required: true, placeholder: "Name", onBlur: 'test()', class: 'siva'}},
{type: "text", name: "description", label: "Description", col: "2"  ,properties: {required: true}},
{type: "text", name: "value", label: "Value", col: "1"  ,properties: {required: true}},
{type: "number", name: "age", label: "age", col: "2"  ,properties: {required: true}},
{type: "search", name: "agreed", label: "agreed", col: "1"  ,properties: {required: true}, method: "openPop()"},
{type: "range", name: "Range", label: "Range", col: "2"},
{type: "color", name: "color", label: "Color Picker", col: "1"},
{type: "select", name: "teacher_id", label: "Teacher", col: "2" , options: [{'id':'India','value': 'India'},{'id':'USA','value':'USA'},{'id':'UK','value': 'UK'}],properties: {placeholder: "select", onChange: 'test()', required: true}},
{type: "radio", name: "subject", label: "Subject", col: "2" , options: [{'id':'1','value': 'English'},{'id':'2', 'value': 'Tamil'}],properties: {placeholder: "select", onChange: 'test()', required: true}},
{type: "submit", name: "Save",col:"1",properties: {onClick: 'test123()',class: 'btn btn-primary btn-lg active'}}
]
};

$scope.test = function(){
  console.log("sdgfdg")

  console.log($scope.course)
}

	}]);