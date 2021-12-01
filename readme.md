# Next.js Notion Starter Kit

> The perfect starter kit for building websites with Next.js and Notion.

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=bennychan-dev) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Intro

This repo is what I use to power my personal blog / portfolio site.

It uses Notion as a CMS, fetching content from Notion and then uses [Next.js](https://nextjs.org/) and [react-notion-x](https://github.com/NotionX/react-notion-x) to render everything.

The site is then deployed to [Vercel](http://vercel.com).

## Features

- Setup only takes a few minutes ([single config file](./site.config.js)) 💪
- Robust support for Notion content via [react-notion-x](https://github.com/NotionX/react-notion-x)
- Next.js / TS / React / Notion
- Excellent page speeds
- Embedded GitHub comments
- Automatic open graph images
- Automatic pretty URLs
- Automatic table of contents
- Full support for dark mode
- Quick search via CMD+P just like in Notion
- Responsive for desktop / tablet / mobile
- Optimized for Next.js and Vercel

## Setup

**All config is defined in [site.config.js](./site.config.js).**

1. Fork / clone this repo
2. Change a few values in [site.config.js](./site.config.js)
3. `npm install`
4. `npm run dev` to test locally
5. `npm run deploy` to deploy to vercel 💪

I tried to make configuration as easy as possible.

All you really need to do to get started is edit `rootNotionPageId`.

You'll want to make your root Notion page **public** and then copy the link to your clipboard. Then extract the last part of the URL which is your page's Notion ID.

In order to find your Notion workspace ID (optional), just load any of your site's pages into your browser and open up the developer console. There will be a global variable that you can access called `block` which is the Notion data for the current page, and you just have to type `block.space_id` which will print out your page's workspace ID.

I recommend setting up a collection on your home page (optional; I use an inline gallery) that contains all of your articles / projects / content. There are no structural constraints on your Notion workspace, however, so feel free to add content as you would normally in Notion. There are a few parts of the code with logic to only show comments on blog post pages (collection item detail pages).

## URL Paths

The app defaults to slightly different pathnames in dev and prod (though pasting any dev pathname into prod will work and vice-versa).

In development, it will use a slugified version of the page's title suffixed with its Notion ID. I've found that it's really useful to always have the Notion Page ID front and center during local development.

In production, it gets rid of the extra ID clutter.

The mapping of Notion ID to slugified page titles is done automatically for you as part of the build process. Just keep in mind that if you plan on changing page titles over time, you probably want to make sure old links will still work, and we don't currently provide a solution for detecting old links aside from Next.js built-in [support for redirects](https://nextjs.org/docs/api-reference/next.config.js/redirects).

See [mapPageUrl](./lib/map-page-url.ts) and [getCanonicalPageId](https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-canonical-page-id.ts) from for more details.

NOTE: if you have multiple pages in your workspace with the same slugified name, the app will throw an error letting you know that there are duplicate URL pathnames.

## Theming

All CSS styles that customize Notion content are located in [styles/notion.css](./styles/notion.css).

They mainly target global CSS classes exported by react-notion-x [styles.css](https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/styles.css).

It should be pretty easy to customize most styling-related things, especially with local development and hot reload.

### Dark Mode

Dark mode is fully supported and can be toggled via the sun / moon icon in the footer.

## Extras

All extra dependencies are optional -- the project should work just fine out of the box.

If you want to copy some of the fancier elements of my site, then you'll have to set up a few extras.

### Fathom Analytics

[Fathom](https://usefathom.com/ref/42TFOZ) provides a lightweight alternative to Google Analytics.

It's optional, but I really love how simple and elegant their solution is.

To enable analytics, just add a `NEXT_PUBLIC_FATHOM_ID` environment variable.

This environment variable will only be taken into account in production, so you don't have to worry about messing up your analytics with localhost development.

### GitHub Comments

[Utteranc.es](https://utteranc.es/) is an amazing [open source project](https://github.com/utterance/utterances) which enables developers to embed GitHub issues as a comments section on their websites. Genius.

The integration is really simple. Just edit the `utterancesGitHubRepo` config value to point to the repo you'd like to use for issue comments.

You probably want to read through the Utterances docs before enabling this in production, since there are some subtleties around how issues get mapped to pages on your site, but overall the setup was super easy imho and I love the results.

### Preview Images

This is a really cool feature that's inspired by Medium's smooth image loading, where we first load a low quality, blurred version of an image and animate in the full quality version once it loads. It's such a nice effect, but it does add a bit of work to set up.

If `isPreviewImageSupportEnabled` is set to `true`, then the app will compute LQIP images via [lqip-modern](https://github.com/transitive-bullshit/lqip-modern) for all images referenced by your Notion workspace. These will be stored in a Google Firebase collection (as base64 JPEG data), so they only need to be computed once.

You'll have to set up your own Google Firebase instance of Firestore and supply three environment variables:

```bash
# base64-encoded string containing your google credentials json file
GOOGLE_APPLICATION_CREDENTIALS=

# name of your google cloud project
GCLOUD_PROJECT=

# name of the firebase collection to store images in
FIREBASE_COLLECTION_IMAGES=
```

The actual work happens in the [create-preview-image](./api/create-preview-image) serverless function.

### Automatic Social Images

Open Graph images like this one will be generated for each page of your site automatically based each page's content.

Note that you shouldn't have to do anything extra to enable this feature as long as you're deploying to Vercel.

### Automatic Table of Contents

<p align="center">
  <img alt="Smooth ToC Scrollspy" src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fcb2df62d-9028-440b-964b-117711450921%2Ftoc2.gif?table=block&id=d7e9951b-289c-4ff2-8b82-b0a61fe260b1&cache=v2" width="240">
</p>

By default, every article page will have a table of contents displayed as an `aside` on desktop. It uses **scrollspy** logic to automatically update the current section as the user scrolls through your document, and makes it really easy to jump between different sections.

If a page has less than `minTableOfContentsItems` (default 3), the table of contents will be hidden. It is also hidden on the index page and if the browser window is too small.

This table of contents uses the same logic that Notion uses for its built-in Table of Contents block (see [getPageTableOfContents](https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-page-table-of-contents.ts) for the underlying logic and associated unit tests).

## License

Credits to [Travis Fischer](https://transitivebullsh.it)
