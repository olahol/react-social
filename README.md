# react-social

> Simple [React](http://facebook.github.io/react/index.html) components for
> social (Facebook, Twitter and Pinterest) buttons and social counts.

## Install

```bash
npm install react-tagsinput --save
```

## Example

```javascript
var FacebookButton = require("./react-social").FacebookButton
  , FacebookCount = require("./react-social").FacebookCount;

var App = React.createClass({
  render: function () {
    var url = "https://github.com";

    return (
      <FacebookButton url={url}>
        <FacebookCount url={url} />
        {" Share " + url}
      </FacebookButton>
    );
  }
});
```

## Button API
### Props
##### url
##### media (required for Pinterest)
### Methods

## Count API
### Props
##### url
### Methods
##### getCount

---

MIT Licensed
