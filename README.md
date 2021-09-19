# Anime Scraper

![GitHub](https://img.shields.io/github/license/zahniar88/anime-scraping?color=orange)
![GitHub last commit](https://img.shields.io/github/last-commit/zahniar88/anime-scraping)
![Twitter Follow](https://img.shields.io/twitter/follow/zahniaradrn?style=social)
![GitHub issues](https://img.shields.io/github/issues/zahniar88/anime-scraping?color=red)

Anime scraping adalah api tidak resmi untuk mengambil data anime dari website streaming anime menjadi data JSON yang dapat di pakai secara gratis sebagai bahan belajar. Data yang di ambil berasal dari website: https://animeindo.link/

`base_url: https://anime-scraping.herokuapp.com/`

## End Point
___

* ### Mengambil Seluruh Daftar Anime
    
    End Point : `/` query params `search` dan `page`

    Response: 
    ```
        {
            "status" : "OK,
            "data" : [
                {
                    "title": String,
                    "image": String,
                    "linkId": String,
                    "rating": String,
                    "serial": String,
                    "type": String
                },
                ...
            ]
        }
    ```

* ### Mengambil Data Anime Populer

    End Point : `/anime-populer` query params `page`

    Response:
    ```
        {
            "status" : "OK,
            "data" : [
                {
                    "title": String,
                    "image": String,
                    "linkId": String,
                    "rating": String,
                    "serial": String,
                    "type": String
                },
                ...
            ]
        }
    ```

* ### Mengambil Data Anime Terbaru

    End Point : `/anime-terbaru`

    Response:
    ```
        {
            "status" : "OK,
            "data" : [
                {
                    "imageUrl": String,
                    "title": String,
                    "streamId": String,
                    "episode": String,
                    "serial": String,
                },
                ...
            ]
        }
    ```

* ### Mengambil Detail Anime

    End Point : `/anime/${linkId}`

    Response:
    ```
        {
            "image": String,
            "title" : String,
            "rating": String,
            "sinopsis" String,
            "details": Array,
            "genres": Array,
            episodes: Array
        }
    ```

* ### Mengambil data video stream

    End Point : `/watch/${streamId}`

    Response:
    ```
        {
            "streamLink": String,
        }
    ```