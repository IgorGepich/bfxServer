const express = require('express')
const fetch = require('node-fetch')
require('dotenv').config() // configuring file .env

const app = express()
const PORT = process.env.PORT

const mtaRoutes = [process.env.mtaDev, process.env.mtaReal, process.env.raspiLocal]

app.post('/', (req, res) => {

    let chunks = []
    let url = req.headers.host
    console.log(url)
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    console.log(fullUrl)
    const parts = fullUrl.split('/')
    console.log(parts)
    let targetUrl = parts[2]
    console.log(targetUrl)

    req.on('data', function(data) {
        chunks.push(data)

    })
        .on('end', function() {
        const data   = Buffer.concat(chunks)
        const reqBody = JSON.parse(data)
        console.log(reqBody)
            switch (targetUrl){
                case 'localhost:3000':
                    resendPostMethod(reqBody);
                    res.status(200).send('localhost:3000')
                    break;
                case '10.0.1.2:3000':
                    console.log('Another URL Address');
                    res.status(200).send('10.0.1.2:3000')
                    break;
            }
    });
});

function resendPostMethod(reqBody) {
    for(let i in mtaRoutes){
        let mta = mtaRoutes[i]
        console.log(mta)
            fetch(mta, {
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                /* auth headers */
                'Content-Type': 'application/json',
                }
            })
    }
}

app.listen(PORT,() => {
    console.log('Server has been started on port', + PORT, '...')
})




