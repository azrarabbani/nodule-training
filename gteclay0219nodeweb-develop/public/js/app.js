'use strict';


require(['config'], function (config) {
    require([ /* Your modules */ ], function() {
        // Code here
        // set a flag to indicate your application is fully ready for interaction
        window.readyToGo = false;
        //simulate some pre-loading of assets, building of views, etc.
        window.setTimeout(function () {
            window.readyToGo = true;
        }, 2000);
    });
});
