"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const src_1 = require("../src");
// @ts-ignore
const app = document.getElementById("app");
const root = client_1.default.createRoot(app);
root.render(react_1.default.createElement(src_1.DataDisplay, { onDataRequest: "ee", data: "ss" }));
