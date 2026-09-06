# quote-api

[![wakatime](https://wakatime.com/badge/github/LyoSU/quote-api.svg)](https://wakatime.com/badge/github/LyoSU/quote-api)

Апи для генерации Telegram цитат

## Deploy ke Vercel

Project ini sudah disiapkan untuk berjalan sebagai Vercel Serverless Function (lihat `api/index.js` dan `vercel.json`).

1. Isi environment variable di dashboard Vercel (Project Settings → Environment Variables), minimal:
   - `BOT_TOKEN`
   - `EMOJI_DOMAIN`
2. Tambahkan font Noto Sans (`.ttf`/`.otf`) ke folder `assets/fonts/` sebelum deploy — folder ini kosong secara default dan teks tidak akan ter-render tanpa font.
3. Deploy:
   ```bash
   npm i -g vercel
   vercel --prod
   ```
   atau hubungkan repo ke Vercel lewat dashboard (import Git repository).

Catatan penting:
- `canvas` dan `sharp` adalah native module. Vercel akan build ulang `node_modules` di lingkungannya sendiri saat deploy, jadi tidak perlu build manual.
- Rate limit (`koa-ratelimit`) dan cache hasil generate (`lru-cache`) disimpan di memori proses. Di lingkungan serverless, memori ini tidak selalu persisten antar request (tiap cold start mulai dari kosong), jadi limit efektifnya lebih longgar dibanding di server biasa.
- Untuk pengembangan lokal, tetap gunakan `npm start` (menjalankan `index.js` sebagai server Koa biasa di `PORT` dari `.env`).

## Emoji

Emoji digambar sebagai gambar PNG yang di-`drawImage()` ke canvas (bukan lewat font), karena node-canvas tidak bisa merender glyph emoji berwarna dari font apa pun. Hanya gaya **Apple** yang disertakan (`assets/emoji/emoji-apple-image.json`), sudah dikompres ulang (palet 128 warna, tetap PNG + transparansi) sehingga ukurannya turun dari ~78MB (5 gaya) menjadi ~8MB (1 gaya). Parameter `emojiBrand` di request masih diterima tapi sudah tidak berpengaruh — semua emoji selalu tampil gaya Apple.

## Методы
##### Создание цитаты
```http
POST /generate
```

Пример JSON запроса:
```json
{
  "type": "quote",
  "format": "png",
  "backgroundColor": "#1b1429",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "chatId": 66478514,
      "avatar": true,
      "from": {
        "id": 66478514,
        "first_name": "Yuri 💜",
        "last_name": "Ly",
        "username": "LyoSU",
        "language_code": "ru",
        "title": "Yuri 💜 Ly",
        "photo": {
          "small_file_id": "AQADAgADCKoxG7Jh9gMACBbSEZguAAMCAAOyYfYDAATieVimvJOu7M43BQABHgQ",
          "small_file_unique_id": "AQADFtIRmC4AA843BQAB",
          "big_file_id": "AQADAgADCKoxG7Jh9gMACBbSEZguAAMDAAOyYfYDAATieVimvJOu7NA3BQABHgQ",
          "big_file_unique_id": "AQADFtIRmC4AA9A3BQAB"
        },
        "type": "private",
        "name": "Yuri 💜 Ly"
      },
      "text": "I love you 💜",
      "replyMessage": {}
    }
  ]
}
```

Медиа:
```json
{
  "type": "quote",
  "format": "png",
  "backgroundColor": "#1b1429",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "media": [
        {
          "file_id": "CAACAgIAAxkBAAIyH2AAAUcJoPJqv4uOPabtiSR3judSnQACaQEAAiI3jgQe29BUaNTqrx4E",
          "file_size": 22811,
          "height": 512,
          "width": 512
        }
      ],
      "mediaType": "sticker",
      "chatId": 66478514,
      "avatar": true,
      "from": {
        "id": 66478514,
        "first_name": "Yuri 💜",
        "last_name": "Ly",
        "username": "LyoSU",
        "language_code": "ru",
        "title": "Yuri 💜 Ly",
        "photo": {
          "small_file_id": "AQADAgADCKoxG7Jh9gMACBbSEZguAAMCAAOyYfYDAATieVimvJOu7M43BQABHgQ",
          "small_file_unique_id": "AQADFtIRmC4AA843BQAB",
          "big_file_id": "AQADAgADCKoxG7Jh9gMACBbSEZguAAMDAAOyYfYDAATieVimvJOu7NA3BQABHgQ",
          "big_file_unique_id": "AQADFtIRmC4AA9A3BQAB"
        },
        "type": "private",
        "name": "Yuri 💜 Ly"
      },
      "replyMessage": {}
    }
  ]
}
```

Без Telegram
```json
{
  "type": "quote",
  "format": "png",
  "backgroundColor": "#1b1429",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "media": {
        "url": "https://via.placeholder.com/1000"
      },
      "avatar": true,
      "from": {
        "id": 1,
        "name": "Mike",
        "photo": {
          "url": "https://via.placeholder.com/100"
        }
      },
      "text": "Hey",
      "replyMessage": {}
    }
  ]
}
```

Параметры:
|  Поле | Тип |  Описание  |
| :------------ | :------------ | :------------ |
|  type | string | Тип выходного изображения. Может быть: quote, image, null |
|  backgroundColor | string | Цвет фона цитаты. Может быть Hex, название или random для случайного цвета |
|  messages | array | Массив из сообщений |
| width | number | Максимальная ширина |
| height | number | Максимальная высота |
| scale | number | Маcштаб |

Пример ответа:

```json
{
  "ok": true,
  "result": {
    "image": "base64 image",
    "type": "quote",
    "width": 512,
    "height": 359
  }
}

```

## Примеры запросов:
> JavaScript
```js
const axios = require('axios')
const fs = require('fs')

const text = "Hello World"
const username = "Alι_Aryαɴ"
const avatar = "https://telegra.ph/file/59952c903fdfb10b752b3.jpg"

const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#FFFFFF",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": true,
      "from": {
        "id": 1,
        "name": username,
        "photo": {
          "url": avatar
        }
      },
      "text": text,
      "replyMessage": {}
    }
  ]
};
        const response = axios.post('https://bot.lyo.su/quote/generate', json, {
        headers: {'Content-Type': 'application/json'}
}).then(res => {
    const buffer = Buffer.from(res.data.result.image, 'base64')
       fs.writeFile('Quotly.png', buffer, (err) => {
      if (err) throw err;
    })
});
```

> Python
```py
import requests
import base64

text = "Hello World"
username = "Alι_Aryαɴ" 
avatar = "https://telegra.ph/file/59952c903fdfb10b752b3.jpg"

json = {
  "type": "quote",
  "format": "webp",
  "backgroundColor": "#FFFFFF",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": True,
      "from": {
        "id": 1,
        "name": username,
        "photo": {
          "url": avatar
        }
      },
      "text": text,
      "replyMessage": {}
    }
  ]
}

response = requests.post('https://bot.lyo.su/quote/generate', json=json).json()
buffer = base64.b64decode(response['result']['image'].encode('utf-8'))
open('Quotly.png', 'wb').write(buffer)
print('Quotly.png')
```
### Response

![Quotly.png](assets/Quotly.png)
