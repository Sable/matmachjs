
const gulp = require('gulp');
const shell = require('gulp-shell');
const express = require('express');
const colors = require('colors');
const mocha = require('gulp-mocha');
const fs = require("fs");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");


const PORT = 8000;
gulp.task('compile-wasm', () => {
  return gulp.src('./src/**/*.wat', {read: false})
  .pipe(shell([
    './run_wasm.sh <%= file.path %>'
  ]))
});

gulp.task('compile-browser', () => {
    return gulp.src('./src/*.wat', {read: false})
    .pipe(shell([
      './run_wasm_browser.sh <%= file.path %>'
    ]))
});
gulp.task("test",["compile-wasm","compile-typescript"],()=>{
    if(fs.existsSync("./bin/get_mem.wasm"))
    {
        return gulp.src('./test/node/**/*.test.js', {read: false})
        .pipe(mocha());
    }
 });
gulp.task("test-watch",()=>{
  gulp.watch(['./test/**/**/*.test.js','./src/**/*.wat'],["test"])
});
gulp.task('default',()=>{
    return gulp.watch(['./src/wast/*/wat','src/ts/**/*.ts'],['compile-wasm','compile-typescript']);
});
gulp.task('browser',()=>{
    startServer(PORT,()=>
    {
      console.log("Server started at 8000!");
      return gulp.watch('*.wat',['compile-browser']);
    });
});
gulp.task("compile-typescript", function () {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest("dist"));
});


function startServer(port, callback){
  const app = express();
  express.static.mime.types['wasm'] = 'application/wasm';
  app.use(express.static('./test/browser/'));
  app.get('/result',(req, res)=>{
      console.log(String(req.query.timing).bgGreen.white);
      res.send("Done!");
      // process.exit(0);
  });
  app.listen(port, callback);
}