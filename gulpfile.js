const { src, dest, series, watch } = require(`gulp`),
    del = require(`del`),
    htmlValidator = require(`gulp-html`),
    htmlCompressor = require(`gulp-htmlmin`),
    CSSLinter = require(`gulp-stylelint`),
    jsLinter = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
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


let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 100,
        server: {
            baseDir: `temp`
        }
    });

    watch(`html/*.html`, validateHTML)
        .on(`change`, reload);

    watch(`css/*.css`, lintCSS)
        .on(`change`, reload);

    watch(`js/*.js`, lintJS)
        .on(`change`, reload);
};

exports.validateHTML = validateHTML;
exports.lintCSS = lintCSS;
exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressHTML = compressHTML;
exports.HTMLProcessing = series(validateHTML, compressHTML);
exports.serve = series(
    validateHTML,
    lintCSS,
    transpileJSForDev,
    serve
);
