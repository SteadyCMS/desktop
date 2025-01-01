# SteadyCMS desktop

This repository contains the desktop-specific Electron source for the SteadyCMS desktop application built with Vue 3, Electron, and Tailwindcss. 


## Development

### Install dependencies

```bash
npm install
```

### Sync the main Vue.js application code

```bash
cd src/renderer
```

```bash
git clone https://github.com/SteadyCMS/SteadyCMS.git .
```

```bash
cd ../..
```

#### Rebuilding the CSS

```bash
cd src/renderer
```

```bash
npx run cssdev
```

### Start developing

```bash
npm run dev
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
  - renderer/ # Renderer thread (VueJS application source goes here)
```


## License

Copyright 2023-2025, the SteadyCMS team. Licensed under the GPL-3.0 license. See [LICENSE](/LICENSE) for details.
