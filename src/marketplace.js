if ('registerElement' in document) {
  console.log("Woohoo! Browser has native WC support!");
} else {
  require('vendors/webcomponents-lite.min.js')
}

require('stylesheets/reset.scss');

require('f-breadcrumbs/f-breadcrumbs');
require('f-budget/f-budget');
