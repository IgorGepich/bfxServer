const express = require('express')
const CryptoJS = require('crypto-js') // Standard JavaScript cryptography library
const fetch = require('node-fetch') // "Fetch" HTTP req library
require('dotenv').config() // library for hiding API keys

const apiKey = process.env.APIKEY
const apiSecret = process.env.APISECRET

const apiPathSubmit = 'v2/auth/w/order/submit'// путь для выставлпения ордера

const apiPathCancel = 'v2/auth/w/order/cancel' // путь для закрытия ордера

const apiPathWallet = "v2/auth/r/wallets"

// изменять под проброшенный порт своего роутера + Настройки в методе SendSignal MTA
const PORT = process.env.PORT
const app = express()


app.post('/submit', (req, res) => {
    let postBodyRequest = '';
    req.on('data', chunk => {
        postBodyRequest += chunk.toString();
    });

    req.on('end', ()=>{
        const params = JSON.parse(postBodyRequest);
        console.log('params: ', params);
        let orderType = params.type;
        let pair = params.pair;
        let amount = params.vol;
        const nonce = (Date.now() * 1000).toString();
        const body = {
            type: orderType,
            symbol: pair,
            amount: amount
        }
        console.log('body: ', body);

        let signature = `/api/${apiPathSubmit}${nonce}${JSON.stringify(body)}`
        const sig = CryptoJS.HmacSHA384(signature, apiSecret).toString()


        fetch(`https://api.bitfinex.com/${apiPathSubmit}`, {
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
            .then(json => res.end(Buffer.from(JSON.stringify(json)))) // !!!!Возращает
            .then(json => console.log(json))
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
            .then(json => res.end(Buffer.from(JSON.stringify(json)))) // !!!!Возращает
            .catch(err => {
                console.log(err)
            })

    });
})


// wallet
app.post('/wallet', (req, res) => {

    const nonce = (Date.now() * 1000).toString();
    const body = {
    }

    let signature = `/api/${apiPathWallet}${nonce}${JSON.stringify(body)}`
    const sig = CryptoJS.HmacSHA384(signature, apiSecret).toString()

    fetch(`https://api.bitfinex.com/${apiPathWallet}`, {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
            /* auth headers */
            'Content-Type': 'application/json',
            'bfx-nonce': nonce,
            'bfx-apikey': apiKey,
            'bfx-signature': sig
        }
    })
        .then(res => res.json())
        .then(json => res.end(Buffer.from(JSON.stringify(json)))) // Возврат данных с биржи
        .catch(err => {
            console.log(err)
        })
})

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server has been started on port', + PORT, '...')
})
