# What is pinion?
 * **Opinionated** - modeled to mimic the rails asset pipeline, tasks are default to just work
 * **Fast** - designed for speed
 * **Customisable** - the `pinionfile` allows tweaking of the pipeline to match your workspace

pinion was born to replace the Rails asset pipeline, in a Rails workspace. Benefits over the Rails asset pipeline include:

 * speed
 * modernness (support for CommonJS)
 * less "magic" (everything is a gulp task)

# Installing

`npm install pinion-pipeline` will install the package locally

`npm install -g pinion-pipeline` will provide a `pinion` CLI for you to use. Or, you can just `$(npm bin)/pinion` in your local workspace.

# Usage

pinion's CLI is designed to mimic gulp.

  * `pinion` is equivalent to `pinion default`
  * `pinion x` runs the task `x`
  * `pinion x y z` runs the tasks `x`, `y`, and then `z`

# Sample `pinionfile.js`
Not much is required to get going with simple tasks
```js
module.exports = {
  tasks: {
    // build from src/javascripts/app.js to bin/bundle.js
    js: {
      entries: {
        bundle: ['app.js']
      }
    },

    // build from src/stylesheets/*.{scss,css} to bin/*.css
    css: {},

    // build from src/images/* to bin/*
    images: {}
  }
}
```


But we can be more verbose for greater control

```js
module.exports = {
  root: {
    src: './app/assets',
    dest: './public/assets'
  },

  tasks: {

    js: {
      // with our `root`, this means take stuff from ./app/assets/javascripts
      src: 'javascripts',
      // and output it to ./public/assets
      dest: '.',

      // this will create a `shared.js` file of common code, to keep multiple files small
      extractSharedJs: true,

      // take a.js and b.js, and compile it to bundle.js
      entries: {
        bundle: ['./a.js', './b.js']
      },

      // since we have locally `npm install jquery`d, we can set it up as a global
      globals: {
        jquery: ['$', 'jQuery']
      },

      // Look for all *.js and *.coffee files
      extensions: ['js', 'coffee']
    },

    // compile our SCSS
    css: {
      src: 'stylesheets',
      dest: '.',

      // options to pass to `gulp-autoprefixer`
      autoprefixer: {
        browsers: ['last 3 version']
      },

      // options to pass to `gulp-sass`
      sass: {
        indentedSyntax: false
      },

      extensions: ['scss', 'css']
    },

    // images are minified
    images: {
      // split the images task into mutliple sub-tasks
      taskArray: [
        { src: 'images' },
        { src: 'vendor/images' },
      ],
      dest: '.'
    }

  }
}
```

# Modes

Depending on the `NODE_ENV`, tasks perform differently. As a rule of thumb:

 * `NODE_ENV=production` - assets are minified and optimised as much as possible
 * `NODE_ENV=development` or no `NODE_ENV` - assets are left alone and just moved where possible, and map files are generated

# Tasks

## Configurable tasks

Tasks with omitted configuration in the `pinionfile.js` will be omitted from the build sequence

All tasks accept the following arguments

### Base options

 * `src` - the source directory (or an array of directories)
 * `dest` - the destination directory
 * `fileGlob` - a glob pattern to search for files within `src`
 * `extensions` - an array of file extensions (equivalent to `fileGlob: '**/*.{a,b,c}'`)
 * `ignore` - a glob pattern of paths to be ignored
 * `npm` - whether `node_modules` should be searched as well as `src`

### js

Uses webpack to compile Javascript code

#### Options

 * `extractSharedJs` - create a shared.js file with common code shared between multiple entries
 * `entries` - a map of built file names, to an array of source files. E.g. `{ bundle: ['./a.js', './b.js'] }` to create a bundle.js from an a.js and b.js
 * `globals` - a map of local npm packages to their aliases. E.g. `jquery: ['$', 'jQuery']`

### css

Uses node-sass to compile SCSS code

#### Options

 * `autoprefixer` - options passed to gulp-autoprefixer
 * `sass` - options passed to gulp-sass

### images

Minifies images in production mode

### svg

Uses gulp-svgstore to combine all SVGs into a `sprite.svg` file

### fonts

Moves fonts from src to dest

### resources

Moves miscellaneous resources from src to dest. It can accept an array of src/dest objects

## Task splitting

Tasks can be split into multiple sub tasks, as in the following example

```js
resources: {
  npm: true,
  taskArray: [
    {
      src: 'config',
      dest: 'config'
    },
    {
      src: 'pdfs',
      fileGlob: '**/*.pdf',
      dest: '.'
    }
  ]
}
```

Where the resources task will be run twice, with equivalent configs of

```js
{
  npm: true,
  src: 'config',
  dest: 'config'
}
```

and

```js
{
  npm: true,
  src: 'pdfs',
  fileGlob: '**/*.pdf',
  dest: '.'
}
```

## Non-configurable tasks

### default

Clean the workspace, and build and watch the workspace

### watch

In development mode, builds everything, and also watches for changes in your workspace

### build

Runs through all of the build tasks

### rev

`pinion rev` will revision all of your assets. Also known as "fingerprinting" in Rails.

This adds a hash to the end of your files, unique to their content. This aids in cache-busting.

A `rev-manifest.json` will be created with the mappings from the original file name, to the new file name.

As an example of how to use this `rev-manifest.json`, this is a sample of some Rails code leveraging the `rev-manifest.json`

```ruby
def asset_path(path)
  path = "/assets/#{path}"
  path = REV_MANIFEST[path] || path if defined?(REV_MANIFEST)
  path
end
```

### rev-postfix

If you have an `ASSET_HOST` environment variable, this will prepend that variable to the mapped values of your `rev-manifest.json`

For example, a `rev-manifest.json` of this:

```json
{
  "someFile.png": "/assets/someFile.png"
}
```

with an `ASSET_HOST=http://mycdn.com/foo/`, would generate the following:

```json
{
  "someFile.png": "http://mycdn.com/foo/assets/someFile.png"
}
```

### clean

Wipes the `root.dest` directory
