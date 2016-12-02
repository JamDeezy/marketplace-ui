Overview
========
Marketplace Front End webpack server.


Style and Coding Guidelines
===========================
TypeScript and JavaScript follows [Google's JavaScript guidelines]
(http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).

HTML, Handlebar templates, CSS and SCSS should follow Google's HTML and CSS
guidelines.
[Google's CSS guidelines](http://google-styleguide.googlecode.com/svn/trunk/htmlcssguide.xml).


File Organization
=================
The tree contains the application source code.

    /bin            # Build and development scripts.
    /src            # Source code and assets.
    /tests          # Application tests.


Environment Setup
=================

    npm install
    bower install
    tsd install
    npm start
    ez


Others
========

    webpack         # Builds development file, includes js source map
    tsdclean        # Cleans up typescript typings defined in tsd.json


Packaging
=========
DO NOT RUN THIS

    npm release

