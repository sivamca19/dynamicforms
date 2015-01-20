angular.module('dynamicforms', ['ui.bootstrap'])
.directive('buildForm',['$compile','$parse', function($compile,$parse){
  var defaultProperties = {
    placeholder: 'placeholder',
    class: 'class'
  }

  var validationProperties = {
    required: 'ng-required',
    maxlength: 'ng-maxlength',
    minlength: 'ng-minlength',
    pattern: 'ng-pattern'

  }

  var validationMessage = {
    required: ' canot be blank.',
    maxlength: ' should not exceed the maximum length.',
    minlength: ' should have minimum length.',
    pattern: ' is invalid.'
  }

  var actionProperties ={
    onBlur: 'ng-blur',
    onChange: 'ng-change',
    onClick: 'ng-click'
  }

  var getFormHeader = function(methodName, formName){
    var formSubmit = methodName == undefined ? '' : "ng-submit="+methodName
    return "<form "+formSubmit+" name='"+formName+"'  novalidate><body-section></form>";
  }

  var getWrapperDiv =  function(divArray){
    var wrapper = '';
    angular.forEach(divArray, function (value, keyId){
      wrapper += "<div class='"+value+"'><"+(keyId+1)+"-div></div>";
    });
    return wrapper;
  }

  var removeUnwantedDiv = function(elements, divArray){
    angular.forEach(divArray, function (value, keyId){
      var regExp = new RegExp("<"+(keyId+1)+"-div>");
      elements = elements.replace(regExp,'');
    });
    return elements;
  }

  var getField = function(field, formName){
    switch (field.type) {
      case 'select': return getFieldWrapper(getSelectField(field, formName));
      case 'search': return getFieldWrapper(getSearchField(field, formName));
      case 'submit': return getFieldWrapper(getSubmitField(field));
      case 'radio': return  getFieldWrapper(getRadioField(field, formName));
      default: return getFieldWrapper(getTextField(field, true, formName));
    }
  }

  var getRadioField = function(field, formName){
    var radioField = '';
    angular.forEach(field.options, function (option, keyId){
      radioField += "<div class='radio'><input type='radio' ng-model='$parent."+formName+"."+field.name+"' value = '"+option.id+"' />"+getLabel(option.value)+"</div>"
    });
    return getLabel(field.label)+" " +radioField;
  }

  var getSubmitField = function(field){
    var buttonTag = "<button type='submit'"+setProperties(field)+">"+field.name+"</button>";
    return buttonTag;
  }

  var getFieldWrapper = function(row){
    return "<div class='form-group'>"+row+"</div>";
  }

  var getSearchField = function(field, formName){
    var searchButton = '<span class="input-group-btn"><button class="btn btn-default" type="button" ng-click="$parent.'+field.method+'">Go!</button></span></div>';
    return getLabel(field.label) +'<div class="input-group">' +getTextField(field, false, formName) + searchButton + getError(field, formName);
  }

  var getTextField = function(field, includeLabel, formName){
    var inputBox = "<input type='"+field.type+"' name='"+field.name+"' ng-model='$parent."+formName+"."+field.name+"'"+setProperties(field)+" class ='form-control'/>";
    var errorBox = getError(field, formName);

    return includeLabel ? (getLabel(field.label) + inputBox + errorBox) : inputBox;
  }

  var getSelectField = function(field,formName){
    var selectBox = "<select name="+field.name+" ng-model='$parent."+formName+"."+field.name+"'"+setProperties(field)+" class ='form-control'>"+getSelectOptions(field.options)+"</select>"
    return getLabel(field.label) + selectBox + getError(field, formName);
  }

  var getSelectOptions = function(options){
    var selectOptions = '<option value=""></option>';
    angular.forEach(options, function (option, keyId){
      selectOptions += "<option value='"+option.id+"'>"+option.value+"</option>";
    });
    return selectOptions;
  }

  var getLabel = function(labelName){
    return "<label class='control-label' for='"+labelName+"' >"+capitalize(labelName)+"</label>";
  }

  var getError = function(field, formName){
    var errors = '';
    angular.forEach(field.properties, function (value, key){
      if(validationProperties[key])
        errors += '<p ng-if="'+formName+'.'+field.name+'.$error.'+key+'" class="help-block error-txt ng-scope">'+capitalize(field.label)+'  '+getValidationMessage(key)+'</p>';

    });

    return errors;
  }

  var getValidationMessage = function(key){

    return validationMessage[key];
  }
  var capitalize = function(inputString){
    return inputString.substring(0,1).toUpperCase()+inputString.substring(1);
  }

  var setProperties = function(field){
    if(field.properties == undefined)
      return '';

      var propertyElement = '';
      angular.forEach(field.properties, function (value, key){
        if(key == 'class' && field.type != 'submit')
          value = 'form-control ' + value;

        if(defaultProperties[key])
          propertyElement += defaultProperties[key]+"='"+value+"'";
        else if(validationProperties[key])
          propertyElement += validationProperties[key]+"='"+value+"'";
        else if(actionProperties[key])
          propertyElement += actionProperties[key]+"='$parent."+value+"'";
      });
      return propertyElement;
    }
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        formInfo: '=formInput',
        submitform: '&'
      },
      link: function ($scope,element,attrs){
        var formName = $scope.formInfo.name.toLowerCase();
        var formWrapper = getFormHeader('submitform()', formName);
        var childElement = $scope.formInfo.divArray == undefined ? '' : getWrapperDiv($scope.formInfo.divArray);
        angular.forEach($scope.formInfo.fields, function (option, childId) {
          if(option.col != undefined ){
           var regExp = new RegExp("<"+option.col+"-div>");
           var fieldRow = getField(option,formName) +"<"+option.col+"-div>"
           childElement = childElement.replace(regExp,fieldRow);
         }
         else{
           childElement += getField(option, formName);
         }
        });
        if($scope.formInfo.divArray != undefined)
          childElement = removeUnwantedDiv(childElement,$scope.formInfo.divArray);

        var el = $compile(formWrapper.replace(/<body-section>/g,childElement))($scope);
        element.replaceWith(el);
      },
      controller: function($scope) {
        //$scope.accept('test()')
        // $scope.test = function(){
        //
        //   console.log("sdgfdg")
        //   console.log($scope.name)
        // }
      }
    }
  }]);
