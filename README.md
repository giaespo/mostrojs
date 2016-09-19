mostrojs is a new way to develop applications in javascript
-----------------------------------------------------------

###It depends on:

1. handlebar.js for template engine;

2. unify.js for objects unification;

3. jquery only for retrieving templates from folders.(maybe it will be removed in the future ).

best use cases of mostrojs:
===========================

1)Asynchronous calls coordination.
----------------------------------

in modern javascript we have to manage dozens of asynchronous calls, especially when we create single page website.
Because of this, we see the proliferation of callbacks that inside them have asynchronous calls too.
This produces a spaghetti code that is very difficult to maintain.
If we add WebWorkers that communicate with the main thread, it is the delirium!

Monster js simplifies this by pulling the business logic from the callback, in what way?
Callbacks have only one task in mostrojs, asserting facts, or better change the status of the application.
the logic is handled only by the rules engine.

**for example:**

suppose we have an asynchronous function, in mostrojs callbacks of this function will simply assert a fact
with the new status for the system.

`function callback(data) {Engine.assertFact (data)}`

after this will be the rules engine that will take care of handling these data in some way, according to business rules logic
coded into the application.

`BLRule = {
left: [data]
right: [BLAction1, BLAction2 ...]
debug: []
}`

This system is very scalable, for example to coordinate 2 or more asynchronous calls.
 In order to do something only after receiving data from all, the way of do it remains unchanged, the calbacks continue to only assert facts, while the rules of the system will take care of the application logic.

`function callback1 (data1) {Engine.assertFact (data1)}`

`BLRule = {
left: [data,data1]
right: [BLAction1, BLAction2 ...]
debug: []
}`

The same happens using WebWorkers. In this case the worker will send a message to the main thread that will assert a new fact with the received data.

Note that the business logic rules are much more readable than js code written in spaghetti code, the semantics of the rule is easy to interpret.

*I added a simple example which shows performance and coordination of multithread application.
The example can run only under a web server.
You can run python simple web server "python -m SimpleHTTPServer 8008" in the mostrojs folder and then from 127.0.0.1:8008, navigate to examples/index.html page.*
