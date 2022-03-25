const { src, dest, series, watch } = require(`gulp`),
    del = require(`del`),
    htmlValidator = require(`gulp-html`),
    htmlCompressor = require(`gulp-htmlmin`),
    CSSLinter = require(`gulp-stylelint`),
    jsLinter = require(`gulp-eslint`),
    babel = require(`gulp-babel`),
    browserSync = require(`browser-sync`),
    jsCompressor = require(`gulp-uglify`),
    cleanCSS = require('gulp-clean-css'),
    reload = browserSync.reload;



let browserChoice = `default`;

let validateHTML = () => {
    return src(`html/*.html`).pipe(htmlValidator())
    .pipe(dest(`temp`));
};

let lintCSS = () => {
    return src(`css/*.css`)
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [
                {formatter: `string`, console: true}
            ]
        }))
        .pipe(dest(`temp/css`));
};

let lintJS = () => {
    return src(`js/*.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach(`compact`));
};

let transpileJSForDev = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/js`));
};

let compressHTML = () => {
    return src(`html/*.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let compressCSS = () => {
  return src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('prod/css'));
};

let transpileJSForProd = () => {
    return src(`js/*.js`)
        .pipe(babel())
	      .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

let serve = () => {
    browserSync({
        notify: true,
        browser: browserChoice,
        reloadDelay: 5000,
        server: {
            baseDir: `temp`
        }
    });

    watch(`js/*.js`, series(lintJS, transpileJSForDev))
        .on(`change`, reload);

    watch(`css/*.css`, lintCSS)
        .on(`change`, reload);

    watch(`html/*.html`, validateHTML)
        .on(`change`, reload);
};

async function clean() {
    let fs = require(`fs`),
        i,
        foldersToDelete = [`temp`,`prod`];

    for (i = 0; i < foldersToDelete.length; i++) {
        try {
            fs.accessSync(foldersToDelete[i], fs.F_OK);
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory was found and will be deleted.\n`);
            del(foldersToDelete[i]);
        } catch (e) {
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory does NOT exist or is NOT accessible.\n`);
        }
    }

    process.stdout.write(`\n`);
}

async function listTasks () {
    let exec = require(`child_process`).exec;

    exec(`gulp --tasks`, function (error, stdout, stderr) {
        if (null !== error) {
            process.stdout.write(`An error was likely generated when invoking ` +
                `the “exec” program in the default task.`);
        }

        if (`` !== stderr) {
            process.stdout.write(`Content has been written to the stderr stream ` +
                `when invoking the “exec” program in the default task.`);
        }

        process.stdout.write(`\n\tThis default task does ` +
            `nothing but generate this message. The ` +
            `available tasks are:\n\n${stdout}`);
    });
}

exports.default = listTasks;
exports.clean = clean;
exports.validateHTML = validateHTML;
exports.lintCSS = lintCSS;
exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressHTML = compressHTML;
exports.compressCSS = compressCSS;
exports.transpileJSForProd = transpileJSForProd;

exports.serve = series(
    validateHTML,
    lintCSS,
    lintJS,
    transpileJSForDev,
    serve
);

exports.prod = series(
          compressHTML,
		      compressCSS,
		      transpileJSForProd);
