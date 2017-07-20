var React = require("react");
var ReactDom = require("react-dom");
var ReactSocial = require("./react-social");
var test = require("tape");
var $ = require("jquery");

var testUrl = "http://github.com";

function newNode() {
  var node = document.createElement("div");
  document.body.appendChild(node);
  return node;
}

function render(comp, props) {
  var node = newNode();
  props = props || {};
  props.className = "test";
  props.url = testUrl;
  ReactDom.render(React.createElement(comp, props), node);
  return $(node).find(".test");
}

function testCount(t, str, wait) {
  wait = wait || 2000;
  var comp = ReactSocial[str];
  t.equal(comp.displayName, str, "display name and comp name should be equal");

  setTimeout(function () {
    var $el = render(comp, {onCount: function (count) {
      var countText = parseInt($el.text(), 10);
      t.equal(count, countText);
    }});
  });

  return 2;
}

function testButton(t, str, _blank) {
  var comp = ReactSocial[str];
  _blank = _blank || "_blank";
  t.equal(comp.displayName, str, "display name and comp name should be equal");

  setTimeout(function () {
    var $el = render(comp, {_open: false, onClick: function (e, url, target) {
      t.equal(target, _blank);
    }, appId: 1});
    $el.click();
    t.equal($el[0].nodeName, "BUTTON");
  });

  return 3;
}

// Counts
test("FacebookCount", function (t) {
  t.plan(testCount(t, "FacebookCount"));
});

test("TwitterCount", function (t) {
  t.plan(testCount(t, "TwitterCount"));
});

test("GooglePlusCount", function (t) {
  t.plan(testCount(t, "GooglePlusCount"));
});

test("PinterestCount", function (t) {
  t.plan(testCount(t, "PinterestCount"));
});

test("LinkedInCount", function (t) {
  t.plan(testCount(t, "LinkedInCount"));
});

test("RedditCount", function (t) {
  t.plan(testCount(t, "RedditCount"));
});

test("VKontakteCount", function (t) {
  t.plan(testCount(t, "VKontakteCount"));
});

test("TumblrCount", function (t) {
  t.plan(testCount(t, "TumblrCount"));
});

test("PocketCount", function (t) {
  t.plan(testCount(t, "PocketCount"));
});

// Buttons
test("FacebookButton", function (t) {
  t.plan(testButton(t, "FacebookButton"));
});

test("OdnoklassnikiButton", function (t) {
  t.plan(testButton(t, "OdnoklassnikiButton"));
});

test("MyMailRuButton", function (t) {
  t.plan(testButton(t, "MyMailRuButton"));
});

test("TwitterButton", function (t) {
  t.plan(testButton(t, "TwitterButton"));
});

test("GooglePlusButton", function (t) {
  t.plan(testButton(t, "GooglePlusButton"));
});

test("PinterestButton", function (t) {
  t.plan(testButton(t, "PinterestButton"));
});

test("LinkedInButton", function (t) {
  t.plan(testButton(t, "LinkedInButton"));
});

test("RedditButton", function (t) {
  t.plan(testButton(t, "RedditButton"));
});

test("VKontakteButton", function (t) {
  t.plan(testButton(t, "VKontakteButton"));
});

test("EmailButton", function (t) {
  t.plan(testButton(t, "EmailButton"));
});

test("XingButton", function (t) {
  t.plan(testButton(t, "XingButton"));
});

test("TumblrButton", function (t) {
  t.plan(testButton(t, "TumblrButton"));
});

test("PocketButton", function (t) {
  t.plan(testButton(t, "TumblrButton"));
});
