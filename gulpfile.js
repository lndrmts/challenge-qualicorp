const { series, parallel, src, watch } = require("gulp");
const gulp = require("gulp");
const webp = require("gulp-webp");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const consolidate = require("gulp-consolidate");
const iconfont = require("gulp-iconfont");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;

const babel = require("gulp-babel");

const scriptsSourcePath = "assets/scripts-source";
const scriptsTargetPath = "assets/scripts";

const stylesSourcePath = "assets/styles-source/sass";
const stylesTargetPath = "assets/styles";

const imagesTargetPath = "assets/images";

const iconsSourcePath = "assets/svg";
const iconsTargetPath = "assets/fonts";

function serve() {
  return browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}

function scripts() {
  return src([`${scriptsSourcePath}/scripts.js`])
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(scriptsTargetPath));
}

function images() {
  return src(`${imagesTargetPath}/*.{jpg,png}`)
    .pipe(webp())
    .pipe(gulp.dest(imagesTargetPath));
}

function css() {
  return src([`${stylesSourcePath}/styles.min.scss`])
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(sourcemaps.write("maps"))
    .pipe(gulp.dest(stylesTargetPath));
}

function icons() {
  return src(`${iconsSourcePath}/*.svg`)
    .pipe(
      iconfont({
        fontName: "iconfont",
        formats: ["ttf", "eot", "woff", "woff2", "svg"],
        appendCodepoints: true,
        appendUnicode: false,
        normalize: true,
        fontHeight: 1000,
        centerHorizontally: true,
      })
    )
    .on("glyphs", function (glyphs, options) {
      gulp
        .src(`${iconsSourcePath}/_iconfont.scss`)
        .pipe(
          consolidate("underscore", {
            glyphs: glyphs,
            fontName: options.fontName,
            fontDate: new Date().getTime(),
          })
        )
        .pipe(gulp.dest(`${stylesSourcePath}`));
    })
    .pipe(gulp.dest(iconsTargetPath));
}

exports.serve = serve;
exports.images = images;
exports.css = css;
exports.scripts = scripts;
exports.icons = icons;
exports.default = parallel(css, scripts);

watch("*.html").on("change", reload);
watch(`${stylesSourcePath}/*.scss`, css).on("change", reload);
watch(`${scriptsSourcePath}/*.js`, scripts).on("change", reload);
watch(`${imagesTargetPath}/*.{jpg,png}`, images);
watch(`${iconsSourcePath}/*.svg`, icons);
