# react-social

> Simple [React](http://facebook.github.io/react/index.html) components for
> social (Facebook, Twitter and Pinterest) buttons and social counts.

## Install

```bash
npm install react-social --save
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

## Count (FacebookCount, TwitterCount, PinterestCount) API

### Props

##### element

Change the element the component renders into default is span.

##### url

The url you want to get the count of, default is `window.location`.

### Methods

##### getCount()

Return the social count.

## Button (FacebookButton, TwitterButton, PinterestButton) API

### Props

##### element

Change the element the component renders into default is button.

##### url

The url you want to share, default is `window.location`.

##### media (required for Pinterest)

Url of an image, required for PinterestButton.

## Styles

The components pass their props down to their element including `className` and
`style`.


---

MIT Licensed
