const puppeteer = require("puppeteer");

const scraper = {
    browser: null,
    page: null,
    base_url: "https://animeindo.link",
    initialize: async () => {
        scraper.browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        scraper.page = await scraper.browser.newPage();
    },
    animeTerbaru: async () => {
        await scraper.page.goto(scraper.base_url);
        // scraping
        await scraper.page.waitForSelector("div#primary");
        let animeTerbaru = await scraper.page.$$eval(".widget_senction:nth-child(1) article", (article) => {
            let titles = article.map(el => el.querySelector(".dataver2 .title").innerText);
            let images = article.map(el => el.querySelector("img").getAttribute("src"));
            let links = article.map(el => el.querySelector("a").getAttribute("href"));
            let episode = article.map(el => el.querySelector(".episode").innerText);
            let serials = article.map(el => el.querySelector(".type").innerText);

            // buat data
            const data = [];
            for (let i = 0; i < titles.length; i++) {
                data.push({
                    imageUrl: images[i],
                    title: titles[i],
                    linkId: links[i].replace("https://animeindo.link", ""),
                    episode: episode[i],
                    serial: serials[i],
                });
            }

            return data;
        });
        await scraper.browser.close();

        return JSON.stringify({
            status: "OK",
            data: animeTerbaru,
        });
    },
    animePopuler: async (page = null) => {
        const pagination = page == null ? "" : "page/" + page;
        await scraper.page.goto(scraper.base_url + "/populer/" + pagination);
        await scraper.page.waitForSelector("main#main");
        // scraping
        let animePopuler = await scraper.page.$$eval("div.relat article", (article) => {
            let titles = article.map(el => el.querySelector(".title h2").innerText);
            let images = article.map(el => el.querySelector("img").src);
            let links = article.map(el => el.querySelector("a").href);
            let ratings = article.map(el => el.querySelector(".score").innerText);
            let serials = article.map(el => el.querySelector(".content-thumb .type").innerText);
            let types = article.map(el => el.querySelector(".data .type").innerText);

            const data = [];
            for (let i = 0; i < titles.length; i++) {
                data.push({
                    title: titles[i],
                    image: images[i],
                    linkId: links[i].replace("https://animeindo.link", ""),
                    rating: ratings[i].trim(),
                    serial: serials[i],
                    type: types[i],
                });
            }

            return data;
        });
        await scraper.browser.close();

        return JSON.stringify({
            status: "OK",
            data: animePopuler,
        });
    },
    daftarAnime: async (page = null) => {
        const pagination = page == null ? "" : "page/" + page;
        await scraper.page.goto(scraper.base_url + "/daftar-anime/" + pagination);
        await scraper.page.waitForSelector("main#main");
        // scraping
        let daftarAnime = await scraper.page.$$eval("div.relat article", (article) => {
            let titles = article.map(el => el.querySelector(".title h2").innerText);
            let images = article.map(el => el.querySelector("img").src);
            let links = article.map(el => el.querySelector("a").href);
            let ratings = article.map(el => el.querySelector(".score").innerText);
            let serials = article.map(el => el.querySelector(".content-thumb .type").innerText);
            let types = article.map(el => el.querySelector(".data .type").innerText);

            const data = [];
            for (let i = 0; i < titles.length; i++) {
                data.push({
                    title: titles[i],
                    image: images[i],
                    linkId: links[i].replace("https://animeindo.link", ""),
                    rating: ratings[i].trim(),
                    serial: serials[i],
                    type: types[i],
                });
            }

            return data;
        });

        return JSON.stringify({
            status: "OK",
            data: daftarAnime,
        });
    },
    detailAnime: async (linkId) => {
        await scraper.page.goto(scraper.base_url + "/anime/" + linkId, {
            waitUntil: "networkidle2"
        });

        // scraping data
        let image = await scraper.page.evaluate(() => document.querySelector(".thumb img").getAttribute("src"));
        let title = await scraper.page.evaluate(() => document.querySelector(".infox h1.entry-title").innerText);
        let rating = await scraper.page.evaluate(() => document.querySelector(".rating strong").innerText);
        let sinopsis = await scraper.page.evaluate(() => document.querySelector(".entry-content p").innerText);

        // details
        let details = await scraper.page.evaluate(() => {
            let details = document.querySelectorAll(".spe span");
            const data = [];
            details.forEach(element => {
                let title = element.querySelector("b").innerText;
                let content = element.innerText.replace(title, "");
                data.push({
                    title: title.replace(":", ""),
                    content: content.trim(),
                });
            });

            return data;
        });

        // genres
        let genres = await scraper.page.evaluate(() => {
            let genres = document.querySelectorAll(".genxed a");
            const data = [];
            genres.forEach(element => data.push({
                title: element.innerText,
                link: element.getAttribute("href"),
            }));

            return data;
        });

        // episodes
        let episodes = await scraper.page.$$eval("#mCSB_2_container li", element => {
            let epsNum = element.map(el => el.querySelector(".epsright .eps a").innerText);
            let links = element.map(el => el.querySelector(".epsright .eps a").getAttribute("href"));
            let dates = element.map(el => el.querySelector(".epsleft .date").innerText);

            const data = [];
            for (let i = 0; i < epsNum.length; i++) {
                data.push({
                    episodeNumber: epsNum[i],
                    streamId: links[i].replace("https://animeindo.link", ""),
                    releaseDate: dates[i],
                })
            }
            return data;
        });
        // console.log(episodes);

        await scraper.browser.close();

        return JSON.stringify({
            image: image,
            title: title,
            rating: rating.replace("Rating ", ""),
            sinopsis: sinopsis,
            details: details,
            genres: genres,
            episodes: episodes,
        });
    },
    searchAnime: async (search, page = null) => {
        const pagination = page == null ? "" : "page/" + page;
        await scraper.page.goto(scraper.base_url + "/" + pagination + "?s=" + search);
        await scraper.page.waitForSelector("main#main");
        // scraping
        let searchAnime = await scraper.page.$$eval("article", (article) => {
            let titles = article.map(el => el.querySelector(".title h2").innerText);
            let images = article.map(el => el.querySelector("img").src);
            let links = article.map(el => el.querySelector("a").href);
            let ratings = article.map(el => el.querySelector(".score").innerText);
            let serials = article.map(el => el.querySelector(".content-thumb .type").innerText);
            let types = article.map(el => el.querySelector(".data .type").innerText);

            const data = [];
            for (let i = 0; i < titles.length; i++) {
                data.push({
                    title: titles[i],
                    image: images[i],
                    linkId: links[i].replace("https://animeindo.link", ""),
                    rating: ratings[i].trim(),
                    serial: serials[i],
                    type: types[i],
                });
            }

            return data;
        });
        await scraper.browser.close();

        return JSON.stringify({
            status: "OK",
            data: searchAnime,
        });
    },
    getStreamlink: async (streamId) => {
        await scraper.page.goto(scraper.base_url + "/" + streamId, {
            waitUntil: "networkidle2"
        });

        let iframe = await scraper.page.evaluate(() => document.querySelector("iframe.playeriframe").getAttribute("src"));
        await scraper.browser.close();

        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        await page.goto(iframe, {
            waitUntil: "domcontentloaded"
        });
        await page.waitForSelector("video");
        let streamLink = await page.evaluate(() => document.querySelector("video").getAttribute("src"));
        browser.close();

        return JSON.stringify({
            streamLink: streamLink,
        })
    },
}

module.exports = scraper;