const express = require('express')

const app = express();

const PORT = '3001'


app.post('/', (req, res) => {
    let chunks = [];

    req.on('data', function(data) {
        chunks.push(data);
    })
        .on('end', function() {
            let data   = Buffer.concat(chunks);
            let schema = JSON.parse(data);
            console.log(JSON.stringify(schema))
            console.log(schema.type)
        });
    // res.status(200).end();
    res.send('End point')
});

app.listen(PORT, () =>{
    console.log('Server has been started on port', + PORT, '...')
});