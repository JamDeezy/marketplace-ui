require('jquery');
require('moment');

module Helper {
  /*
   * Gets first child element with a css selector
   * @param element  - parent node, some sort of HTML element
   * @param selector - css selector for the child
   * @return         - A DOM object (note: not a jQuery object)
   */
  export function getChild(element: any, selector: string): any {
    return $(element).find(selector)[0];
  }

  /*
   * Parses a date time string into a well formatted date string
   * @param dateTime - input date time string
   * @return         - Formatted date string (YYYY/MM/DD HH:mm) (datetimepicker)
   */
  export function parseDateTime(dateTime: string): string {
    return moment(dateTime).format('YYYY/MM/DD HH:mm');
  }

  /*
   * Similar to indexOf array function, only for objects.
   * NOTE: not permutable {a: 1, b: 2} =/= {b: 2, a: 1} (lol javascript)
   * @param arr - Array of objects
   * @param obj - the object in question
   * @return    - Index of the object, -1 if not found
   */
  export function indexOfObject(arr: Array<Object>, obj:Object) {
    for(var i = 0; i < arr.length; i++) {
      if (JSON.stringify(arr[i]) === JSON.stringify(obj))
        return i;
    }
    return -1;
  }

  /*
   * Slow down polling functions (stuff like onscroll events)
   * @param func     - Polling function
   * @param interval - Time inbetween runs
   * @return         - A Function that has been throttled
   */
  export function throttle( func: Function, interval: number ): any {
    var lastCall = 0;
    return function() {
      var now = Date.now();
      if (lastCall + interval < now) {
        lastCall = now;
        return func.apply(this, arguments);
      }
    };
  };

  /*
   * Pjax goto page
   * @param href - path to page
   * @return     - none
   */
  export function pjaxGoToPage(href: string) {
    $.pjax({ url: href, container: '#pjax-container' });
  }
}

export default Helper