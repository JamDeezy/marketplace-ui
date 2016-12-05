if ('registerElement' in document) {
  console.log("Woohoo! Browser has native WC support!");
} else {
  require('vendors/webcomponents-lite.min.js')
}

require('stylesheets/reset.scss');

require('lib/f-marketplace-server');
require('lib/f-breadcrumbs');