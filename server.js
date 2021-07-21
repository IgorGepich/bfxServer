const express = require('express')
const CryptoJS = require('crypto-js') // Standard JavaScript cryptography library
const fetch = require('node-fetch') // "Fetch" HTTP req library

const apiKey = 'JaYlHTEDnQkZOkejaRj7oUnRmcfCAcsEAWKzBDG4Gnd'
const apiSecret = 'I3yHTkEBFOYGwPTxjvysQpFUny5r7wj2a3WjFj5zwin'

const apiPath = 'v2/auth/w/order/submit'// путь для выставлпения ордера

const apiPathCancel = 'v2/auth/w/order/cancel' // путь для закрытия ордера


// изменять под проброшенный порт своего роутера + Настройки в методе SendSignal MTA
const PORT = process.env.PORT ?? 8887
const app = express()


app.post('/submit', (req, res) => {
    let postBodyRequest = '';
    req.on('data', chunk => {
        postBodyRequest += chunk.toString();
    });
    req.on('end', ()=>{
        const params = JSON.parse(postBodyRequest);
        console.log('params: ', params);
        let dop = params.type;
        let pair = params.pair;
        let amount = params.bc;
        const nonce = (Date.now() * 1000).toString();
        const body = {
            type: dop,
            symbol: pair,
            amount: amount
        }
        console.log('body: ', body);

        let signature = `/api/${apiPath}${nonce}${JSON.stringify(body)}`
        const sig = CryptoJS.HmacSHA384(signature, apiSecret).toString()


        fetch(`https://api.bitfinex.com/${apiPath}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'bfx-nonce': nonce,
                'bfx-apikey': apiKey,
                'bfx-signature': sig
            }
        })
            .then(res => res.json())
            // .then(json => console.log(json)) //Logs the response body информация возвращаемая биржей
            .then(json => res.end(Buffer.from(JSON.stringify(json)))) // !!!!Возращает
        .catch(err => {
            console.log(err)
        })

    });
})



// на данном этапе не используется
// order cancel
app.post('/cancel', (req, res) => {
    let postBodyRequest = '';
    req.on('data', chunk => {
        postBodyRequest += chunk.toString();
    });
    req.on('end', ()=>{
        const params = JSON.parse(postBodyRequest);
        console.log('params: ', params);
        let id = params.id
        const nonce = (Date.now() * 1000).toString();
        const body = {
            id: id
        }
        console.log('body: ', body);

        let signature = `/api/${apiPathCancel}${nonce}${JSON.stringify(body)}`
        const sig = CryptoJS.HmacSHA384(signature, apiSecret).toString()


        fetch(`https://api.bitfinex.com/${apiPathCancel}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'bfx-nonce': nonce,
                'bfx-apikey': apiKey,
                'bfx-signature': sig
            }
        })
            .then(res => res.json())
            // .then(json => console.log(json)) //Logs the response body информация возвращаемая биржей
            .then(json => res.end(Buffer.from(JSON.stringify(json)))) // !!!!Возращает
            .catch(err => {
                console.log(err)
            })

    });
})

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server has been started on port', + PORT, '...')
})
