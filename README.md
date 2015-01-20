dynamic-forms
=====================
Build Forms in AngularJS From Nothing But JSON

As with any other [AngularJS][] module:

* include the script into your page anywhere after [AngularJS][] itself, using whichever mechanism
    you use for including scripts in your project:

```html
    <script src="angular.min.js"></script>
    <script src="ui-bootstrap-tpls-0.11.0.min.js"></script>
    <script src="dynamic_forms.js"></script>
		<link rel="stylesheet" type="text/css" href="bootstrap.css">
```

```javascript
    appModule = angular.module('app', ['dynamicforms']);
```

* create a [dynamic-form](#the-directive) element anywhere in your page.

```html
    <build-form form_input="dynamicFormTemplate"
		    submitform="formData()"
    </build-form>
```

* populate your [template](#the-template) with a JSON array describing the form you want to create.

```javascript

    $scope.dynamicFormTemplate = {
		name : "Course",
		divArray: ['col-md-8', 'col-md-4'],
		fields :
		[
		  {type: "text", name: "name", label: "Name", col: "1" ,properties: {required: true, placeholder: "Name", onBlur: 'test()', class: 'sample'}},
		  {type: "text", name: "description", label: "Description", col: "2"  ,properties: {required: true}},
		  {type: "text", name: "value", label: "Value", col: "1"  ,properties: {required: true}},
		  {type: "number", name: "age", label: "age", col: "2"  ,properties: {required: true}},
		  {type: "search", name: "agreed", label: "agreed", col: "1"  ,properties: {required: true}, method: "openPop()"},
		  {type: "range", name: "Range", label: "Range", col: "2"},
		  {type: "color", name: "color", label: "Color Picker", col: "1"},
		  {type: "select", name: "teacher_id", label: "Teacher", col: "2" , options: [{'id':'India','value': 'India'},{'id':'USA','value':'USA'},{'id':'UK','value': 'UK'}],properties: {placeholder: "select", onClick: 'test()', required: true}},
		  {type: "radio", name: "subject", label: "Subject", col: "2" , options: [{'id':'1','value': 'English'},{'id':'2', 'value': 'Tamil'}],properties: {placeholder: "select", onClick: 'test()', required: true}},
		  {type: "submit", name: "Save",col:"1",properties: {onClick: 'test123()',class: 'btn btn-primary btn-lg active'}}
		]
  };

    $scope.formData = function () {
        /* Handle the form submission... */
    };
```

And that's about it!  Check out the demo for a more robust example, or keep reading to learn about
all of the things you can do with this module.


#### Common Options ####
* `attributes`: key-value pairs for arbitrary attributes not otherwise supported here; it is strongly
    recommended that you use this option *only* if the attribute you need isn't already supported, as
    any attributes specified here bypass any enhancements this module provides.
* `class`: see [`ng-class`][]
* `callback`: see [`ng-change`][] (or [`ng-click`][] for button-like types)
* `disabled`: see [`ng-disabled`][]
* `label`: wraps the control in a `<label>` tag with the value as text content (but see specific
    types for exceptions to how this is handled)
* __The following options are only supported for types that have values:__
    * `model`: overrides the control's ID as the value of [`ng-model`][] and `name` attributes;
        allows multiple controls to be tied to a single model - you can nest your models further
        by using dot notation in the value
    * `readonly`: see [`ng-readonly`][]
    * `required`: see [`ng-required`][]
    * `val`: an initial value for the model

* [button](#button)
* [checkbox](#checkbox)
* [checklist](#checklist)
* [color](#color)
* [date](#date)
* [datetime](#datetime)
* [datetime-local](#datetime-local)
* [email](#email)
* [file](#file)
* [hidden](#hidden)
* [image](#image)
* [month](#month)
* [number](#number)
* [password](#password)
* [radio](#radio)
* [range](#range)
* [reset](#reset)
* [search](#search)
* [select](#select)
* [submit](#submit)
* [tel](#tel)
* [text](#text)
* [textarea](#textarea)
* [time](#time)
* [url](#url)
* [week](#week)

#### button ####
* __Renders:__ `<button></button>`
* __Additional Options:__
    * None
* __Other Notes:__
    * The value of `label` is used as the content of the `<button>` itself; no additional elements
        are created

#### checkbox ####
* __Renders:__ `<input type="checkbox">`
* __Additional Options:__
    * `isOn`: see [`ng-true-value`][]
    * `isOff`: see [`ng-false-value`][]
    * `slaveTo`: see [`ng-checked`][]
* __Other Notes:__
    * See also the [checklist](#checklist) type, below

#### checklist ####
* __Renders:__ multiple `<input type="checkbox">` controls
* __Additional Options:__
    * `options`: an object containing a collection of child objects, each describing a checkbox
        * The key of each child object specifies the key to associate with the checkbox it describes
        * `class`: applies a specific [`ng-class`][] to the current checkbox, independently of the
            rest
        * `label`: operates identically to the standard `label` option, but applies to a specific
            checkbox in the list
        * See the [checkbox](#checkbox) type for other fields supported here
* __Other Notes:__
    * This is a convenience type, used to tie a group of [checkbox](#checkbox) controls together
        under a single model; the model holds an object, and each control sets a separate key
        within it
    * You can set a `val` on the entire `checklist` (it must, of course, be an object) in addition
        to any per-option `val`s; the per-option versions are set after the full `checklist`
        version, so they will override anything set to their key by the `checklist` itself

#### color ####
* __Renders:__ `<input type="color">`
* __Additional Options:__
    * None
* __Other Notes:__
    * May not be [supported][colorsupport] in all browsers

#### date ####
* __Renders:__ `<input type="date">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * May not be [supported][datesupport] in all browsers

#### datetime ####
* __Renders:__ `<input type="datetime">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * May not be [supported][datesupport] in all browsers

#### datetime-local ####
* __Renders:__ `<input type="datetime-local">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * May not be [supported][datesupport] in all browsers

#### email ####
* __Renders:__ `<input type="email">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * On devices that have on-screen keyboards, the browser may modify the keyboard layout to make
        entering email addresses in these controls easier.

#### fieldset ####
* __Renders:__ `<fieldset></fieldset>`
* __Additional Options:__
    * `fields`: the template for the fields which should appear in the `fieldset`
* __Other Notes:__
    * The value of `label` is used to create a `<legend>` tag as the first child of the `fieldset`

#### file ####
* __Renders:__ `<input type="file">`
* __Additional Options:__
    * `multiple`: whether or not the user can select more than one file at a time with this single
        control
* __Other Notes:__
    * [A directive][filedirective] is included with this module that allows `file` controls to
        properly bind to [AngularJS][] models - the control's FileList object is stored in the
        model, and updating the model's value with a valid FileList object will update the control
        accordingly
    * Also included is [an AngularJS service][fileservice] that wraps the browser's FileReader in a
        promise, so you can get the contents of the selected file for further manipulation, or even
        send it along in an AJAX request, and all without leaving [AngularJS][]
    * Both of these additions are modified versions of code by [K. Scott Allen][] and made
        available on the [OdeToCode][] website; the original versions are linked above

#### hidden ####
* __Renders:__ `<input type="hidden">`
* __Additional Options:__
    * None
* __Other Notes:__
    * Because the underlying HTML control has so little functionality, this control only supports
        `model` and `val` keys

#### image ####
* __Renders:__ `<input type="image">`
* __Additional Options:__
    * `source`: the URL of the image to display in this control
* __Other Notes:__
    * The value of `label` is used to set the `alt` attribute of this control

#### month ####
* __Renders:__ `<input type="month">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * May not be [supported][datesupport] in all browsers

#### number ####
* __Renders:__ `<input type="number">`
* __Additional Options:__
    * `maxValue`: the largest allowed value for this control
    * `minValue`: the smallest allowed value for this control
    * `step`: the amount by which the control can increase or decrease in value
    * Also see [text](#text) below
* __Other Notes:__
    * May not be [supported][numbersupport] in all browsers

#### password ####
* __Renders:__ `<input type="password">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * The only real difference between this control and a [text](#text) control is in the rendering,
        so they support exactly the same options (with the exception of `splitBy`, since it makes no
        sense to split obscured-input strings)

#### radio ####
* __Renders:__ multiple `<input type="radio">` controls
* __Additional Options:__
    * `values`: an object which acts as a simple list of radio options to include
        * The key of each property of this option specifies the value the model should be set to
            when the associated radio `input` is selected
        * The value of each property of this option specifies the label to use for the associated
            radio `input`
* __Other Notes:__
    * Because a single radio `input` by itself isn't particularly useful in most cases, this control
        type assumes users will want to define a list of `value:label` pairs tied to a single model;
        if this is incorrect, you can still create `radio` controls with just one `value:label`
        each, and then tie them together using the `model` key
    * [The directive](#the-directive) doesn't prevent you from applying a `label` to the entire
        collection of `input` controls created by this control type - the entire `div` containing
        them will be wrapped in a `<label>` tag; keep this in mind when building style sheets

#### range ####
* __Renders:__ `<input type="range">`
* __Additional Options:__
    * `step`: the amount by which the control can increase or decrease in value
    * Also see [number](#number) above
* __Other Notes:__
    * By default, this control seems to provide its values to [AngularJS][] as strings.  This might
        be due to [Angular][AngularJS] (as well as the browser) handling them as regular
        [text](#text) controls internally.  Among its other minor tweaks, this module contains a
        very simple directive to override the default [`$parsers`][] mechanism for `range` controls
        and convert these values back to numbers (floats, in case your `step` is not an integer).
    * May not be [supported][rangesupport] in all browsers

#### reset ####
* __Renders:__ `<button type="reset"></button>`
* __Additional Options:__
    * None
* __Other Notes:__
    * As with [button](#button), the value of `label` provides the control's contents
    * [AngularJS][] doesn't seem to monitor the `reset` event, so your models wouldn't normally be
        updated when the form is cleared in this way; while this control is strongly dis-recommended
        in most cases, this directive supports it, so code is included that monitors and properly
        handles these events (NOTE - this feature has not been widely tested; please report any
        issues on [GitHub][issues-github] or [Bitbucket][issues-bitbucket])

#### search ####
* __Renders:__ `<input type="search">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * All browsers support this because it works exactly like a [text](#text) control.  The idea is
        that search boxes will be styled differently, and on some devices might even support
        additional input methods, such as voice recognition.  You'll probably want to tie these
        controls to some kind of search mechanism in your app, since users whose browsers *do*
        render them differently will expect them to act accordingly.


#### text ####
* __Renders:__ `<input type="text">`
* __Additional Options:__
    * `maxLength`: see [`ng-maxlength`][]
    * `minLength`: see [`ng-minlength`][]
    * `placeholder`: a value to display in a `text`-like control when it is empty
    * `splitBy`: see [`ng-list`][] (this option is only supported by `text` and
        [textarea](#textarea) controls)
    * `validate`: see [`ng-pattern`][]
* __Other Notes:__
    * This control serves as the base template for nearly all the other form input controls defined
        by HTML - as such, most of the controls supported by this directive support these options as
        well, leading their entries to refer here

