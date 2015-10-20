# promises-challenge

## What's a promise?

As you already know, when doing web programming you'll often make calls to a
foreign resource that takes some time load. If the browser just stopped and
waited until that thing loaded, the web would seriously be awful to use. So
instead, we program *asynchronously*, which allows us to continue doing other things while we wait for our programs to load.

What's a 'promise' in the world of JavaScript? It's a nicer way of dealing
with callbacks, and handling asychronous code based on a common specification.
The exact specification that all Promise implentations follow is known as
[A+](https://promisesaplus.com). Now that defines what all Promise
specifications have to follow, but many implementations add extra functions
that are very useful.

We'll be using jQuery's promises, because you're already familiar with it,
it's almost always available. Take a look at their [deferred object API](https://api.jquery.com/jquery.deferred/). Their deferred objects are
basically promises, but have slightly more functionality available to them.

## Promise basics

Promises are great, because they're so easy to use!

```js
var p = Promise(); // Not real, just pretend it's a promise

p.then(success, fail);
```

`p` is a promise object, and one of the methods available is then. It takes two
`functions`, a success function and a failure function. So if the promise
failed (like making a web request that returned a 404) it will do whatever
failure does. But if it succeeds, it will do whatever success does. This is a
consise way to specify behaviour asynchronously. Note that failure is optional, and you could instead just pass the success calback.

We can also specify this same behavior with `done()` and `failure()`. Take a look at the following:

```js
p.done(success).fail(fail);
```

It's the exact same as the above! However, `done()` and `fail()` are useful because you can specify multiple callbacks for each situation, not just one:

```js
p.done(success1, success2, successN);
  .fail(failure1, failure2, failureN);
```

In addition, there's `always()`. It, as you might expect, will *always* perform whatever is passed into it, whether the promise succeeds or fails!

```js
p.then(succ, fail).always(doThisNoMatterWhat);
```

So the promise above would either call `succ()` or `fail()`, but it will call `doThisNoMatterWhat()` every time.

## Multiple Promises

The above goes over how to deal with a single promise, but the really cool
part of them is that it's easy to specify complex behavior for groups of
actions by chaining promises together.

### Serial actions

Let's say you want do several things one by one. Like making 3 web requests, that all depend on each other.

```js
var req1 = $.getJSON(something);
var req2 = $.getJSON(somethingElse);
var req3 = $.getJSON(yetAnotherThing);

req1
  .then(req2)
  .then(req3)
  .done(function() {console.log('Everthing is awesome!')});
  .fail(function() {console.log('Oh Noes, there was an error')});
```

What the above does is construct a promise that execute each request one by one, and if any of them fail along the way, then our console will inform us there was an error. The reason this works is because `req` object returns a new promise object, which we can then call more promise methods on!