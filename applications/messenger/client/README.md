Configuration files and scripts in this directory are based on Facebook's
[create-react-app](https://github.com/facebookincubator/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm run dev`

Runs Webpack in the development mode.

Development assets are rsync'ed into the `static` directory.

The page will reload automatically in Chrome on macOS if you make edits.
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

Production assets are rsync'ed into the `static` directory and ready for deployment.

The build is minified and the filenames include the hashes.

### Adding Flow

In order for Flow to work, change your `.flowconfig` to look like this:

```
[libs]
./node_modules/fbjs/flow/lib

[options]
esproposal.class_static_fields=enable
esproposal.class_instance_fields=enable

module.name_mapper='^\(.*\)\.css$' -> '<PROJECT_ROOT>/config/flow/css'
module.name_mapper='^\(.*\)\.\(jpg\|png\|gif\|eot\|svg\|ttf\|woff\|woff2\|mp4\|webm\)$' -> '<PROJECT_ROOT>/config/flow/file'

suppress_type=$FlowIssue
suppress_type=$FlowFixMe
```

Re-run flow, and you sholdn’t get any extra issues.
