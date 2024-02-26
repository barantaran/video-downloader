<div align="center">
<img src="public/icon-128.png" alt="logo"/>
<h1> Chrome Extension Boilerplate with<br/>React + Vite + TypeScript</h1>

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)
![GitHub action badge](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/actions/workflows/build-zip.yml/badge.svg)
<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/Jonghakseo/chrome-extension-boilerplate-react-viteFactions&count_bg=%23#222222&title_bg=%23#454545&title=😀&edge_flat=true" alt="hits"/>


> This project is listed in the [Awesome Vite](https://github.com/vitejs/awesome-vite)

</div>

## Table of Contents

- [Intro](#intro)
- [Features](#features)
- [Installation](#installation)
    - [Procedures](#procedures)
        - [Chrome](#chrome)
        - [Firefox](#firefox)
- [Add Style Library](#add-style-library)
    - [Twind](#twind)
    - [Chakra UI](#chakra-ui)
- [Pages](#pages)
- [Screenshots](#screenshots)
    - [NewTab](#newtab)
    - [Popup](#popup)
    - [Devtools](#devtools)
- [Examples](#examples)
- [Documents](#documents)

## Intro <a name="intro"></a>

This boilerplate is made for creating chrome extensions using React and Typescript.
> The focus was on improving the build speed and development experience with Vite.

## Features <a name="features"></a>

- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vite](https://vitejs.dev/)
- [SASS](https://sass-lang.com/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [Husky](https://typicode.github.io/husky/getting-started.html#automatic-recommended)
- [Commitlint](https://commitlint.js.org/#/guides-local-setup?id=install-commitlint)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)
- [Chrome Extension Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- HRR(Hot Rebuild & Refresh/Reload)

## Installation <a name="installation"></a>

## Procedures: <a name="procedures"></a>

1. Clone this repository.
2. Change `extensionDescription` and `extensionName` in messages.json
3. Install pnpm globally: `npm install -g pnpm` (check your node version >= 16.6, recommended >= 18)
4. Run `pnpm install`

## And next, depending on the needs:

### For Chrome: <a name="chrome"></a>

1. Run:
    - Dev: `pnpm dev` or `npm run dev`
    - Prod: `pnpm build` or `npm run build`
2. Open in browser - `chrome://extensions`
3. Check - `Developer mode`
4. Find and Click - `Load unpacked extension`
5. Select - `dist` folder

### For Firefox: <a name="firefox"></a>

1. Run:
    - Dev: `pnpm dev:firefox` or `npm run dev:firefox`
    - Prod: `pnpm build:firefox` or `npm run build:firefox`
2. Open in browser - `about:debugging#/runtime/this-firefox`
3. Find and Click - `Load Temporary Add-on...`
4. Select - `manifest.json` from `dist` folder

### <i>Remember in firefox you add plugin in temporary mode, that's mean it's disappear after close browser, you must do it again, on next launch.</i>

## Add Style Library <a name="add-style-library"></a>

> IMPORTANT: If you DO NOT want to use css file in the content script, you need to delete the css file in your manifest.js

```js
content_scripts: [
  {
    // YOU NEED TO DELETE THIS
    css: ["assets/css/contentStyle<KEY>.chunk.css"]
  }
];
```

### Chakra UI <a name="chakra-ui"></a>

**1. Install the library:**

```bash
$ pnpm install @chakra-ui/react @emotion/cache @emotion/react
```

**2. You should add the code to `vite.config.ts`
for [Ignore unnecessary warnings](https://github.com/TanStack/query/pull/5161#issuecomment-1506683450)**

<details>
<summary>vite.config.ts</summary>

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      // Add below code ~~~~~
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes(`"use client"`)
        ) {
          return;
        }
        warn(warning);
      },
      // Add above code ~~~~
    },
  },
});
```

</details>

**3. You can use Chakra UI in your project:**

<details>
<summary>src/pages/popup/Popup.tsx</summary>

```tsx
import { Button } from "@chakra-ui/react";

export default function Popup() {
  return <Button colorScheme="teal">Button</Button>;
}
```

</details>

---

> if you don't want to use Chakra UI in the content script, you can skip 4,5 step.

**4. If you want to use Chakra UI in the content script, you need to add the following code:**

<details>
<summary>src/pages/content/ui/CustomChakraProvider.tsx</summary>

```tsx
import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  ColorMode,
  ColorModeContext,
  ColorModeScript,
  CSSReset,
  extendTheme,
  GlobalStyle,
  ThemeProvider
} from "@chakra-ui/react";

const theme = extendTheme();

const getCurrentTheme = () => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return isDark ? "dark" : "light";
};

type CustomChakraProviderProps = {
  shadowRootId: string;
  children: ReactNode;
};
export default function CustomChakraProvider({ children, shadowRootId }: CustomChakraProviderProps) {
  const [colorMode, setColorMode] = useState<ColorMode>(getCurrentTheme());

  useEffect(() => {
    const darkThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChangeColorSchema = (event: MediaQueryListEvent) => {
      const isDark = event.matches;
      setColorMode(isDark ? "dark" : "light");
    };

    darkThemeMediaQuery.addEventListener("change", onChangeColorSchema);

    return () => {
      darkThemeMediaQuery.removeEventListener("change", onChangeColorSchema);
    };
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorMode(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeProvider theme={{ ...theme, config: { ...theme.config, colorMode } }} cssVarsRoot={`#${shadowRootId}`}>
      <ColorModeScript initialColorMode="system" />
      <ColorModeContext.Provider value={{ colorMode, setColorMode, toggleColorMode }}>
        <CSSReset />
        <GlobalStyle />
        {children}
      </ColorModeContext.Provider>
    </ThemeProvider>
  );
}
```

</details>
<details>
<summary>src/pages/content/ui/EmotionCacheProvider.tsx</summary>

```tsx
import createCache from '@emotion/cache';
import { CacheProvider, type EmotionCache } from '@emotion/react';
import { ReactNode, useEffect, useState } from 'react';

export default function EmotionCacheProvider({ children, rootId }: { rootId: string; children: ReactNode }) {
  const [emotionCache, setEmotionCache] = useState<EmotionCache | null>(null);

  useEffect(() => {
    function setEmotionStyles(shadowRoot: ShadowRoot) {
      setEmotionCache(
        createCache({
          key: rootId,
          container: shadowRoot,
        }),
      );
    }

    const root = document.getElementById(rootId);
    if (root && root.shadowRoot) {
      setEmotionStyles(root.shadowRoot);
    }
  }, []);

  return emotionCache ? <CacheProvider value={emotionCache}>{children}</CacheProvider> : null;
}
```

</details>

**5. Fix the `src/pages/content/ui/root.tsx` file:**

<details>
<summary>src/pages/content/ui/root.tsx</summary>

```tsx
import CustomChakraProvider from '@pages/content/ui/CustomChakraProvider';
import EmotionCacheProvider from '@pages/content/ui/EmotionCacheProvider';

// ...

createRoot(rootIntoShadow).render(
  // Add Providers
  <EmotionCacheProvider rootId={root.id}>
    <CustomChakraProvider shadowRootId={rootIntoShadow.id}>
      <App />
    </CustomChakraProvider>
  </EmotionCacheProvider>,
);

```

</details>

## Pages <a name="pages"></a>

### New Tab <a name="newtab"></a>

[Override Chrome pages](https://developer.chrome.com/docs/extensions/mv3/override/)<br/>`chrome_url_overrides.newtab` in
manifest.json

### Popup <a name="popup"></a>

[Browser actions](https://developer.chrome.com/docs/extensions/reference/browserAction/)<br/>`action.default_popup` in
manifest.json

### Devtools <a name="devtools"></a>

[Devtools](https://developer.chrome.com/docs/extensions/mv3/devtools/#creating)<br/>`devtools_page` in manifest.json

### Background <a name="background"></a>

[Background](https://developer.chrome.com/docs/extensions/mv3/background_pages/)<br/>`background.service_worker` in
manifest.json

### ContentScript <a name="contentscript"></a>

[Content Script (contentInjected/contentUI)](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)<br/>`content_scripts` in
manifest.json

### Options <a name="options"></a>

[Options](https://developer.chrome.com/docs/extensions/mv3/options/)<br/>`options_page` in manifest.json

### SidePanel (Chrome 114+) <a name="sidepanel"></a>

[SidePanel](https://developer.chrome.com/docs/extensions/reference/sidePanel/)<br/>`side_panel.default_path` in
manifest.json

## Screenshots <a name="screenshots"></a>

### Buttons <a name="newtab"></a>

<img width="300" alt="newtab" src="./public/img/youtube.png"> <img width="300" alt="newtab" src="./public/img/tik.png"> <img width="300" alt="newtab" src="./public/img/ok.png"> <img width="300" alt="newtab" src="./public/img/rutube.png"> 

### New Tab <a name="newtab"></a>

<img width="800" alt="newtab" src="https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/assets/53500778/3e782e41-b605-4956-90e2-20cc48252820">

### Popup <a name="popup"></a>

| Black                                                                                                                                                          | White                                                                                                                                                          |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <img width="300" alt="black" src="https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/assets/53500778/35423617-e6f5-4f65-adb3-03f068236648"> | <img width="300" alt="white" src="https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/assets/53500778/99886d92-b6f0-4e41-b70e-5afc6d2f7eab"> |

### Devtools <a name="devtools"></a>

<img width="450" alt="devtools" src="https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/assets/53500778/467d719d-a7db-4f77-8504-cd5ce7567793">
