// ==UserScript==
// @name         Патчи админки Minecraft.RENT
// @namespace    https://xllifi.ru
// @version      0.0.12
// @description  Улучшения для админ-панели Minecraft.RENT
// @author       xllifi
// @match        https://*.minecraft.rent/*
// @exclude      https://my.minecraft.rent/*
// @exclude      https://minecraft.rent
// @icon         https://minecraft.rent/favicon.ico
// @grant        unsafeWindow
// @grant        GM_info
// @run-at       document-start
// ==/UserScript==

'use strict';
var expandIcon = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m21 21-6-6m6 6v-4.8m0 4.8h-4.8'/><path d='M3 16.2V21m0 0h4.8M3 21l6-6'/><path d='M21 7.8V3m0 0h-4.8M21 3l-6 6'/><path d='M3 7.8V3m0 0h4.8M3 3l6 6'/></svg>")`;
var shrinkIcon = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m15 15 6 6m-6-6v4.8m0-4.8h4.8'/><path d='M9 19.8V15m0 0H4.2M9 15l-6 6'/><path d='M15 4.2V9m0 0h4.8M15 9l6-6'/><path d='M9 4.2V9m0 0H4.2M9 9 3 3'/></svg>")`;
var tickIcon   = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 6 7 17l-5-5'/><path d='m22 10-7.5 7.5L13 16'/></svg>")`;
var updateIcon = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8'/><path d='M3 3v5h5'/><path d='M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16'/><path d='M16 16h5v5'/></svg>")`;
var dblQIcon   = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12.9,6.1c2-2.1,5.4-2.3,7.6-0.3c1.6,1.5,2.1,3.9,1.3,6.1c-1.6,3.3-7.2,2.6-7.2,2.6'/><path d='M13.2,19.6L13.2,19.6'/><path d='M2,9.6c0.1-2.1,2-3.7,4-3.5C7.7,6.2,9,7.3,9.5,8.9c0.6,2.4-2.6,4.7-2.6,4.7'/><path d='M8.2,18.3L8.2,18.3'/></svg>")`;


console.log("[Патчи] Скрипт начал работу.");

/* ======== Переменные ======= */
/*  Заполнитель высоты консоли */ const consoleHeightHolder = document.createElement('div'); consoleHeightHolder.style.cssText = 'height: 500px; width: 100%;'; consoleHeightHolder.id = 'consoleHeightHolder';
/*   Элемент для переключателя */ const consoleExpandToggle = document.createElement('button'); consoleExpandToggle.id = 'consoleExpandToggle'; consoleExpandToggle.classList.add('consoleExpandToggle'); consoleExpandToggle.style.backgroundImage = expandIcon; consoleExpandToggle.setAttribute("onclick", "toggleConsoleExpand()");
/*    Враппер любимых серверов */ const favServerWrapper = document.createElement('div'); favServerWrapper.id = "favServerWrapper";
/*  Текст для любимых серверов */ const favServerText = document.createElement('p'); favServerText.textContent = 'Избранные сервера:';
/*     Кнопка любимого сервера */ const favServer = document.createElement('a');
/*    Получаем массив серверов */ const favServersJSON = localStorage.getItem("favServersJSON");
/*                   CSS стиль */ var cssElement = document.createElement('link'); cssElement.rel = 'stylesheet'; document.head.appendChild(cssElement);
/*                      Иконка */ var faviconLink = document.createElement('link'); faviconLink.rel = 'icon'; faviconLink.setAttribute('href', 'https://minecraft.rent/favicon.ico');
var favServersArray = [];
if (favServersJSON != null) {
    favServersArray = JSON.parse(favServersJSON); // Возвращает массив
}

/* ====== Элементы HEAD ====== */
cssElement.href = 'https://xllifi.github.io/files/mcrccss.css?q=' + Math.floor(Math.random() * Math.pow(10, 10));
document.head.appendChild(faviconLink);


/* ========= Функции ========= */
function updateFavServers() {
    console.log('updating fav servers')

    var allAnchorElements = favServerWrapper.childNodes;
    if (favServersArray.length == 0 /*любимых сервров нет*/ && allAnchorElements.length != 0 /*но элементы для них есть*/) {
        while (allAnchorElements.length > 0) {
            allAnchorElements[0].remove();
            console.log(allAnchorElements[0] + " removed");
        }
    }
    if (allAnchorElements.length == 0 && favServersArray.length != 0) {
        favServerWrapper.appendChild(favServerText);
    }
    for (var i = 0; i < favServersArray.length; i++) {
        favServer.textContent = favServersArray[i]; favServer.href = '/servers/' + favServersArray[i]; favServerWrapper.appendChild(favServer.cloneNode(true));
    }
};
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
};
function toggleConsoleExpand() {
    const consoleWrapper = document.getElementById('console-scroll');
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

if (!unsafeWindow.favClicked) {
    unsafeWindow.favClicked = favClicked;
}
if (!unsafeWindow.toggleConsoleExpand) {
    unsafeWindow.toggleConsoleExpand = toggleConsoleExpand;
}

//
// Загрузка страницы началась
//

/* Страница сервера */ if (window.location.href.match(/.+servers\/[\da-zA-Z]{8}.*/g)) {
    console.log('[Патчи] Обнаружена страница управления сервером: ' + window.location.href);
    document.title = 'ПУ сервера ' + window.location.href.match(/(?<=.+servers\/)[\da-zA-Z]{8}/g) + ' | Админ-панель Minecraft.RENT';
/*   Поиск серверов */ } else if (window.location.href.includes("/servers") && !window.location.href.match(/.+servers\/[\da-zA-Z]{8}.*/g)) {
    console.log('[Патчи] Обнаружена страница поиска: ' + window.location.href);
    document.title = 'Поиск серверов | Админ-панель Minecraft.RENT';
} else {
    console.log('[Патчи] Ни одной известной и поддерживаемой ссылки не найдено');
};

//
// Загрузка страницы завершена
//

window.onload = async function () {
    /*    Находим строку с поиском */ const searchBar = document.querySelectorAll('[action="/servers"]')[0].lastElementChild;
    /* Находим панель со вкладками */ const tabsBar = document.getElementsByClassName("min-w-[300px] h-screen bg-[#22293b] fixed top-0 left-0")[0];
    /* Создаём элемент со статусом */ const statusMsg = document.createElement('a'); statusMsg.setAttribute("target", "_blank"); statusMsg.href = 'https://github.com/xllifi/files/raw/main/mcrcsc.user.js'; statusMsg.classList.add(...['text-white', 'statusMsg']);

    /* ===== Проверка версии ===== */
    var response = await fetch('https://xllifi.github.io/files/mcrcsc.user.js?q=' + Math.floor(Math.random() * Math.pow(10, 10)));
    const latest_version = parseInt((await response.text()).match(/(?<=\/\/ @version\s+)[\d\.]+/gm)[0].replaceAll("\.", ""));
    const current_version = parseInt(GM_info.script.version.replaceAll("\.", ""))
        if (current_version < latest_version) {
            console.log('[Патчи] Устаревшая версия');
            statusMsg.textContent = 'Доступно обновление!';
            statusMsg.style.backgroundImage = updateIcon;
            statusMsg.style.backgroundColor = 'rgba(245, 158, 11, 0.5)';
        } else if (current_version > latest_version) {
            console.log('[Патчи] Слишком новая версия');
            statusMsg.textContent = 'Неправильная версия!';
            statusMsg.style.backgroundImage = dblQIcon;
            statusMsg.style.backgroundColor = 'rgba(109, 40, 217, 0.5)';
        } else {
            statusMsg.textContent = 'Обновлений не найдено';
            statusMsg.style.backgroundImage = tickIcon;
            statusMsg.style.backgroundColor = 'rgba(34, 197, 94, 0.5)';
        }

    tabsBar.appendChild(statusMsg);

    searchBar.append(favServerWrapper);
    // console.log(favServersJSON + "\n" + favServersArray.length + "\n" + document.getElementById("favServerWrapper").firstChild + "\n");

    if (window.location.href.match(/.+servers\/[\da-zA-Z]{8}/g) && !window.location.href.match(/.+servers\/[\da-zA-Z]{8}.+/g)) { /* Страница информации о сервере */
        /*            Находим элемент консоли */ const consoleWrapper = document.getElementById('console-scroll');
        consoleWrapper.appendChild(consoleExpandToggle);
    } else if (window.location.href.includes("/servers") && !window.location.href.match(/.+servers\/[\da-zA-Z]{8}.*/g)) { /* Страница поиска */
        const resultsTable = document.querySelector("body div div table");
        if (resultsTable != null) {
            const searchTableContents = resultsTable.childNodes;
            const favButton = document.createElement('button'); favButton.setAttribute("onclick", "favClicked(this)");
            for (var i = 0, arr = resultsTable.childNodes; i < arr.length; i++) {
                if (searchTableContents[i].tagName == "TBODY" && searchTableContents[i].lastElementChild.firstElementChild.firstElementChild.textContent == "UUID") {
                    var uuidEl = searchTableContents[i].lastElementChild.firstElementChild;
                    uuidEl.insertBefore(favButton.cloneNode(true), uuidEl.firstElementChild);
                    console.log('[Патчи] Кнопка "Избранное" добавлена к серверу ' + searchTableContents[i].lastElementChild.firstElementChild.lastChild.textContent.replace(/("|\n|\W)/gm, ""))
                }
            }
        }
    };
    updateFavServers();
};
