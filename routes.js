const routes = require('next-routes')();
// by placing the () after require('next-routes'), the function require returns a function that is called inmediately.

// routes.add receives as first argument a pattern, with the wildcard expressed as : and followed by a name-variable
// that will be passed to the component (in our case below is :address)
// the second argument is the component that should be called
// Plus we add BEFORE specific routing for /campaigns/new as we don't want it to be considered in the wildcard expression
routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show');


// the routes object contains helpers to facilitate navigation
module.exports = routes;
