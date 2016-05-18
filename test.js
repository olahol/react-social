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

function testCount(t, comp, wait) {
  wait = wait || 2000;

  setTimeout(function () {
    var $el = render(comp, {onCount: function (count) {
      var countText = parseInt($el.text(), 10);
      t.equal(count, countText);
    }});
  });

  return 1;
}

function testButton(t, comp, _blank) {
  _blank = _blank || "_blank";
  setTimeout(function () {
    var $el = render(comp, {_open: false, onClick: function (e, url, target) {
      t.equal(target, _blank);
    }});
    $el.click();
    t.equal($el[0].nodeName, "BUTTON");
  });

  return 2;
}

// Counts
test("FacebookCount", function (t) {
  t.plan(testCount(t, ReactSocial.FacebookCount));
});

test("GooglePlusCount", function (t) {
  t.plan(testCount(t, ReactSocial.GooglePlusCount));
});

test("PinterestCount", function (t) {
  t.plan(testCount(t, ReactSocial.PinterestCount));
});

test("LinkedInCount", function (t) {
  t.plan(testCount(t, ReactSocial.LinkedInCount));
});

test("RedditCount", function (t) {
  t.plan(testCount(t, ReactSocial.RedditCount));
});

test("VKontakteCount", function (t) {
  t.plan(testCount(t, ReactSocial.VKontakteCount));
});

// Buttons
test("FacebookButton", function (t) {
  t.plan(testButton(t, ReactSocial.FacebookButton));
});

test("TwitterButton", function (t) {
  t.plan(testButton(t, ReactSocial.TwitterButton));
});

test("GooglePlusButton", function (t) {
  t.plan(testButton(t, ReactSocial.GooglePlusButton));
});

test("PinterestButton", function (t) {
  t.plan(testButton(t, ReactSocial.PinterestButton));
});

test("LinkedInButton", function (t) {
  t.plan(testButton(t, ReactSocial.LinkedInButton));
});

test("RedditButton", function (t) {
  t.plan(testButton(t, ReactSocial.RedditButton));
});

test("VKontakteButton", function (t) {
  t.plan(testButton(t, ReactSocial.VKontakteButton));
});

test("EmailButton", function (t) {
  t.plan(testButton(t, ReactSocial.EmailButton, "_self"));
});
