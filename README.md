# Starter Template Files 

Starter project files for current and future projects. <br>
These files will be kept up to date based on current trends (or at least I'll try to :)


## To start
- Clone or download repo to your local machine.
- Go into the project directory via terminal.
- Run 'NPM install' to install the Node Packages.
- Then run 'gulp'.
- Done.

If you get a message "gulp: command not found", install gulp globally by running: 'npm install -g gulp'

#### ```Main Directory``` structure

```
├── builds/                                 # build folder
|   ├── development/                        # development directory (with just a css, images, and js directory)
|   └── production/
├── components/                             # components directory
|   ├── sass/                               # sass directory with all core partials
|   └── scripts/                            # script directory for all your scripts
├── node_modules/                           # node mods (not on the repo but required to run your local build)
│   ├── [node module directories]           # node mod directories (there are many!)
│   └── ...                                 # ...
├── .gitignore                              # git ignore files to ignore some common files
├── gulpfile.js                             # gulp file (adjust to your needs)
├── LICENSE                                 # MIT licence file
├── package.json                            # your package.json file (modify for your project)
└── readme.md                               # yours truly!

```

## NOTES

**April 18, 2018**
- Layout based on Flexbox. Will update to Grid once MS catches up.
- Nav menu built with vanilla Javascript, no JQuery required :)
- Using Sass to do css pre-processing.