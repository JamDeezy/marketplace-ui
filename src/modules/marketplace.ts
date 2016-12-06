import $ = require('jquery');

module CustomElements {

  export function getPropertyDescriptor(obj: Object, prop: string):
      PropertyDescriptor {
    for (var proto = obj; proto ; proto = Object.getPrototypeOf(proto)) {
      var desc = Object.getOwnPropertyDescriptor(proto, prop);
      if (desc)
        return desc;
    }
    return undefined;
  }

  export function getProperties(obj: Object):
      string[] {
    var properties: string[] = [];
    for (var proto = obj; proto; proto = Object.getPrototypeOf(proto)) {
      Object.getOwnPropertyNames(proto).forEach((property) => {
        if (properties.indexOf(property) === -1)
          properties.push(property);
      });
    }
    return properties
  }

  export function getFullPrototype(proto: Object): PropertyDescriptorMap {
    return getProperties(proto).reduce(
        (map: PropertyDescriptorMap, prop: string) => {
          map[prop] = getPropertyDescriptor(proto, prop);
          return map;
        }, <PropertyDescriptorMap>{}
    );
  }

  export function registerElement(elName: string, elBase: Function,
    el: Function, elExtend?: string): void {
    var options: webcomponents.CustomElementInit = {
      prototype: Object.create(elBase.prototype, getFullPrototype(el.prototype))
    };
    if (elExtend)
      options.extends = elExtend;
    // registerElement is not yet registered in typescript's default types
    return (<any>document).registerElement(elName, options);
  }

  export function registered(elName: string): boolean {
    switch (document.createElement(elName).constructor) {
      case HTMLElement: return false;
      case HTMLUnknownElement: return undefined;
    }
    return true;
  }

  export function insertFragment(el: any, html: string) {
    try {
      el.appendChild(document.createRange().createContextualFragment(html));
    } catch(e) {
      // Catch case for Safari
      el.insertAdjacentHTML("beforeend", html);
    }
  }

  export function getChild(parent, selector): any {
    return $(parent).find(selector);
  }

}

export default CustomElements;