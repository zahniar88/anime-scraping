const express = require("express");
const scraper = require("./controllers/scraper");

/**
 * App Variable
 */
const app = express();
const port = process.env.PORT || "3000";

/**
 * Routes Definition
 */
app.get("/", async (req, res, next) => {
    let page = req.query.page !== undefined ? req.query.page : null;
    let search = req.query.search !== undefined ? req.query.search : null;

    try {
        await scraper.initialize();
        if (search != null) {
            let data = await scraper.searchAnime(search, page);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
            res.end(data);
        } else {
            let data = await scraper.daftarAnime(page);
            res.end(data);
        }
    } catch (error) {
        next(error);
    }
});

app.get("/anime-terbaru", async (req, res, next) => {
    try {
        await scraper.initialize();
        let data = await scraper.animeTerbaru();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
        res.end(data);
    } catch (error) {
        next(error);
    }
});

app.get("/anime-populer", async (req, res, next) => {
    let page = req.query.page !== undefined ? req.query.page : null;
    try {
        await scraper.initialize();
        let data = await scraper.animePopuler(page);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
        res.end(data);
    } catch (error) {
        next(error);
    }
});

app.get("/anime/:linkId", async (req, res, next) => {
    try {
        await scraper.initialize();
        let data = await scraper.detailAnime(req.params.linkId);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
        res.end(data);
    } catch (error) {
        next(error);
    }
});

app.get("/watch/:streamId", async (req, res, next) => {
    try {
        await scraper.initialize();
        let data = await scraper.getStreamlink(req.params.streamId);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
        res.end(data);
    } catch (error) {
        next(error);
    }
});

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listen port ${port}`);
});