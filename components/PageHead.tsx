import Head from 'next/head'
import * as React from 'react'
import * as types from 'lib/types'

// TODO: remove duplication between PageHead and NotionPage Head

export const PageHead: React.FC<types.PageProps> = ({ site }) => {
  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no'
      />

      {site?.description && (
        <>
          <meta name='description' content={site.description} />
          <meta property='og:description' content={site.description} />
        </>
      )}

      <meta name='theme-color' content='#3d5a80' />
      <meta property='og:type' content='website' />
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=G-D0S0ZYJD28`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D0S0ZYJD28', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </Head>
  )
}
