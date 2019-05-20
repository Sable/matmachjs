
const gulp = require('gulp');
const shell = require('gulp-shell');
const express = require('express');
const mocha = require('gulp-mocha');
const fs = require("fs");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");


const PORT = 8000;
gulp.task('compile-wasm', () => {
  return gulp.src('./src/wast/*.wat', {read: false})
  .pipe(shell([
    'node compile_matmach_wasm.js <%= file.path %> -b'
  ]))
});

gulp.task('compile-browser', () => {
    return gulp.src('./src/*.wat', {read: false})
    .pipe(shell([
      './run_wasm_browser.sh <%= file.path %>'
    ]))
});


gulp.task("compile",["compile-wasm","compile-ts"]);

gulp.task('watch-compile',()=>{
    gulp.watch(['./src/ts/**/**/*.ts',"./src/wast/*.wat"],["compile"]);
});

gulp.task("test-ts",["compile-ts"],()=>{
    if(fs.existsSync('./bin/matmachjs.wasm')){
        return gulp.src('./test/node/**/**/*.test.ts',
         {read: false}).pipe(mocha(
           {require:["ts-node/register"]}));
    }
 });
gulp.task("test",["compile-wasm","compile-ts"],()=>{
    if(fs.existsSync('./bin/matmachjs.wasm')){
        return gulp.src('./test/node/**/*.test.js', {read: false})
        .pipe(mocha());
    }
 });
gulp.task("test-watch",()=>{
  gulp.watch(['./test/**/**/*.test.js','./src/**/*.wat','./src/ts/**/**/*.ts'],["test"])
});
gulp.task('watch-compile-wasm',()=>{
  return gulp.watch(['./src/wast/*.wat'],['compile-wasm']);
});
gulp.task('watch-compile-ts',()=>{
  return gulp.watch(['./src/ts/**/**/*.ts'],['compile-ts']);
});
gulp.task('default',()=>{
    return gulp.watch(['./src/wast/*/wat','src/ts/**/**/*.ts'],['compile-wasm','compile-ts']);
});
gulp.task('browser',()=>{
    startServer(PORT,()=>
    {
      console.log("Server started at 8000!");
      return gulp.watch('*.wat',['compile-browser']);
    });
});
gulp.task("compile-ts", function () {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest("bin"));
});
gulp.task('haider',()=>{
    return gulp.watch('/usr/local/bin/russian_doll.py',['read_py'])     
});
gulp.task('read_py',()=>{
    return gulp.src('/usr/local/bin/russian_doll.py').pipe(gulp.dest("./hello.py"))
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
