## eSports Racing Hub (eRH)

### Data Structure

data.[packetTypes].[channels].[time_groups].<values>

### Development

## Install

First, clone the repo via git:

```bash
git clone
```

And then install the dependencies with yarn.

```bash
$ cd electron-race-control
$ yarn
```

## Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
$ yarn dev
```

## Packaging for Production

To package apps for the local platform:

```bash
$ yarn package
```
