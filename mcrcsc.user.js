// ==UserScript==
// @name         Патчи админки Minecraft.RENT
// @namespace    https://xllifi.ru
// @version      0.0.10
// @description  Улучшения для админ-панели Minecraft.RENT
// @author       xllifi
// @match        https://team.minecraft.rent/*
// @icon         https://minecraft.rent/favicon.ico
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

'use strict';
var expandIcon = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-expand'><path d='m21 21-6-6m6 6v-4.8m0 4.8h-4.8'/><path d='M3 16.2V21m0 0h4.8M3 21l6-6'/><path d='M21 7.8V3m0 0h-4.8M21 3l-6 6'/><path d='M3 7.8V3m0 0h4.8M3 3l6 6'/></svg>")`;
var shrinkIcon = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-shrink'><path d='m15 15 6 6m-6-6v4.8m0-4.8h4.8'/><path d='M9 19.8V15m0 0H4.2M9 15l-6 6'/><path d='M15 4.2V9m0 0h4.8M15 9l6-6'/><path d='M9 4.2V9m0 0H4.2M9 9 3 3'/></svg>")`;


console.log("[Патчи] Скрипт начал работу.");
/* Создаём ссылку на стиль CSS */ var cssElement = document.createElement('link'); cssElement.rel = 'stylesheet'; document.head.appendChild(cssElement);
/* рандомные цифры в конце     */ cssElement.href = 'https://xllifi.github.io/files/mcrccss.css?q=' + Math.floor(Math.random() * Math.pow(10, 10));
/* предотвращают кеширование   */

/* Находим панель со вкладками */ const tabsBar = document.getElementsByClassName("min-w-[300px] h-screen bg-[#22293b] fixed top-0 left-0")[0];
/* Создаём элемент со статусом */ const statusMsg = document.createElement('a'); statusMsg.setAttribute("target", "_blank"); statusMsg.href = 'https://github.com/xllifi/files/raw/main/mcrcsc.user.js'; statusMsg.className = 'text-white'; statusMsg.style.cssText = 'padding: 1rem 2rem; display: flex; background-color: rgba(34, 197, 94, 0.5); background-image: url(\"data:image\/svg+xml;utf8,<svg xmlns=\'http:\/\/www.w3.org\/2000\/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'lucide lucide-check-check\'><path d=\'M18 6 7 17l-5-5\'\/><path d=\'m22 10-7.5 7.5L13 16\'\/><\/svg>\"); background-size: 1.5rem; background-repeat: no-repeat; background-position: right 1rem center;'; statusMsg.textContent = 'Патч загружен'; tabsBar.appendChild(statusMsg);

/* Добавляем иконку сайту      */ var faviconLink = document.createElement('link'); faviconLink.rel = 'icon'; document.head.appendChild(faviconLink); faviconLink.href = 'https://minecraft.rent/favicon.ico'

/* Отсоединение консоли */ if (window.location.href.match("https:\/\/team.minecraft.rent\/servers\/.{8}")) {
    console.log('[Патчи] Обнаружена страница управления сервером: ' + window.location.href);
    document.title = 'ПУ сервера ' + window.location.href.split("https:\/\/team.minecraft.rent\/servers\/", 2)[1] + ' | Админ-панель Minecraft.RENT';

    /*           Находим элемент консоли */ const consoleWrapper = document.getElementById('console-scroll');
    /* Создаё заполнитель высоты консоли */ const consoleHeightHolder = document.createElement('div'); consoleHeightHolder.style.cssText = 'height: 500px; width: 100%;'; consoleHeightHolder.id = 'consoleHeightHolder';
    /* Создаём элемент для переключателя */ const consoleExpandToggle = document.createElement('button'); consoleExpandToggle.id = 'consoleExpandToggle'; consoleExpandToggle.classList.add('consoleExpandToggle'); consoleExpandToggle.style.backgroundImage = expandIcon;
    consoleExpandToggle.onclick = function () {
        // const consoleExpandToggle = document.getElementById('consoleExpandToggle');
        var consoleWrapperClasses = consoleWrapper.className;
        if (consoleWrapperClasses.includes("expanded")) {
            consoleWrapper.classList.remove('expanded'); consoleWrapper.style.width = null; consoleWrapper.style.height = null; consoleWrapper.style.animation = 'consoleShrink 200ms';

            consoleExpandToggle.style.backgroundImage = expandIcon;

            document.getElementById('consoleHeightHolder').remove();
        } else {
            consoleWrapper.classList.add('expanded');

            consoleExpandToggle.style.backgroundImage = shrinkIcon;

            consoleWrapper.parentElement.insertBefore(consoleHeightHolder, consoleWrapper.nextElementSibling); consoleWrapper.style.animation = 'consoleExpand 200ms';
        }
    };
    consoleWrapper.appendChild(consoleExpandToggle);
/* Любимые сервера      */ } else if (window.location.href === "https://team.minecraft.rent/servers" || "https://team.minecraft.rent/servers/") {
    console.log('[Патчи] Обнаружена страница поиска: ' + window.location.href);
    document.title = 'Поиск серверов | Админ-панель Minecraft.RENT';

    /* Строка поиска */
    const favServersJSON = localStorage.getItem("favServersJSON")
    var favServersArray = []; // Создаёт пустой массив
    if (favServersJSON != null) {
        favServersArray = JSON.parse(favServersJSON); // Возвращает массив
    }

    const searchBar = document.querySelector("body div.w-screen.flex div.w-full.p-6 div form div");
    const favServerWrapper = document.createElement('div'); favServerWrapper.id = "favServerWrapper"; searchBar.append(favServerWrapper);
    const favServerText = document.createElement('p'); favServerText.textContent = 'Избранные сервера:'
    const favServer = document.createElement('a');
    var allAnchorElements = favServerWrapper.childNodes;
    searchBar.append(favServerWrapper);
    console.log(favServersJSON + "\n" + favServersArray.length + "\n" + document.getElementById("favServerWrapper").firstChild + "\n");

    function updateFavServers() {
        console.log('updating fav servers')
        if (favServersJSON != null && favServersArray.length != 0 && document.getElementById("favServerWrapper").firstChild == null) {
            // favServerWrapper.appendChild(favServerText); console.log('aopending text, favServersArray.length = '+favServersArray.length)
        } else {
            allAnchorElements = favServerWrapper.childNodes;
            while (allAnchorElements.length > 0) {
                allAnchorElements[0].remove();
            }
        }

        if (allAnchorElements.length == 0 && favServersJSON != null && favServersArray.length != 0 && document.getElementById("favServerWrapper").firstChild == null) {
            favServerWrapper.appendChild(favServerText);
        }
        for (i = 0; i < favServersArray.length; i++) {
            favServer.textContent = favServersArray[i]; favServer.href = 'https://team.minecraft.rent/servers/' + favServersArray[i]; favServerWrapper.appendChild(favServer.cloneNode(true));
        }
    }
    updateFavServers();

    function favClicked(actor) {
        console.log(actor);
        const currentServerID = actor.nextSibling.nextSibling.textContent.replace(/("|\n|\W)/gm, "");

        if (!favServersArray.includes(currentServerID)) {
            favServersArray.push(currentServerID);
            console.log(`favServersArray.push(currentServerID) resulted in: ` + JSON.stringify(favServersArray));
        } else {
            var favIndex = favServersArray.indexOf(currentServerID);
            favServersArray.splice(favIndex, 1);
        }

        localStorage.setItem("favServersJSON", JSON.stringify(favServersArray));
        updateFavServers();
    }

    if(!unsafeWindow.favClicked) {
        unsafeWindow.favClicked = favClicked;
    }

        /* Добавление кнопки "Избранное" */ const searchTableContents = document.querySelector("body div div table").childNodes;
    const favButton = document.createElement('button'); favButton.setAttribute("onclick", "favClicked(this)");

    for (var i = 0; i < searchTableContents.length; i++) {
        if (searchTableContents[i].tagName == "TBODY" && searchTableContents[i].lastElementChild.firstElementChild.firstElementChild.textContent == "UUID") {
            var uuidEl = searchTableContents[i].lastElementChild.firstElementChild;
            uuidEl.insertBefore(favButton.cloneNode(true), uuidEl.firstElementChild);
            console.log('[Патчи] Кнопка "Избранное" добавлена к серверу ' + searchTableContents[i].lastElementChild.firstElementChild.lastChild.textContent.replace(/("|\n|\W)/gm, ""))
        }
    }
} else {
    console.log('no known link found');
    // alert("not in server control");
};
