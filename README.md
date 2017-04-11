# Livesite Management
Livesite Management (javascript) application. Manage your Superdesk Publisher site directly from frontend view.

### Build configuration

To configure the build, the `config.js` file must export a function that returns the configuration object. The configuration 
object can contain the keys described belowed. We use a function instead of a simple JSON object to allow the convenience of 
using grunt flags, as well as give access to environment variables for more diverse configurations.

- `protocol` - `http` or `https`
- `domain`
- `base` - base url, eg. `/api/v1/`
- `path` - url path to folder where livesite files would be deployed

### Installation
```sh
git clone https://github.com/SuperdeskWebPublisher/livesite-management
npm install
grunt server

# open http://localhost:8080 in browser
```

### Deployement

`grunt build`

Livesite files for deployement would be in `~/dist` folder

Copy those files in `path` defined in `config.js`

In `base.html.twig` of site where you add livesite:

Add `ng-app="livesite-management"` in `<html>` tag.

Add `<script src="{{ asset('theme/livesite/app.aef1591e00fd309b6350.js') }}"></script>`.

On every build, this file will have different name, so you need to copy name of js file that is built in `~/dist` folder.
