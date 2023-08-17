# SteadyCMS desktop

The desktop app for SteadyCMS — a block-based, Hugo static site CMS for desktop and web.

This repository contains the source for the desktop application built with Vue 3, Electron, and Tailwindcss. 

Status: **Highly work in progress. Not yet ready for use.**


## Roadmap

For now the desktop application is our primary focus, then the web version. 

The immediate goal is to create a simple frontend for creating a site and editing posts in a block-based editor.


## Development

### Install dependencies

```bash
npm install
```

### Start developing

```bash
npm run dev
```

### Rebuilding tailwindcss

```bash
cd src/renderer
```

```bash
npx tailwindcss -i ./assets/source.css -o ./assets/main.css --watch
```


## Additional Commands

```bash
npm run dev # starts application with hot reload
npm run build # builds application, distributable files can be found in "dist" folder

# OR

npm run build:win # uses windows as build target
npm run build:mac # uses mac as build target
npm run build:linux # uses linux as build target
```

Optional configuration options can be found in the [Electron Builder CLI docs](https://www.electron.build/cli.html).


## Project Structure

```bash
- scripts/ # all the scripts used to build or serve your application, change as you like.
- src/
  - main/ # Main thread (Electron application source)
  - renderer/ # Renderer thread (VueJS application source)
```


## License

Copyright 2023 SteadyCMS authors. GPL-3.0 license, see [LICENSE](/LICENSE) for details.