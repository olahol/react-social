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

  if (typeof document === "undefined" || typeof window === "undefined") {
    throw new Error("react-social uses jsonp and requires a browser environment");
  }

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

  var exports = {};

  var Count = {
    getDefaultProps: function () {
      return {
        url: window.location
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
    getDefaultProps: function () {
      return {
        element: "button"
        , url: window.location
        , onClick: function () { }
      };
    }

    , click: function (e) {
      this.props.onClick(e);
      window.open(this.constructUrl(), "_blank");
    }

    , render: function () {
      var other = spread(this.props, ["onClick", "element", "url"]);

      return React.createElement(
        this.props.element
        , React.__spread({ "onClick": this.click }, other)
      );
    }
  };

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

  exports.TwitterCount = React.createClass({
    mixins: [Count]

    , constructUrl: function () {
      return "https://cdn.api.twitter.com/1/urls/count.json?callback=@&url="
             + encodeURIComponent(this.props.url);
    }

    , extractCount: function (data) {
      return data.count || 0;
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

  exports.FacebookButton = React.createClass({
    mixins: [Button]

    , constructUrl: function () {
      return "https://www.facebook.com/sharer/sharer.php?u="
             + encodeURIComponent(this.props.url);
    }
  });

  exports.TwitterButton = React.createClass({
    mixins: [Button]

    , constructUrl: function () {
      return "https://twitter.com/home?status="
             + encodeURIComponent(this.props.url);
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

  return exports;
});
