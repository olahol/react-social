# react-social

> Simple [React](http://facebook.github.io/react/index.html) components for
> social (Facebook, VKontakte and Pinterest) buttons and counts.

## Install

```bash
npm install react-social --save
```

## Example

```javascript
import { FacebookButton, FacebookCount } from "react-social";

class App {
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

## Count (FacebookCount,  PinterestCount, VKontakteCount) API

### Props

##### element

Change the element the component renders into, default is `span`.

##### url

The url you want to get the count of, default is `window.location`.

### Methods

##### getCount()

Return the social count.

## Button (FacebookButton, TwitterButton, LinkedInButton, PinterestButton, GooglePlusButton, RedditButton, VKontakteButton, EmailButton) API

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

## Styles

There are no styles included, the components pass all their props down
to their element like `className` and `style` so you can easily style
them yourself.


## Notice

When rendered server side all counts will be 0 since they depend on jsonp.

## Contributors

* Ola Holmström (@olahol)
* Alexandr Sugak (@AlexSugak)
* Jon Principe (@jprincipe)
* Jean-Baptiste Quenot (@jbq)
* Kurt Weiberth (@kweiberth)
* Bartek Gruszka (@bartekgruszka)


---

MIT Licensed
