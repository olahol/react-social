;(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("react"));
  } else if (typeof define === "function" && define.amd) {
    define(["react"], factory);
  } else {
    root.ReactSocial = factory(root.React);
  }
})(this, function (React) {
  "use strict";

  var isBrowser = function () {
    return !(typeof document === "undefined" || typeof window === "undefined");
  };

  var spread = function (obj, omit) {
    var clone = React.__spread({}, obj);

    omit.forEach(function (key) {
      delete clone[key];
    });

    return clone;
  };

  var jsonp = function (url, cb) {
    var now = +new Date(),
      id = now + "_" + Math.floor(Math.random()*1000);

    var script = document.createElement("script"),
      callback = "jsonp_" + id,
      query = url.replace("@", callback);

    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", query);
    document.body.appendChild(script);

    window[callback] = cb;
  };


  /* Caputre VKontake callbacks */
  var vkCallbacks = {};

  var hookVKCallback = function () {
    if (!isBrowser()) { return; }

    if (!window.VK) {
      window.VK = {};
    }

    if (!window.VK.Share) {
      window.VK.Share = {};
    }

    var oldCount = window.VK.Share.count;

    window.VK.Share.count = function (index, count) {
      if (typeof vkCallbacks[index] === "function") {
        return vkCallbacks[index](count);
      }

      if (typeof oldCount === "function") {
        oldCount(index, count);
      }
    };
  };

  var captureVKCallback = function (index, cb) {
    vkCallbacks[index] = cb;
  };

  hookVKCallback();

  var exports = {};

  var Count = {
    propTypes: {
      element: React.PropTypes.string
      , url: React.PropTypes.string
    }

    , getDefaultProps: function () {
      var location = "";

      if (isBrowser()) {
        location = window.location;
      }

      return {
        url: location
        , element: "span"
      };
    }

    , getInitialState: function () {
      return {
        count: 0
      };
    }

    , componentWillMount: function () {
      this.updateCount();
    }

    , componentWillReceiveProps: function (nextProps) {
      if (this.props.url !== nextProps.url) {
        this.setState({
          count: 0
        }, function () {
          this.updateCount();
        });
      }
    }

    , updateCount: function () {
      if (!isBrowser()) {
        return ;
      }

      if (typeof this.fetchCount === "function") {
        return this.fetchCount(function (count) {
          this.setState({ count: count });
        }.bind(this));
      }

      var url = this.constructUrl();

      jsonp(url, function (data) {
        this.setState({
          count: this.extractCount(data)
        });
      }.bind(this));
    }

    , getCount: function () {
      return this.state.count;
    }

    , render: function () {
      return React.createElement(
        this.props.element
        , spread(this.props, ["element", "url"])
        , this.state.count
      );
    }
  };

  var Button = {
    propTypes: {
      element: React.PropTypes.string
      , url: React.PropTypes.string
      , media: React.PropTypes.string
      , message: React.PropTypes.string
      , onClick: React.PropTypes.func
    }

    , getDefaultProps: function () {
      var location = "";

      if (isBrowser()) {
        location = window.location;
      }

      return {
        element: "button"
        , url: location
        , media: ""
        , message: ""
        , onClick: function () { }
      };
    }

    , click: function (e) {
      this.props.onClick(e);
      if (isBrowser()) {
        var result = this.constructUrl();

        if (typeof result === "object") {
          var url = result[0]
          var target = result[1]
        } else {
          var url = result
          var target = "_blank"
        }

        console.log("Opening URL", url, "with target", target)
        window.open(url, target);
      }
    }

    , render: function () {
      var other = spread(this.props, ["onClick", "element", "url"]);

      return React.createElement(
        this.props.element
        , React.__spread({ "onClick": this.click }, other)
      );
    }
  };

  /* Counts */
  exports.FacebookCount = React.createClass({
    mixins: [Count]

    , constructUrl: function () {
      var fql = encodeURIComponent("select like_count, share_count from link_stat where url = '" + this.props.url + "'")
        , url = "https://api.facebook.com/method/fql.query?format=json&callback=@&query=" + fql;

      return url;
    }

    , extractCount: function (data) {
      if (!data[0]) { return 0; }

      return data[0].like_count + data[0].share_count;
    }
  });

  exports.PinterestCount = React.createClass({
    mixins: [Count]

    , constructUrl: function () {
      return "https://api.pinterest.com/v1/urls/count.json?callback=@&url="
             + encodeURIComponent(this.props.url);
    }

    , extractCount: function (data) {
      return data.count || 0;
    }
  });

  exports.VKontakteCount = React.createClass({
    mixins: [Count]

    , fetchCount: function (cb) {
      var index = Math.floor(Math.random() * 10000)
      var url = "https://vkontakte.ru/share.php?act=count&index=" + index + "&url=" + encodeURIComponent(this.props.url);
      captureVKCallback(index, cb);
      jsonp(url);
    }
  });

  /* Buttons */
  exports.FacebookButton = React.createClass({
    mixins: [Button]

    , constructUrl: function () {
      return "https://www.facebook.com/dialog/feed?"
             + "app_id=145634995501895"
             + "&display=popup&caption=" + encodeURIComponent(this.props.message)
             + "&link=" + encodeURIComponent(this.props.url)
             + "&redirect_uri=" + encodeURIComponent("https://www.facebook.com/")
    }
  });

  exports.TwitterButton = React.createClass({
    mixins: [Button]

    , constructUrl: function () {
      var msg = this.props.message === "" ?
        this.props.url : this.props.message + " " + this.props.url;
      return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(msg);
    }
  });

  exports.EmailButton = React.createClass({
    mixins: [Button]

    , constructUrl: function () {
      return [
        "mailto:?subject=" + encodeURIComponent(this.props.message)
             + "&body=" + encodeURIComponent(this.props.url),
        "_self"
      ]
    }
  });

  exports.PinterestButton = React.createClass({
    mixins: [Button]

    , propTypes: {
      media: React.PropTypes.string.isRequired
    }

    , constructUrl: function () {
      var url = "https://pinterest.com/pin/create/button/?url="
                + encodeURIComponent(this.props.url) + "&media="
                + encodeURIComponent(this.props.media);
      return url;
    }
  });

  exports.VKontakteButton = React.createClass({
      mixins: [Button]

    , constructUrl: function () {
        return "http://vk.com/share.php?url=" + encodeURIComponent(this.props.url);
    }
  });

  return exports;
});
