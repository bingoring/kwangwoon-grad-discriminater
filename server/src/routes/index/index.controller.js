'use strict'
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

exports.demo = async (req, res) => {
    console.log("here is indexpage");
    res.send({
        resultCode: 0,
        message: "indexpage"
    })
};