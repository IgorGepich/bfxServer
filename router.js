const express = require('express')
const fetch = require('node-fetch')
require('dotenv').config() // configuring file .env

const app = express()
const PORT = process.env.PORT

const mtaRoutes = [process.env.MTADEVSI, process.env.MTAREAL, process.env.RASPILOCAL]

// const log4js = require("log4js");
// const log = require('./loggingConf');

// log4js.configure({
//         appenders: {
//             out: { type: 'console' },
//             task: { type: 'dateFile', filename: 'logs/task',"pattern":"-dd.log", alwaysIncludePattern:true },
//             result: { type: 'dateFile', filename: 'logs/result',"pattern":"-dd.log", alwaysIncludePattern:true},
//             error: { type: 'dateFile', filename: 'logs/error', "pattern":"-dd.log",alwaysIncludePattern:true},
//             default: { type: 'dateFile', filename: 'logs/default', "pattern":"-dd.log",alwaysIncludePattern:true},
//             rate: { type: 'dateFile', filename: 'logs/rate', "pattern":"-dd.log",alwaysIncludePattern:true}
//         },
//         categories: {
//             default: { appenders: ['out','default'], level: 'info' },
//             task: { appenders: ['task'], level: 'info'},
//             result: { appenders: ['result'], level: 'info' },
//             error: { appenders: ['error'], level: 'error' },
//             rate: { appenders: ['rate'], level: 'info' }
//         }
//     }
// );

// let logger = log.getLogger('default')


app.post('/', (req, res) => {

    let chunks = []
    let url = req.headers.host
    // console.log(url)
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    // console.log(fullUrl)
    // logger.result(fullUrl)
    const parts = fullUrl.split('/')
    // console.log(parts)
    let targetUrl = parts[2]
    // console.log(targetUrl)

    req.on('data', function(data) {
        chunks.push(data)

    })
        .on('end', function() {
        const data = Buffer.concat(chunks)
        const reqBody = JSON.parse(data)
        console.log(reqBody)
            for (let i in chunks) {console.log(' ', chunks[i])}

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




