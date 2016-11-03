# Analytics
**This is a simple helper for triggering analytics events in the browser.** It supports sending events to Google Analytics
and Optimizely (via their official snippets). It's super tiny (510 bytes gzipped)!

### Installation
You can get your own copy of Analytics using [npm](https://www.npmjs.com/package/@dosomething/analytics):

```
npm install @dosomething/analytics
```

Include the bundled `dist/Analytics.js` in your page, or require it using a module bundler.

### Usage
You can manually send an event with `Analytics.analyze('category', 'action', 'label')`.

You can also trigger events by setting data attributes on clickable items, or by using the global `analyze()` helper method in an inline script anytime after running `Analytics.init()`:

```html
   <script src="dist/analytics.js"></script> 
   <script type="text/javascript">
     Analytics.init();
   </script>
   

   <!-- Any click on this link will trigger a 'Link:Clicked:Click Me' event. -->
   <a href="#" data-track-category="Link" data-track-action="Clicked" data-track-label="Click Me">Click Me!</a>
   
   <!-- Any page load will trigger a 'Page:Loaded:Demo' event. -->
   <script type="text/javascript">
     analyze('Page', 'Loaded', 'Demo');
   </script>
```

### License
&copy;2016 DoSomething.org. Analytics is free software, and may be redistributed under the terms specified in the [LICENSE](LICENSE) file. The name and logo for DoSomething.org are trademarks of Do Something, Inc and may not be used without permission.
