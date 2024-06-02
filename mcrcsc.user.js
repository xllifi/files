// ==UserScript==
// @name         Патчи для админ-панели Minecraft.RENT
// @namespace    https://xllifi.ru
// @version      0.0.2
// @description  Улучшения для админ-панели Minecraft.RENT
// @author       xllifi
// @match        https://team.minecraft.rent/*
// @icon         https://minecraft.rent/favicon.ico
// @grant        GM_addStyle
// ==/UserScript==

(function () {
       'use strict';
       console.log("Скрипт с патчами начал работу.");
       /* Находим панель со вкладками */ const tabsBar = document.getElementsByClassName("min-w-[300px] h-screen bg-[#22293b] fixed top-0 left-0")[0];
       /* Создаём элемент со статусом */ const statusMsg = document.createElement('a'); statusMsg.className = 'text-white'; statusMsg.style.cssText = 'padding: 1rem 2rem; display: flex; background-color: rgba(34, 197, 94, 0.5); background-size: 1.5rem; background-repeat: no-repeat; background-position: right 1rem center;';

       // Запрашиваем стиль с гитхаба
       var req = new XMLHttpRequest();
       req.open('GET', 'https://raw.githubusercontent.com/xllifi/files/main/mcrccss.css', false); req.send();
       // Если стиль до нас дошёл, применяем
       if (req.status == 200) {
              GM_addStyle(req.responseText);
              console.log("[Патчи] CSS загружен с GitHub и применён");
              statusMsg.style.setProperty('background-color', 'rgba(34, 197, 94, 0.5)');
              statusMsg.style.setProperty('background-image', 'url(\"data:image\/svg+xml;utf8,<svg xmlns=\'http:\/\/www.w3.org\/2000\/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'lucide lucide-check-check\'><path d=\'M18 6 7 17l-5-5\'\/><path d=\'m22 10-7.5 7.5L13 16\'\/><\/svg>\")');
              statusMsg.textContent = 'CSS патча загружен';
              tabsBar.appendChild(statusMsg);
       } else {
              console.error("[Патчи] Не удалось загрузить CSS с GitHub");
              statusMsg.style.setProperty('background-color', 'rgba(239, 68, 68, 0.5)');
              statusMsg.style.setProperty('background-image', 'url(\"data:image\/svg+xml;utf8,<svg xmlns=\'http:\/\/www.w3.org\/2000\/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'lucide lucide-unlink\'><path d=\'m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71\'\/><path d=\'m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71\'\/><line x1=\'8\' x2=\'8\' y1=\'2\' y2=\'5\'\/><line x1=\'2\' x2=\'5\' y1=\'8\' y2=\'8\'\/><line x1=\'16\' x2=\'16\' y1=\'19\' y2=\'22\'\/><line x1=\'19\' x2=\'22\' y1=\'16\' y2=\'16\'\/><\/svg>\")');
              statusMsg.textContent = 'CSS не загружен!';
              tabsBar.appendChild(statusMsg);
       }
})();
