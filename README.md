# react-social

> Simple [React](http://facebook.github.io/react/index.html) components for
> social (Facebook, Google, VKontakte, Pinterest ...) buttons and counts.

## Install

```bash
npm install react-social --save
```

## Example

```javascript
import { FacebookButton, FacebookCount } from "react-social";

class App extends Component {
  render {
    let url = "https://github.com";

    return (
      <FacebookButton url={url}>
        <FacebookCount url={url} />
        {" Share " + url}
      </FacebookButton>
    );
  }
}
```

## Count  API

- FacebookCount
- GooglePlusCount
- PinterestCount
- LinkedInCount
- RedditCount
- VKontakteCount

### Props

##### element

Change the element the component renders into, default is `span`.

##### url

The url you want to get the count of, default is `window.location`.

##### onCount

Callback for when the count is updated. Callback takes one argument `count`.

### Methods

##### getCount()

Return the social count.

## Button API

-  FacebookButton
-  TwitterButton
-  GooglePlusButton
-  PinterestButton
-  LinkedInButton
-  RedditButton
-  VKontakteButton
-  EmailButton

### Props

##### element

Change the element the component renders into, default is `button`.

##### url

The url you want to share, default is `window.location`.

##### message (only TwitterButton and FacebookButton)

A message that's prepended before the url, works only with FacebookButton
and TwitterButton.

##### media (required for Pinterest)

Url of an image, is required for PinterestButton and only works with
PinterestButton.

##### appId (only FacebookButton)

Facebook app id.

## Styles

There are no styles included, the components pass all their props down
to their element like `className` and `style` so you can easily style
them yourself.

## Notice

When rendered server side counts will be 0 since they depend on JSONP.

## Contributors

* Ola Holmström (@olahol)
* Alexandr Sugak (@AlexSugak)
* Jon Principe (@jprincipe)
* Jean-Baptiste Quenot (@jbq)
* Kurt Weiberth (@kweiberth)
* Bartek Gruszka (@bartekgruszka)
* Josh Owens (@queso)
* Maxime Mezrahi (@maxs15)


---

MIT Licensed
