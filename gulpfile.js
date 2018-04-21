
const gulp = require('gulp')
const shell = require('gulp-shell')
const express = require('express')
const colors = require('colors');
const PORT = 8000;
gulp.task('compile', () => {
  return gulp.src('./src/*.wat', {read: false})
  .pipe(shell([
    './run_wasm.sh <%= file.path %>'
  ]))
})
gulp.task('compile-browser', () => {
    return gulp.src('./src/*.wat', {read: false})
    .pipe(shell([
      './run_wasm_browser.sh <%= file.path %>'
    ]))
  })
gulp.task('default',()=>{
    return gulp.watch('./src/*.wat',['compile'])
});
gulp.task('browser',()=>{
    startServer(PORT,()=>
    {
      console.log("Server started at 8000!");
      return gulp.watch('*.wat',['compile-browser']);
    });
});

function startServer(port, callback){
  const app = express()
  express.static.mime.types['wasm'] = 'application/wasm'
  app.use(express.static('./test/browser/'))
  app.get('/result',(req, res)=>{
      console.log(String(req.query.timing).bgGreen.white);
      res.send("Done!");
      // process.exit(0);
  });
  app.listen(port, callback);
}