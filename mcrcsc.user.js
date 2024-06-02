// ==UserScript==
// @name         Патчи админки Minecraft.RENT
// @namespace    https://xllifi.ru
// @version      0.0.4
// @description  Улучшения для админ-панели Minecraft.RENT
// @author       xllifi
// @match        https://team.minecraft.rent/*
// @icon         https://minecraft.rent/favicon.ico
// @run-at       document-end
// ==/UserScript==

(async function () {
    'use strict';
    console.log("Скрипт с патчами начал работу.");
    /* Создаём ссылку на стиль CSS */ var cssElement = document.createElement('link'); cssElement.rel = 'stylesheet'; document.head.appendChild(cssElement);
    /* рандомные цифры в конце     */ cssElement.href = 'https://xllifi.github.io/files/mcrccss.css?q=' + Math.floor(Math.random() * Math.pow(10, 10));
    /* ссылки предотвращают кеширование */

    /* Находим панель со вкладками */ const tabsBar = document.getElementsByClassName("min-w-[300px] h-screen bg-[#22293b] fixed top-0 left-0")[0];
    /* Создаём элемент со статусом */ const statusMsg = document.createElement('a'); statusMsg.className = 'text-white'; statusMsg.style.cssText = 'padding: 1rem 2rem; display: flex; background-color: rgba(34, 197, 94, 0.5); background-image: url(\"data:image\/svg+xml;utf8,<svg xmlns=\'http:\/\/www.w3.org\/2000\/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'lucide lucide-check-check\'><path d=\'M18 6 7 17l-5-5\'\/><path d=\'m22 10-7.5 7.5L13 16\'\/><\/svg>\"); background-size: 1.5rem; background-repeat: no-repeat; background-position: right 1rem center;'; statusMsg.textContent = 'Патч загружен'; tabsBar.appendChild(statusMsg);
})();
