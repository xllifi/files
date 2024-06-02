// ==UserScript==
// @name         Патчи для админ-панели Minecraft.RENT
// @namespace    https://xllifi.ru
// @version      2024-06-02-15
// @description  Улучшения для админ-панели Minecraft.RENT
// @author       xllifi
// @match        https://team.minecraft.rent/*
// @icon         https://minecraft.rent/favicon.ico
// @grant        GM_addStyle
// ==/UserScript==

(function () {
       'use strict';
       console.log("Скрипт с патчами начал работу.");
       /* Находим панель со вкладками */ const tabsBar = document.getElementsByClassName("w-full h-[60px] bg-[#22293b] rounded-lg flex items-center gap-6 px-6")[0];
       /* Создаём элемент со статусом */ const statusMsg = document.createElement('a'); statusMsg.className = 'text-white'; statusMsg.style.cssText = 'margin-left: auto; margin-right: 0.5rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem;';

       // Запрашиваем стиль с гитхаба
       var req = new XMLHttpRequest();
       req.open('GET', 'https://raw.githubusercontent.com/xllifi/files/main/mcrccss.css', false); req.send();
       // Если стиль до нас дошёл, применяем
       if (req.status == 200) {
              GM_addStyle(req.responseText);
              console.log("[Патчи] CSS загружен с GitHub и применён");
              statusMsg.style.setProperty('background-color', 'rgba(34, 197, 94, 0.5)')
              statusMsg.textContent = 'CSS патча загружен';
              tabsBar.appendChild(statusMsg);
       } else {
              console.error("[Патчи] Не удалось загрузить CSS с GitHub");
              statusMsg.style.setProperty('background-color', 'rgba(239, 68, 68, 0.5)')
              statusMsg.textContent = 'Не удалось получить CSS патча!';
              tabsBar.appendChild(statusMsg);
       }
})();
