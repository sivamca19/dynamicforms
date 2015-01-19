angular.module('simpleforms',['ui.bootstrap'])
.directive('simpleForm',['$compile','$parse', function($compile,$parse){
	var fieldClassName = "form-control";
	var defaultProperties = {
    placeholder: 'placeholder',
    required: 'ng-required',
    class: 'class'
  }
	
	var actionProperties ={
    onBlur: 'ng-blur',
    onChange: 'ng-change',
    onClick: 'ng-click'
  }
	
	var getForm =  function(){
		var formElement = angular.element('<form>')
		return formElement;
	}
	
	var buildWrapper = function(divCollections){
		var divArray = [];
		angular.forEach(divCollections, function (value, keyId){
			divArray.push(angular.element('<div class="'+value+" "+(keyId+1)+'" name="'+(keyId+1)+'">'));
		});

		return divArray;
	}
	
	var getField =  function(field, formName){
		switch (field.type) {
      case 'select': return getSelectField(field, formName);
      //~ case 'search': return getFieldWrapper(getSearchField(field, formName));
      case 'submit': return getSubmitField(field, formName);
      //~ case 'radio': return  getFieldWrapper(getRadioField(field, formName));
      default: return getTextField(field, formName);
    }
		
	}
	
	var getSelectField = function(field, formName){
		var newElement = getFieldWrapper(); 
		newElement.append(getLabel(field.label));
		var newSelect = angular.element('<select>');
		var ngName = "$parent."+formName+"."+field.name;
		newSelect = setFieldAttributes(newSelect, ngName);
		
		return newElement.append(newSelect);
	}
	
	var setFieldAttributes = function(field, ngName){
		field.attr('ng-model',ngName);
		field.addClass(fieldClassName);
		
		return field;		
	}
	
	var getTextField = function(field, formName){
		var newElement =  getFieldWrapper(); 
		newElement.append(getLabel(field.label));
		var inputBox = angular.element('<input type="'+field.type+'">');
		var ngName = "$parent."+formName+"."+field.name;
		inputBox = setFieldAttributes(inputBox, ngName);

		return newElement.append(setProperties(inputBox, field));
	}
	
	var setProperties = function(newElement, field){
		var inputBox = newElement;
		angular.forEach(field.properties, function (value, key){
			
			if(defaultProperties[key]){
				if(defaultProperties[key] == 'class')
				  inputBox.addClass(value)
				else
			  inputBox.attr(defaultProperties[key], value);
				
			}
			else
			 inputBox.attr(actionProperties[key],"$parent."+value);
			
		});
		
		return inputBox;
		
	}
	
	var getFieldWrapper = function(){
		var divElement = angular.element("<div>");
		divElement.addClass('form-group');
		
		return divElement;
	}
	
	var getSubmitField = function(field, formName){
		var buttonElement = angular.element('<input type="submit">');
		buttonElement.addClass('btn btn-primary btn-lg active');
		buttonElement.val(field.name);
		
		return buttonElement;
	}
	
	var getLabel = function(labelName){
		var label = angular.element("<label>");
		label.attr('class','control-label');
		label.attr('for',labelName);
		label.text(capitalize(labelName));
		
		return label;
	}
	
	var capitalize = function(inputString){
    return inputString == undefined ? '' : inputString.substring(0,1).toUpperCase()+inputString.substring(1);
  }
	return{
		 restrict: 'E',
		transclude: true,
		scope: {
			formInfo: '=formInput'
		},
		link: function(scope,element, attrs)
        {
					var newElement = angular.element("<div>");
					var formName = scope.formInfo.name.toLowerCase();
					var formElement = getForm();
					var arrayElement = buildWrapper(scope.formInfo.divArray); 
					angular.forEach(scope.formInfo.fields, function (option, childId) {
						var column = arrayElement[option.col-1];
						var wrapperElement = getField(option, formName);
						column.append(wrapperElement);
						
					});
					angular.forEach(arrayElement, function (value, keyId){
						newElement.append(value);
					});
					formElement.append(newElement)
					var el = $compile(formElement)(scope);
					 element.replaceWith(el);
					
				}
	};
	
}]);