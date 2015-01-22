angular.module('AutoForm',['dynamicforms', 'simpleforms']).controller('DynamicFormCtrl', ['$scope', function($scope) {

  $scope.dynamicFormTemplate = {
		name : "Course",
		divArray: ['col-md-4', 'col-md-4','col-md-4'],
		fields :
		[
	{type: "text", name: "name", label: "Name", col: "1" ,properties: {required: true, placeholder: "Name", onBlur: 'test()', class: 'test', maxlength: 3}},
{type: "text", name: "description", label: "Description", col: "2"  ,properties: {required: true, uidatepicker: 'inline'}},
{type: "date", name: "date", label: "Date", col: "3"  ,properties: {required: true, uidatepicker: 'external'}},
{type: "number", name: "age", label: "age", col: "1"  ,properties: {required: true}},
{type: "search", name: "agreed", label: "agreed", col: "2"  ,properties: {required: true}, method: "openPop()"},
{type: "range", name: "Range", label: "Range", col: "3"},
{type: "color", name: "color", label: "Color Picker", col: "1"},
{type: "select", name: "country", label: "Country", col: "2", prompt: "Select" , options: [{'id':'India','value': 'India'},{'id':'USA','value':'USA'},{'id':'UK','value': 'UK'}],properties: {placeholder: "select", onClick: 'test()', required: true}},
{type: "radio", name: "subject", label: "Subject", col: "3" , options: [{'id':'1','value': 'English'},{'id':'2', 'value': 'Tamil'}],properties: {placeholder: "select", onClick: 'test()', required: true}},
{type: "textarea", name: "comment", label: "Comment", col: "3" ,properties: {placeholder: "select", required: true, id: 'comments'}},
{type: "file", name: "image", label: "Image", col: "2"},
{type: "reset", name: "Reset",col:"1",properties: {onClick: 'test123()',class: 'btn btn-primary btn-lg active'}},
{type: "submit", name: "Save",col:"2",properties: {onClick: 'test123()',class: 'btn btn-primary btn-lg active'}}
]
};

$scope.test = function(){
  console.log($scope.course)
}

	}]);
