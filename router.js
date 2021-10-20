const express = require('express')
const fetch = require('node-fetch')

const router = express()
const PORT = '3000'

const mtaDev = 'https://script.google.com/macros/s/AKfycbwLDF29Grj_2Mn8EsZ0W9OGG9gCDe8zb1g6XOrxLGhKvuNJDfgDHwsaKGqHYqPxGvlgsA/exec?action=directDealUpdate'

router.post('/', (req, res) => {

    let chunks = [];
    let url = req.headers.host
    console.log(url)
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl)
    const parts = fullUrl.split('/')
    console.log(parts)
    let a = parts[2]
    console.log(a)

    req.on('data', function(data) {
        chunks.push(data);
    })
        .on('end', function() {
        const data   = Buffer.concat(chunks);
        const reqBody = JSON.parse(data);
        console.log(reqBody)
            // resendPostMethod()

    });
    function d(){
        res.redirect(307, 'http://10.0.1.4:3001')
        res.redirect(307, mtaDev)
    }

    d();
});


function resendPostMethod() {
    console.log('это работает')
    let body = {
        "type": "LIMIT",
        "pair": "tTESTBTC:TESTUSD",
        "vol": "0.01"
    }
    fetch(`http://10.0.1.4:3001`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            /* auth headers */
            'Content-Type': 'application/json',

        }

    })
}
router.listen(PORT,() => {
    console.log('Server has been started on port', + PORT, '...')
})




