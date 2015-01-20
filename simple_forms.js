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

  var getForm =  function(formName){
    var formElement = angular.element('<form novalidate>')
    formElement.attr('name',formName);
    formElement.attr('ng-submit','submitform()');
    return formElement;
  }

  var buildWrapper = function(divCollections){
    var divArray = [];
    angular.forEach(divCollections, function (value, keyId){
      divArray.push(angular.element('<div class="'+value+'">'));
    });

    return divArray;
  }

  var getField =  function(field, formName){
    switch (field.type) {
      case 'select': return getSelectField(field, formName);
      case 'search': return getSearchWrapper(field, formName);
      case 'submit': return getSubmitField(field, formName);
      case 'radio': return getRadioField(field, formName);
      default: return getTextField(field, formName);
    }

  }

  var getSelectField = function(field, formName){
    var newElement = getFieldWrapper();
    newElement.append(getLabel(field.label));
    var newSelect = angular.element('<select>');
    var ngName = "$parent."+formName+"."+field.name;
    setFieldAttributes(newSelect, ngName, field);
    getSelectOptions(newSelect,field.options);
    newElement.append(setProperties(newSelect,field));

    if(field.properties && field.properties.required)
      newElement.append(getError(field, formName));

    return newElement
  }

  var getSelectOptions = function(newSelect,options){
    var selectOption = angular.element('<option>');
    newSelect.append(selectOption);
    angular.forEach(options, function (option, keyId){
      selectOption = angular.element('<option>');
      selectOption.val(option.id);
      selectOption.text(option.value);
      newSelect.append(selectOption);
    });
    return newSelect;
  }

  var setFieldAttributes = function(newElement, ngName, field){
    newElement.attr('ng-model',ngName);
    newElement.addClass(fieldClassName);
    newElement.attr('name',field.name);

    return newElement;
  }

  var getTextField = function(field, formName){
    var newElement =  getFieldWrapper();
    newElement.append(getLabel(field.label));

    var inputBox = angular.element('<input type="'+field.type+'">');
    var ngName = "$parent."+formName+"."+field.name;
    inputBox = setFieldAttributes(inputBox, ngName, field);
    newElement.append(setProperties(inputBox, field));
    if(field.properties && field.properties.required)
      newElement.append(getError(field, formName));

    return newElement
  }

  var getSearchWrapper = function(field, formName){
    var newElement =  getFieldWrapper();
    newElement.append(getLabel(field.label));
    var searchWrapper = angular.element('<div class="input-group">') ;
    var spanWrapper = angular.element('<span class="input-group-btn">');
    spanWrapper.append(angular.element('<button class="btn btn-default" type="button" ng-click="$parent.'+field.method+'">Go!</button>'));
    var inputBox = angular.element('<input type="'+field.type+'">');
    var ngName = "$parent."+formName+"."+field.name;
    setFieldAttributes(inputBox, ngName, field);
    searchWrapper.append(setProperties(inputBox, field));
    newElement.append(searchWrapper);

    searchWrapper.append(spanWrapper);
    if(field.properties && field.properties.required)
      newElement.append(getError(field, formName));

    return newElement

  }

  var getRadioField = function(field, formName){
    var newElement =  getFieldWrapper();
    newElement.append(getLabel(field.label));
    var radioWrapper =  null;
    angular.forEach(field.options, function (option, keyId){
      radioWrapper = angular.element('<div class="radio">');
      var radioField = angular.element("<input type='radio' />")
      var ngName = "$parent."+formName+"."+field.name;
      radioField.attr('ng-model',ngName);
      radioField.val(option.id);
      radioWrapper.append(radioField);
      radioWrapper.append(getLabel(option.value));
      newElement.append(radioWrapper);
    });

    return newElement

  }

  var getError = function(field, formName){
    var errorElement = angular.element('<p>');
    errorElement.attr('ng-if',formName+'.'+field.name+'.$error.required');
    errorElement.addClass('help-block error-txt');
    errorElement.text(capitalize(field.label)+" can't be blank.");

    return errorElement;

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
      else if(actionProperties[key])
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
    var buttonElement = angular.element('<button type="submit">');
    buttonElement.addClass('btn btn-primary btn-lg active');
    buttonElement.text(field.name);

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
      formInfo: '=formInput',
      submitform: '&'
    },
    link: function(scope,element, attrs)
        {
          var newElement = angular.element("<div>");
          var formName = scope.formInfo.name.toLowerCase();
          var formElement = getForm(formName);
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
