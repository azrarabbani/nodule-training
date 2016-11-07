 + This folder contains sample functional tests demonstrating the the use of [NemoJS](https://github.com/paypal/nemo) test automation framework.
 + Nemo is a thin wrapper around selenium JS webdriver and provides a plugin based architecture to incorporate custom features to your tests.
 + The tests are configured via the gurnt task present [here](../../tasks/loopmocha.js) and can be excuted via "grunt loopmocha" commmand.
+ The tests should run out of the box using Chrome driver or PhantomJS driver as long as these drivers are available in the path. Steps to install these drivers are available [here](https://github.com/paypal/nemo-docs/blob/master/driver-setup.md).
+ Please note that the tests do not demonstarte the full functionality of the framework and are meant as a starting point for users. Please refer to the links below for a list of all the features and sample usage.

Links:

* [Nemo github repo](https://github.com/paypal/nemo)
* [Nemo JAWS plugin](https://github.paypal.com/NodeTestTools/nemo-jaws)
* [Wallet app nemo tests](https://github.paypal.com/ConsumerWeb-R/walletexpnodeweb/tree/develop/tests/functional/jsTests)
* [Consumer onboarding app nemo tests](https://github.paypal.com/ConsumerWeb-R/consonbdnodeweb/tree/develop/test/functional/jsTests)
* [Sample jenkins job to execute the tests as part of CI](http://nodeinfra-ci-6261.ccg21.dev.paypalcorp.com/view/test-app-CI/job/nodejstestapp_tests)