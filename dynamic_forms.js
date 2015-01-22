angular.module('dynamicforms', ['ui.bootstrap', 'jquery.ui.datepicker'])
.directive('buildForm',['$compile','$parse', function($compile,$parse){
  var currentElementId = null;
  var defaultProperties = {
    placeholder: 'placeholder',
    class: 'class',
    id: 'id',
    uidatepicker: 'uidatepicker'
  }

  var validationProperties = {
    required: 'ng-required',
    maxlength: 'ng-maxlength',
    minlength: 'ng-minlength',
    pattern: 'ng-pattern'

  }

  var validationMessage = {
    required: ' cannot be blank.',
    maxlength: ' should not exceed the maximum length.',
    minlength: ' should have minimum length.',
    pattern: ' is invalid.'
  }

  var actionProperties ={
    onBlur: 'ng-blur',
    onChange: 'ng-change',
    onClick: 'ng-click'
  }

  var buttonClass = 'btn btn-primary btn-lg';
  var textFieldClass = 'form-control';
  var dateFieldClass = 'form-control jqdatepicker';
  var labelClass = 'control-label';

  var supported = {
        'text': {type: 'text',defaultClass: textFieldClass},
        'date': {type: 'text',defaultClass: textFieldClass},
        'datetime': {type: 'text',defaultClass: textFieldClass},
        'datetime-local': {type: 'text',defaultClass: textFieldClass},
        'email': {type: 'text',defaultClass: textFieldClass},
        'month': {type: 'text',defaultClass: textFieldClass},
        'number': {type: 'text',defaultClass: textFieldClass},
        'password': {type: 'text',defaultClass: textFieldClass},
        'search': {type: 'search', defaultClass: textFieldClass},
        'tel': {type: 'text',defaultClass: textFieldClass},
        'textarea': {type: 'textarea',defaultClass: textFieldClass},
        'time': {type: 'text',defaultClass: textFieldClass},
        'url': {type: 'text',defaultClass: textFieldClass},
        'week': {type: 'text',defaultClass: textFieldClass},
        'checkbox': {type: 'text',defaultClass: textFieldClass},
        'color': {type: 'text',defaultClass: textFieldClass},
        'file': {type: 'text',defaultClass: ''},
        'range': {type: 'text',defaultClass: textFieldClass},
        'select': {type: 'select',defaultClass: textFieldClass},
        'radio': {type: 'radio'},
        'button': {type: 'button',defaultClass: textFieldClass},
        'hidden': {type: 'text',defaultClass: textFieldClass},
        'reset': {type: 'button', defaultClass: buttonClass},
        'submit': {type: 'button', defaultClass: buttonClass}
    };

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

    var supportedField = getDefaultValue(field, 'type')

    if(supportedField == '')
      return ''

    switch (supportedField) {
      case 'select': return getFieldWrapper(getSelectField(field, formName));
      case 'search': return getFieldWrapper(getSearchField(field, formName));
      case 'button': return getFieldWrapper(getSubmitField(field));
      case 'radio': return  getFieldWrapper(getRadioField(field, formName));
      case 'textarea': return  getFieldWrapper(getTextAreaField(field, formName));
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
    var buttonTag = "<button type='"+field.type+"'"+setProperties(field)+">"+field.name+"</button>";
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
    var customAttribute =  field.properties && field.properties.uidatepicker == 'external' ? ("date-picker-id ="+ currentElementId.toString()) : '';
    var inputBox = "<input type='"+field.type+"' name='"+field.name+"' ng-model='$parent."+formName+"."+field.name+"'"+setProperties(field)+" class ='"+getDefaultValue(field, 'defaultClass')+"'"+customAttribute+"  />";
    var errorBox = getError(field, formName);
    inputBox = getExternalDatePicker(inputBox, field)

    return includeLabel ? (getLabel(field.label) + inputBox + errorBox) : inputBox;
  }

  var getExternalDatePicker = function(inputBox, field){
    return field.properties && field.properties.uidatepicker == 'external' ? '<div class="input-group date calender-design" id="datepicker8">'+inputBox+'<span class="input-group-addon" ng-click="openCalendar('+currentElementId+');" opendatepicker ><span><i class="fa fa-calendar"></i></span></span></div>'  : inputBox;
  }

  var getDefaultValue = function(field, hashKey){
    var supportedField = supported[field.type];

    return supportedField == undefined ? '' :  supportedField[hashKey]
  }

  var getTextAreaField = function(field, formName){
    var textArea = "<textarea name='"+field.name+"'  ng-model='$parent."+formName+"."+field.name+"'" +setProperties(field)+" class='"+getDefaultValue(field, 'defaultClass')+"'></textarea>";

    return getLabel(field.label) + textArea + getError(field, formName);

  }

  var getSelectField = function(field,formName){
    var selectBox = "<select name="+field.name+" ng-model='$parent."+formName+"."+field.name+"'"+setProperties(field)+" class ='"+getDefaultValue(field, 'defaultClass')+"'>"+getSelectOptions(field.options, field.prompt)+"</select>"
    return getLabel(field.label) + selectBox + getError(field, formName);
  }

  var getSelectOptions = function(options, prompt){
    var selectOptions = '<option value="">'+(prompt == undefined ? '' : prompt)+'</option>';
    angular.forEach(options, function (option, keyId){
      selectOptions += "<option value='"+option.id+"'>"+option.value+"</option>";
    });
    return selectOptions;
  }

  var getLabel = function(labelName){
    return "<label class='"+labelClass+"' for='"+labelName+"' >"+capitalize(labelName)+"</label>";
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
        if(key == 'class' && getDefaultValue(field, 'type') != 'button')
          value = getDefaultValue(field, 'defaultClass') + ' ' + value;

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
          currentElementId = childId;
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


angular.module('jquery.ui.datepicker', []).directive('uidatepicker', function ($parse, $filter) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      var pickerOptions = {
        dateFormat: 'yy-mm-dd',
        showOn: false,
        onSelect: function (date) {
          var formattedDate = date.toString().replace(/-/g,',');
          formattedDate = element.attr('type') == 'text' ? date : new Date(formattedDate)
          $parse(element.attr('ng-model')).assign(scope, formattedDate);
          scope.$apply();
        }
      }
      if(attrs.uidatepicker == 'inline')
        delete pickerOptions['showOn']

      element.datepicker(pickerOptions);

      scope.openCalendar = function(id){
        angular.element(document.querySelectorAll("input[date-picker-id='"+id+"']")).datepicker('show');
      };

    }
  };
});
