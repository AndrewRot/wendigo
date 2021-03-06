"use strict";

const mix = require('mixwith').mix;
const compose = require('compositer');
const BrowserCore = require('./browser_core');
const BrowserAssertion = require('./modules/assertions/browser_assertions');
const BrowserModule = require('./modules/browser_module');
const {FatalError} = require('./errors');

const mixins = [
    require("./mixins/browser_actions"),
    require("./mixins/browser_info"),
    require("./mixins/browser_navigation"),
    require("./mixins/browser_queries"),
    require("./mixins/browser_wait")
];

module.exports = class BrowserFactory {
    static createBrowser(page, settings, components, assertComponents) {
        if (!this._BrowserClass) this._BrowserClass = this._createBrowserClass(components, assertComponents);
        const browser = new this._BrowserClass(page, settings);
        return browser;
    }

    static clearCache() {
        this._BrowserClass = undefined;
    }

    static _createBrowserClass(components, assertComponents) {
        const BaseClass = this._createBrowserMixin();
        return this._setupBrowserComponents(BaseClass, components, assertComponents);
    }

    static _setupBrowserComponents(BaseClass, components, assertComponents) {
        const AssertModule = this._createAssertModule(assertComponents);
        const finalComponents = Object.assign({}, components, {"assert": AssertModule});
        this._validateComponents(Object.values(finalComponents), BrowserModule);
        return compose(BaseClass, finalComponents);
    }

    static _createAssertModule(components) {
        return compose(BrowserAssertion, components);
    }

    static _validateComponents(components, BaseComponent) {
        for (const c of components) {
            if (!(c.prototype instanceof BaseComponent)) {
                throw new FatalError(`Component ${c} [${c.name}] is not an instance of ${BaseComponent.name}.`);
            }
        }
    }

    static _createBrowserMixin() {
        return class Browser extends mix(BrowserCore).with(...mixins) {
        };
    }
};
