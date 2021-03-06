"use strict";

const BrowserModule = require('./browser_module');
const WebWorker = require('../models/webworker');

module.exports = class BrowserWebWorkers extends BrowserModule {
    all() {
        return this._browser.page.workers().map((ww) => {
            return new WebWorker(ww);
        });
    }
};
