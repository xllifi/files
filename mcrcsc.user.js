// ==UserScript==
// @name         Патчи для админ-панели Minecraft.RENT
// @namespace    https://xllifi.ru
// @version      2024-06-02
// @description  Улучшения для админ-панели Minecraft.RENT
// @author       xllifi
// @match        https://team.minecraft.rent/*
// @icon         https://minecraft.rent/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     IMPORT_MCRCCSS https://raw.githubusercontent.com/xllifi/files/main/mcrccss.css
// ==/UserScript==

(function() {
    'use strict';
    console.log("Патчи применяются!");
    const mcrccss = GM_getResourceText("IMPORT_MCRCCSS");
    GM_addStyle(mcrccss);
    console.log("CSS применён!");
})();
