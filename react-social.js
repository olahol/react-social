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

  var assign = function(dest, src) {
    for (var key in src) {
      dest[key] = src[key];
    }

    return dest;
  };

  var spread = function (obj, omit) {
    var clone = assign({}, obj);

    omit.forEach(function (key) {
      delete clone[key];
    });

    return clone;
  };

  var jsonp = function (url, cb) {
    cb = cb || function () { };
    var called = false;
    var now = +new Date(),
      id = now + "_" + Math.floor(Math.random()*1000);

    var script = document.createElement("script"),
      callback = "jsonp_" + id,
      query = url.replace("@", callback);

    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", query);
    document.body.appendChild(script);

    setTimeout(function () {
      if (!called) {
        called = true;
        cb(new Error("jsonp timeout"));
      }
    }, 10000);

    window[callback] = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift(null);
      if (!called) {
        called = true;
        cb.apply(this, args);
      }
    };
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
    displayName: "Count"

    , propTypes: {
      element: React.PropTypes.string
      , url: React.PropTypes.string
    }

    , getDefaultProps: function () {
      var location = "";

      if (isBrowser()) {
        location = window.location.href;
      }

      return {
        url: location
        , element: "span"
        , onCount: function () { }
      };
    }

    , getInitialState: function () {
      return {
        count: 0
      };
    }

    , componentDidMount: function () {
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

    , componentDidUpdate: function () {
      this.props.onCount(this.state.count);
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

      jsonp(url, function (err, data) {
        if (err) {
          console.warn("react-social: jsonp timeout for url " + url);
          return this.setState({count: 0});
        }

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
    displayName: "Button"

    , propTypes: {
      element: React.PropTypes.string
      , url: React.PropTypes.string
      , media: React.PropTypes.string
      , message: React.PropTypes.string
      , onClick: React.PropTypes.func
      , target: React.PropTypes.string
      , _open: React.PropTypes.bool
    }

    , getDefaultProps: function () {
      var location = "";

      if (isBrowser()) {
        location = window.location.href;
      }

      return {
        element: "button"
        , url: location
        , media: ""
        , message: ""
        , onClick: function () { }
        , _open: true
      };
    }

    , click: function (e) {
      var url = this.constructUrl();
      var target = this.props.target;
      this.props.onClick(e, url, target);
      if (isBrowser() && this.props._open) {
        window.open(url, target);
      }
    }

    , render: function () {
      var other = spread(this.props, ["onClick", "element", "url"]);

      return React.createElement(
        this.props.element
        , assign({ "onClick": this.click }, other)
      );
    }
  };

  var DefaultBlankTarget = {
    getDefaultProps: function () {
      return {target: "_blank"};
    }
  };

  /* Counts */
  exports.FacebookCount = React.createClass({
    displayName: "FacebookCount"

    , mixins: [Count]

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
    displayName: "TwitterCount"

    , mixins: [Count]

    , constructUrl: function () {
      return "https://count.donreach.com/?callback=@&url=" + encodeURIComponent(this.props.url) + "&providers=all";
    }

    , extractCount: function (data) {
      return data.shares.twitter || 0;
    }
  });

  exports.GooglePlusCount = React.createClass({
    displayName: "GooglePlusCount"

    , mixins: [Count]

    , constructUrl: function () {
      return "https://count.donreach.com/?callback=@&url=" + encodeURIComponent(this.props.url) + "&providers=google";
    }

    , extractCount: function (data) {
      return data.shares.google || 0;
    }
  });

  exports.PinterestCount = React.createClass({
    displayName: "PinterestCount"

    , mixins: [Count]

    , constructUrl: function () {
      return "https://api.pinterest.com/v1/urls/count.json?callback=@&url="
             + encodeURIComponent(this.props.url);
    }

    , extractCount: function (data) {
      return data.count || 0;
    }
  });

  exports.LinkedInCount = React.createClass({
    displayName: "LinkedInCount"

    , mixins: [Count]

    , constructUrl: function () {
      return "https://www.linkedin.com/countserv/count/share?url=" + encodeURIComponent(this.props.url) + "&callback=@&format=jsonp";
    }

    , extractCount: function (data) {
      return data.count || 0;
    }
  });

  exports.RedditCount = React.createClass({
    displayName: "RedditCount"

    , mixins: [Count]

    , constructUrl: function () {
      return "https://www.reddit.com/api/info.json?jsonp=@&url=" + encodeURIComponent(this.props.url);
    }

    , extractCount: function (data) {
      var count = 0;
      var chs = data.data.children;

      for (var i = 0; i < chs.length; i++) {
        count += chs[i].data.score;
      }

      return count;
    }
  });

  exports.VKontakteCount = React.createClass({
    displayName: "VKontakteCount"

    , mixins: [Count]

    , fetchCount: function (cb) {
      var index = Math.floor(Math.random() * 10000)
      var url = "https://vkontakte.ru/share.php?act=count&index=" + index + "&url=" + encodeURIComponent(this.props.url);
      captureVKCallback(index, cb);
      jsonp(url);
    }
  });


  exports.TumblrCount = React.createClass({
    displayName: "TumblrCount"

    , mixins: [Count]

    , constructUrl: function () {
      return "http://api.tumblr.com/v2/share/stats?url="
             + encodeURIComponent(this.props.url) + "&callback=@";
    }

    , extractCount: function (data) {
      return data.response.note_count || 0;
    }
  });

  exports.PocketCount = React.createClass({
    displayName: "PocketCount"

    , mixins: [Count]

    , constructUrl: function () {
      return "https://count.donreach.com/?callback=@&url=" + encodeURIComponent(this.props.url) + "&providers=pocket";
    }

    , extractCount: function (data) {
      return data.shares.pocket || 0;
    }
  });

  /* Buttons */
  exports.FacebookButton = React.createClass({
    displayName: "FacebookButton"

    , mixins: [Button, DefaultBlankTarget]

    , propTypes: {
      appId: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ])
    }

    , constructUrl: function () {
      return "https://www.facebook.com/dialog/feed?"
             + "app_id=" + encodeURIComponent(this.props.appId)
             + "&display=popup&caption=" + encodeURIComponent(this.props.message)
             + "&link=" + encodeURIComponent(this.props.url)
             + "&redirect_uri=" + encodeURIComponent("https://www.facebook.com/")
    }
  });

  exports.TwitterButton = React.createClass({
    displayName: "TwitterButton"

    , mixins: [Button, DefaultBlankTarget]

    , constructUrl: function () {
      var msg = this.props.message === "" ?
        this.props.url : this.props.message + " " + this.props.url;
      return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(msg);
    }
  });

  exports.EmailButton = React.createClass({
    displayName: "EmailButton"

    , mixins: [Button]

    , getDefaultProps: function () {
      return {target: "_self"};
    }

    , constructUrl: function () {
      return "mailto:?subject=" + encodeURIComponent(this.props.message) + "&body=" + encodeURIComponent(this.props.url);
    }
  });

  exports.PinterestButton = React.createClass({
    displayName: "PinterestButton"

    , mixins: [Button, DefaultBlankTarget]

    , propTypes: {
      media: React.PropTypes.string.isRequired
    }

    , constructUrl: function () {
      var url = "https://pinterest.com/pin/create/button/?url="
                + encodeURIComponent(this.props.url) + "&media="
                + encodeURIComponent(this.props.media) + "&description="
                + encodeURIComponent(this.props.message);
      return url;
    }
  });

  exports.VKontakteButton = React.createClass({
    displayName: "VKontakteButton"

    , mixins: [Button, DefaultBlankTarget]

    , constructUrl: function () {
        return "http://vk.com/share.php?url=" + encodeURIComponent(this.props.url);
    }
  });

  exports.GooglePlusButton = React.createClass({
    displayName: "GooglePlusButton"

    , mixins: [Button, DefaultBlankTarget]

    , constructUrl: function () {
        return "https://plus.google.com/share?url=" + encodeURIComponent(this.props.url);
    }
  });

  exports.RedditButton = React.createClass({
    displayName: "RedditButton"

    , mixins: [Button, DefaultBlankTarget]

    , constructUrl: function () {
        return "https://www.reddit.com/submit?url=" + encodeURIComponent(this.props.url);
    }
  });

  exports.LinkedInButton = React.createClass({
    displayName: "LinkedInButton"

    , mixins: [Button, DefaultBlankTarget]

    , constructUrl: function () {
      return "https://www.linkedin.com/shareArticle?url=" + encodeURIComponent(this.props.url);
    }
  });

  exports.XingButton = React.createClass({
    displayName: "XingButton"

    , mixins: [Button, DefaultBlankTarget]

    , constructUrl: function () {
      return "https://www.xing.com/app/user?op=share;url=" + encodeURIComponent(this.props.url) + ";title=" + encodeURIComponent(this.props.message);
    }
  });

  exports.TumblrButton = React.createClass({
    displayName: "TumblrButton"

    , mixins: [Button, DefaultBlankTarget]

    , constructUrl: function () {
      return "https://www.tumblr.com/widgets/share/tool?posttype=link&title=" + encodeURIComponent(this.props.message) + "&content=" + encodeURIComponent(this.props.url) + "&canonicalUrl=" + encodeURIComponent(this.props.url) + "&shareSource=tumblr_share_button";
    }
  });

  exports.PocketButton = React.createClass({
    displayName: "PocketButton"

    , mixins: [Button, DefaultBlankTarget]

    , constructUrl: function () {
      return "https://getpocket.com/save?url=" + encodeURIComponent(this.props.url) + "&title=" + encodeURIComponent(this.props.message);
    }
  });

  return exports;
});
