"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapper = void 0;
const wrapper = (fn) => (...args) => fn(...args).catch(args[2]);
exports.wrapper = wrapper;
