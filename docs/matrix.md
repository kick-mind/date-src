# Support matrix

This page covers what platforms are supported by Luxon and what caveats apply to them.

## Official support

Luxon officially supports the last two versions of the major browsers, with some caveats. The table below shows which of the not-universally-supported features are available in what environments.

| Browser                          | Versions | Zones | Intl basics | Intl tokens | Intl relative time formatting |
| -------------------------------- | -------- | ----- | ----------- | ----------- | ----------------------------- |
| Chrome                           | >= 71    | ✓     | ✓           | ✓           | ✓                             |
|                                  | >= 54    | ✓     | ✓           | ✓           | ✗                             |
| Firefox                          | >= 65    | ✓     | ✓           | ✓           | ✓                             |
| Edge                             | 18       | ✓     | ✓           | ✓           | ✗                             |
|                                  | 16       | ✓     | ✓           | ✗           | ✗                             |
| IE                               | 11       | ✗     | ✓           | ✗           | ✗                             |
|                                  | 10       | ✗     | ✗           | ✗           | ✗                             |
| Safari                           | 11       | ✓     | ✓           | ✓           | ✗                             |
|                                  | 10       | ✓     | ✗           | ✗           | ✗                             |
| iOS Safari (iOS version numbers) | >= 11    | ✓     | ✓           | ✓           | ✗                             |
|                                  | 10       | ✓     | ✗           | ✗           | ✗                             |
|                                  | 9        | ✗     | ✓           | ✗           | ✗                             |
| Node w/ICU                       | >= 12    | ✓     | ✓           | ✓           | ✓                             |
|                                  | >= 8     | ✓     | ✓           | ✓           | ✗                             |
|                                  | 6        | ✗     | ✓           | ✗           | ✗                             |
| Node w/o ICU                     | >= 8     | ✓     | ✗           | ✗           | ✗                             |
|                                  | 6        | ✗     | ✗           | ✗           | ✗                             |

- Those capabilities are explained in the next sections, along with possible polyfill options
- "w/ICU" refers to providing Node with ICU data. See the [install](install.html#node) for instructions

## Internet Explorer and platform polyfills

If you're supporting IE 10 or 11, you need some polyfills just to make Luxon work at all.

With IE 11, you can just add a polyfill like this to get the JS features you need:

```html
<script src="https://cdn.polyfill.io/v2/polyfill.js?features=default,String.prototype.repeat,Array.prototype.find,Array.prototype.findIndex,Math.trunc,Math.sign"></script>
```

That hasn't checked off the other boxes in the chart above though, so keep reading for those.

With IE 10, you have the same problems as IE 11, except that you don't even get basic Intl support. You'll need to tack on the languages you wish to support. See the Basic Internationalization polyfill section below.

Alternatively, you can use a polyfilled build of Luxon, which you can find here:

- [Download full polyfilled build](../../global-filled/luxon.js)
- [Download minified polyfilled build](../../global-filled/luxon.min.js)

These use global polyfills, though, which means newer browsers will be running the injected code too. And the same doesn't-include-intl-and-zone-support caveats apply to it too.

## Effects of missing features

**If the platforms you're targeting has all its boxes above check off, ignore this section**.

In the support table above, you can see that some environments are missing capabilities. They affect a subset of Luxon's features that depend on specific APIs that some older browsers don't support.

1.  **Basic internationalization**. Luxon doesn't have internationalized strings in its code; instead it relies on the hosts implementation of the Intl API. This includes the very handy [toLocaleString](../class/src/datetime.js~DateTime.html#instance-method-toLocaleString). Most browsers and recent versions of Node support this.
2.  **Internationalized tokens**. Listing the months or weekdays of a locale and outputting or parsing ad-hoc formats in non-English locales requires that Luxon be able to programmatically introspect the results of an Intl call. It does this using Intl's [formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts) method, which is a relatively recent addition in most browsers. So you could have the Intl API without having that.
3.  **Zones**. Luxon's support of IANA zones works by abusing the Intl API. That means you have to have that API and that the API must support a reasonable list of time zones. Zones are a recent addition to some platforms.
4.  **Relative time formatting**. Luxon's support for relative time formatting (e.g. `DateTime#toRelative` and `DateTime#toRelativeCalendar`) depends on Intl.RelativeTimeFormat, which is currently only available in Chrome and Firefox. Luxon will fall back to using English if that capability is missing.

If the browser lacks these capabilities, Luxon tries its best:

| Feature                                | Full support | No Intl at all                              | Intl but no formatToParts                          | No IANA zone support | No relative time format |
| -------------------------------------- | ------------ | ------------------------------------------- | -------------------------------------------------- | -------------------- | ----------------------- |
| Most things                            | OK           | OK                                          | OK                                                 | OK                   | OK                      |
| Using explicit time zones              | OK           | Invalid DateTime                            | OK                                                 | Invalid DateTime     | OK                      |
| `DateTime#toLocaleString`              | OK           | Uses English with caveats†                  | OK                                                 | OK                   | OK                      |
| `DateTime#toLocaleParts`               | OK           | Empty array                                 | Empty array                                        | OK                   | OK                      |
| `DateTime#toFormat` in en-US           | OK           | OK                                          | OK                                                 | OK                   | OK                      |
| `DateTime#toFormat` in other locales   | OK           | Uses English                                | Uses English if format contains localized strings‡ | OK                   | OK                      |
| `DateTime#fromFormat` in en-US         | OK           | OK                                          | OK                                                 | OK                   | OK                      |
| `DateTime#toRelative` in en-US         | OK           | OK                                          | OK                                                 | OK                   | OK                      |
| `DateTime#toRelative` in other locales | Uses English | OK                                          | OK                                                 | OK                   | Uses English            |
| `DateTime#offsetNameShort`, etc        | OK           | Returns null                                | OK in most locales§                                | OK                   | OK                      |
| `fromFormat` in other locales          | OK           | Invalid DateTime if uses localized strings‡ | Uses English if format contains localized strings‡ | OK                   | OK                      |
| `Info.months`, etc in en-US            | OK           | OK                                          | OK                                                 | OK                   | OK                      |
| `Info.months`, etc in other locales    | OK           | Uses English                                | Uses English                                       | OK                   | OK                      |

† Specifically, the caveat here is that this English fallback only works as you might expect for Luxon-provided preset arguments, like `DateTime.DATETIME_MED`. If you provide your own, modify the presets, or even clone them, it will use `DateTime.DATETIME_HUGE`. If you don't provide any arguments at all, it defaults to `DateTime.DATE_SHORT`.

‡ This means that Luxon can't parse anything with a word in it like localized versions of "January" or "Tuesday". It's fine with numbers, as long as they're Western numbers.

§ This fallback uses a hack that is not guaranteed to work in every locale in every browser. It's worked where I tested it, though. It will fall back to returning `null` if it fails.

## Polyfills

### Intl

If your platform doesn't have any kind of Intl support (such as IE 10), you need to load them individually through a polyfill. The easiest way to that is like this:

```html
<script src="https://cdn.polyfill.io/v2/polyfill.js?features=Intl.~locale.zh,Intl.~locale.fr"></script>
```

If you're on a platform that already needs other polyfills, just tack those features to the end of your polyfill list.

### Intl tokens

Polyfilling Intl token support is a bit painful. This limitation applies to Edge < 18 and all the IEs. Fortunately, you probably don't need Intl token support!

First, if you don't have Intl at all (e.g. as in IE 10), you are in luck. The polyfills in the previous section will give you Intl token support too!

But more likely, you have basic Intl support but not `formatToParts` (e.g. IE 11 or Edge 16). The problem here is that the polyfill service will ignore the Intl polyfills, so you won't get the support you need. Instead, you need to override all of Intl with the [Intl polyfill](https://github.com/andyearnshaw/Intl.js/) directly. [help wanted: instructions on exactly how to do that]

### Zones

If you have an Intl API (either natively or through the Intl polyfill above) but no zone support, you can add it via the very nice [DateTime format polyfill](https://github.com/yahoo/date-time-format-timezone).

## Older platforms

- **Older versions of both Chrome and Firefox** will most likely work. It's just that I only officially support the last two versions. As you get to older versions of these browsers, the missing capabilities listed above begin to apply to them. (e.g. FF started supporting `formatToParts` in 51 and time zones in 52). I haven't broken that out because it's complicated, Luxon doesn't officially support them, and no one runs them anyway.
- **Older versions of IE** probably won't work at all.
- **Older versions of Node** probably won't work without recompiling Luxon with a different Node target. In which case they'll work with some features missing.

## Other platforms

If the platform you're targeting isn't on the list and you're unsure what caveats apply, you can check which pieces are supported:

```js
Info.features(); //=> { intl: true, intlTokens: true, zones: true, relative: false }
```

Specific notes on other platforms:

- **React Native on (specifically) Android** doesn't come with Intl support, so all the possible-to-be-missing capabilities above are unavailable. Use [jsc-android-buildscripts](https://github.com/SoftwareMansion/jsc-android-buildscripts) to fix it.
