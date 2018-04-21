const express = require('express')
const colors = require('colors');
const app = express()
express.static.mime.types['wasm'] = 'application/wasm'
app.use(express.static('./test/browser/'))
app.get('/result',(req, res)=>{
    console.log(String(req.query.timing).bgGreen.white);
    res.send("Done!");
    process.exit(0);
});

app.listen(8000, () => console.log('Serving at http://localhost:8000!'));