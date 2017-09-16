# react-social

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][dep-image]][dep-url]
[![Download Count][downloads-image]][downloads-url]

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
      <FacebookButton url={url} appId={appId}>
        <FacebookCount url={url} />
        {" Share " + url}
      </FacebookButton>
    );
  }
}
```

## Count  API

**WARNING: `GooglePlusCount`, `TwitterCount` and `PocketCount` uses the
[donreach API](http://donreach.com/social-share-count) which has a limit
of 1000 request per day, if you have an alternative please do not hesitate
to make a PR**

- FacebookCount
- TwitterCount
- GooglePlusCount
- PinterestCount
- LinkedInCount
- RedditCount
- VKontakteCount
- TumblrCount
- PocketCount

### Props

##### element

Change the element the component renders into, default is `span`.

##### url

The url you want to get the count of, default is `window.location`.

##### token

- FacebookButton

Optional access token.

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
-  XingButton
-  TumblrButton
-  PocketButton
-  OdnoklassnikiButton
-  MyMailRuButton

### Props

##### element

Change the element the component renders into, default is `button`.

##### url

The url you want to share, default is `window.location`.

##### target

The target you want to open, default is `_blank`.

##### windowOptions

Pass options to `window.open`.

##### message

- TwitterButton
- FacebookButton
- XingButton
- TumblrButton
- PocketButton
- VKButton
- PinterestButton (required)
- OdnoklassnikiButton (required)
- MyMailRuButton (required)

A message that's prepended before the url.

##### title

- VKButton
- RedditButton
- LinkedInButton
- OdnoklassnikiButton (required)
- MyMailRuButton (required)

Title of your shared content.

##### media

- PinterestButton (required)
- FacebookButton (optional)
- OdnoklassnikiButton (required)
- MyMailRuButton (required)

Url of an image.

##### appId

- FacebookButton (required)

Facebook app id.

##### sharer

- FacebookButton

Facebook has 2 different share dialogs. By default we're showing Feed
Dialog which has more options, but supports only sharing to user's
feed. You can set `sharer` option to `true` and we'll show Share Dialog
where user can choose between their feed and also pages they have
access to.

## Styles

There are no styles included, the components pass all their props down
to their element like `className` and `style` so you can easily style
them yourself.

## Notice

* When rendered server side counts will be 0 since they depend on JSONP.
* `GooglePlusCount`, `TwitterCount` and `PocketCount` uses the donreach API which has a limit of 1000 requests per day.

## Contributors

* Ola Holmström (@olahol)
* Alexandr Sugak (@AlexSugak)
* Jon Principe (@jprincipe)
* Jean-Baptiste Quenot (@jbq)
* Kurt Weiberth (@kweiberth)
* Bartek Gruszka (@bartekgruszka)
* Josh Owens (@queso)
* Maxime Mezrahi (@maxs15)
* Arvin Tehrani (@arvinkx)
* Dennis Stücken (@dstuecken)
* Jonas (@jonashaefele)
* River Kanies (@riverKanies)
* Pavel Linkesch (@orthes)
* Vincent (@vkammerer)
* Alexey Balmasov (@balmasich)
* Amitom (@Amitom)
* Ryan Nevius (@rnevius)
* David Lakata (@dlakata)
* Roman Kosovichev (@roma-so)
* Igor Pnev (@exdeniz)
* Belevskij Sergeij (@r72cccp)


---

MIT Licensed

[npm-image]: https://img.shields.io/npm/v/react-social.svg?style=flat-square
[npm-url]: https://npmjs.org/package/react-social
[downloads-image]: http://img.shields.io/npm/dm/react-social.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/react-social
[travis-image]: https://img.shields.io/travis/olahol/react-social/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/olahol/react-social
[dep-image]: https://david-dm.org/olahol/react-social/peer-status.svg?style=flat-square
[dep-url]: https://david-dm.org/olahol/react-social
