require('jquery-datetimepicker')
require('moment')

import CustomElement from 'modules/custom_element'
import Helper from 'modules/helper'


// @Definition
interface InputElement extends HTMLElement {
  label: string;
  description: string;
  name: string;
  type: string;
  value: string;
  checked: boolean;
  disabled: boolean;
  required: boolean;
}


interface InputViewModel {
  submit?: boolean,
  select?: boolean,
  datetime?: boolean,
  default?: boolean,
  deleted?: boolean
}


class Input {
  constructor(private _element: InputElement) { }

  private _input: HTMLInputElement;
  private _label: HTMLLabelElement;
  private _description: HTMLDivElement;

  createdCallback() {
    if (!this._element) {
      Input.call(this, this);
    }
  }

  attachedCallback() {
    var content = this._element.innerHTML;

    var viewModel: InputViewModel = {};
    switch (this._element.type) {
      case 'select'  : viewModel.select = true; break;
      case 'button'  :
      case 'submit'  : viewModel.submit = true; break;
      default        : viewModel.default = true; break;
    }

    // This will create a deleted prompt on the selection
    if (this.deleted) {
      viewModel.deleted = true;
    }

    this._element.innerHTML = '';
    CustomElement.insertFragment(this, template(viewModel))

    this._input = Helper.getChild(this._element, "[name=wrapper] > *");
    this._label = Helper.getChild(this._element, "label");
    this._description = Helper.getChild(this._element, "[name=description]");
    $(this._input).append(content);

    // copy the attributes from f-input to actual html element
    var attrs = this._element.attributes
    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i].nodeName == 'label')
        this._label.innerHTML = attrs[i].value;
      else if (attrs[i].nodeName == 'description') {
        this._description.innerHTML = attrs[i].value;
      }
      else if (attrs[i].nodeName != 'style' &&
                attrs[i].nodeName != 'deleted')
        this._input.setAttribute(attrs[i].nodeName, attrs[i].value);
    }

    if (this._element.type == 'datetime') {
      $(this._input).datetimepicker();
    }
  }

  set label(newLabel: string) {
    this._element.setAttribute('label', newLabel);

    if (/\S/.test(newLabel))
      this._label.style.display = "block";
    else
      this._label.style.display = "hide";

    this._label.innerHTML = newLabel;
  }

  set description(newDesc: string) {
    this._element.setAttribute('description', newDesc);
    this._description.innerHTML = newDesc;
  }

  set name(newName: string) {
    this._input.setAttribute('name', newName);
    this._element.setAttribute('name', newName);
  }

  get name(): string {
    return this._input.getAttribute('name')
  }

  set type(newType: string) {
    this._input.setAttribute('type', newType);
    this._element.setAttribute('type', newType);
  }

  get type(): string {
    return this._element.getAttribute('type')
  }

  set value(newValue: string) {
    if (this.type == 'datetime') {
      var strValue = moment(newValue).format('YYYY/MM/DD HH:mm');
      this._input.value = strValue;
    }
    else
      this._input.value = newValue;
  }

  get value(): string {
    return this._input.value;
  }

  set checked(newChecked: boolean) {
    this._input.checked = newChecked;
  }

  get checked(): boolean {
    return this._input.checked;
  }

  set disabled(newDisabled: boolean) {
    this._input.disabled = newDisabled;
  }

  get disabled(): boolean {
    return this._input.disabled;
  }

  set required(newRequired: boolean) {
    this._input.required = newRequired;
  }

  get required(): boolean {
    return this._input.required;
  }

  set deleted(newDeleted: boolean) {
    this._element.setAttribute('deleted', "" + newDeleted);
  }

  get deleted(): boolean {
    return this._element.getAttribute('deleted') === "true";
  }
} // class Input


// @Export
var style    = require('./f-input.scss');
var template = require('./f-input.handlebars');

var InputElement =
    CustomElement.registerElement('f-input', HTMLElement, Input);



export default InputElement;