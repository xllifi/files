// ==UserScript==
// @name         Патчи админки Minecraft.RENT
// @namespace    https://xllifi.ru
// @version      0.0.27
// @description  Улучшения для админ-панели Minecraft.RENT
// @author       xllifi
// @match        https://*.minerent.net/*
// @exclude      https://minerent.net/*
// @icon         https://minerent.net/favicon.ico
// @grant        unsafeWindow
// @grant        GM_info
// @run-at       document-start
// ==/UserScript==

'use strict';
var expandIcon = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none' stroke-linecap='round' stroke-linejoin='round'><defs><g id='expandButtonPath'><path d='m21 23-6-6m6 6v-4.8m0 4.8h-4.8' /><path d='M3 18.2V23m0 0h4.8M3 23l6-6' /><path d='M21 9.8V5m0 0h-4.8M21 5l-6 6' /><path d='M3 9.8V5m0 0h4.8M3 5l6 6' /></g></defs><use href='%23expandButtonPath' stroke='%231c2230' stroke-width='8'></use><use href='%23expandButtonPath' stroke='white' stroke-width='2'></use></svg>")`;
var shrinkIcon = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none' stroke-linecap='round' stroke-linejoin='round'><defs><g id='shrinkButtonPath'><path d='m15 17 6 6m-6-6v4.8m0-4.8h4.8' /><path d='M9 21.8V17m0 0H4.2M9 17l-6 6' /><path d='M15 6.2V11m0 0h4.8M15 11l6-6' /><path d='M9 6.2V11m0 0H4.2M9 11 3 5' /></g></defs><use href='%23shrinkButtonPath' stroke='%231c2230' stroke-width='8' /><use href='%23shrinkButtonPath' stroke='white' stroke-width='2' /></svg>")`;

var scrollIconDisabled = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none' stroke-linecap='round' stroke-linejoin='round'><defs><g id='scrollButtonPath'><path d='M12 19V5'/><path d='m6 13 6 6 6-6'/><path d='M19 23H5'/></g></defs><use href='%23scrollButtonPath' stroke='%231c2230' stroke-width='8'/><use href='%23scrollButtonPath' stroke='white' stroke-width='2'/></svg>")`;
var scrollIconEnabled  = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none' stroke-linecap='round' stroke-linejoin='round'><defs><g id='scrollButtonPath'><path d='M12 19V5'/><path d='m6 13 6 6 6-6'/><path d='M19 23H5'/></g></defs><use href='%23scrollButtonPath' stroke='%230078eb' stroke-width='8'/><use href='%23scrollButtonPath' stroke='white' stroke-width='2'/></svg>")`;

var tickIcon   = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 6 7 17l-5-5'/><path d='m22 10-7.5 7.5L13 16'/></svg>")`;
var updateIcon = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8'/><path d='M3 3v5h5'/><path d='M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16'/><path d='M16 16h5v5'/></svg>")`;
var dblQIcon   = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12.9,6.1c2-2.1,5.4-2.3,7.6-0.3c1.6,1.5,2.1,3.9,1.3,6.1c-1.6,3.3-7.2,2.6-7.2,2.6'/><path d='M13.2,19.6L13.2,19.6'/><path d='M2,9.6c0.1-2.1,2-3.7,4-3.5C7.7,6.2,9,7.3,9.5,8.9c0.6,2.4-2.6,4.7-2.6,4.7'/><path d='M8.2,18.3L8.2,18.3'/></svg>")`;

console.log("[Патчи] Скрипт начал работу.");

/* ======== Переменные ======= */
/*  Заполнитель высоты консоли */ const consoleHeightHolder = document.createElement('div'); consoleHeightHolder.style.cssText = 'height: 500px; width: 100%;'; consoleHeightHolder.id = 'consoleHeightHolder';
/*   Элемент для переключателя */ const consoleExpandToggle = document.createElement('button'); consoleExpandToggle.id = 'consoleExpandToggle'; consoleExpandToggle.classList.add('consoleButton'); consoleExpandToggle.classList.add('expand'); consoleExpandToggle.style.backgroundImage = expandIcon; consoleExpandToggle.setAttribute("onclick", "toggleConsoleExpand()");
/*   Элемент для переключателя */ const consoleScrollToggle = document.createElement('button'); consoleScrollToggle.id = 'consoleScrollToggle'; consoleScrollToggle.classList.add('consoleButton'); consoleScrollToggle.classList.add('scroll'); consoleScrollToggle.style.backgroundImage = scrollIconDisabled; consoleScrollToggle.setAttribute("onclick", "toggleConsoleScroll()");
/*    Враппер любимых серверов */ const favServerWrapper = document.createElement('div'); favServerWrapper.id = "favServerWrapper";
/*  Текст для любимых серверов */ const favServerText = document.createElement('p'); favServerText.textContent = 'Избранные сервера:';
/*     Кнопка любимого сервера */ const favServer = document.createElement('a');
/*    Получаем массив серверов */ const favServersJSON = localStorage.getItem("favServersJSON");
/*                   CSS стиль */ var cssElement = document.createElement('link'); cssElement.rel = 'stylesheet';
/*                      Иконка */ var faviconLink = document.createElement('link'); faviconLink.rel = 'icon'; faviconLink.setAttribute('href', 'https://minecraft.rent/favicon.ico');
/*      Проматывать ли консоль */ var scrollConsole = false;
/*       Элемент закрытия меню */ const closeMenuElement = document.createElement('button'); closeMenuElement.id = "closeMenu"; closeMenuElement.setAttribute("onclick", "toggleMenu()");
/*        Кнопка открытия меню */ const hamburgerButton = document.createElement('a'); hamburgerButton.id = "hamburgerMenuButton"; hamburgerButton.setAttribute("onclick", "toggleMenu()");
var favServersArray = [];
if (favServersJSON != null) {
    favServersArray = JSON.parse(favServersJSON);
}

/* ========= Функции ========= */
function updateFavServers() {
    console.log('[Патчи] Началось обновление избранных серверов')

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
    const consoleWrapper = document.querySelector('#console-scroll');
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
function toggleConsoleScroll() {
    const consoleWrapper = document.querySelector('#console');
    if (consoleScrollToggle.style.backgroundImage == scrollIconDisabled) {
        consoleScrollToggle.style.backgroundImage = scrollIconEnabled;
        scrollConsole = true;
    } else {
        consoleScrollToggle.style.backgroundImage = scrollIconDisabled;
        scrollConsole = false;
    }

    function scrollToBottom() {
        if (scrollConsole) {
            consoleWrapper.scroll({top: consoleWrapper.scrollHeight, left: consoleWrapper.scrollLeft, behavior: "smooth"});
        };
    };
    scrollToBottom();

    var observer = new MutationObserver(function (mutations) {
        scrollToBottom();
        console.log("[Патчи] Консоль промотана вниз");
    });

    observer.observe(consoleWrapper, {subtree: true, childList: true})
};
function randomString() {
    return Math.floor(Math.random() * Math.pow(10, 10));
};
function askAdminIP() {
    while ([null, undefined, '', "null"].includes(localStorage.getItem("adminSubDomain"))) {
        localStorage.setItem("adminSubDomain", prompt('Введите субдомен админ-панели. Он вводится один раз, а хранится в «локальном хранилище» сайта my.minerent.net'));
    };
};
function toggleMenu() {
    const tabsBar = document.querySelector('.min-w-\\[300px\\].h-screen.bg-\\[\\#22293b\\].fixed.top-0.left-0');
    if (!tabsBar.classList.contains("enabled") && !closeMenuElement.classList.contains("enabled")) {
        tabsBar.classList.add('enabled'); closeMenuElement.classList.add('enabled');
    } else {
        tabsBar.classList.remove('enabled'); closeMenuElement.classList.remove('enabled');
    }
}

if (!unsafeWindow.favClicked) {
    unsafeWindow.favClicked = favClicked;
}
if (!unsafeWindow.toggleConsoleExpand) {
    unsafeWindow.toggleConsoleExpand = toggleConsoleExpand;
}
if (!unsafeWindow.toggleConsoleScroll) {
    unsafeWindow.toggleConsoleScroll = toggleConsoleScroll;
}
if (!unsafeWindow.askAdminIP) {
    unsafeWindow.askAdminIP = askAdminIP;
}
if (!unsafeWindow.toggleMenu) {
    unsafeWindow.toggleMenu = toggleMenu;
}

//
// Загрузка страницы началась
//

if (!window.location.href.includes("my.minerent")) {
    const hideallwbgStyle = document.createElement("STYLE");
    document.head.append(hideallwbgStyle);
    hideallwbgStyle.innerHTML = ".smoothreveal > * { animation: smoothreveal 800ms; } @keyframes smoothreveal { from {opacity: 0} to {opacity: 1} } .hideallwbg { background: #1c2230; } .hideallwbg > * { opacity: 0; }";

    document.querySelector("html").classList.add("hideallwbg");
}

/* Страница сервера */ if (window.location.href.match(/.+servers\/[\da-zA-Z]{8}.*/g)) {
    console.log('[Патчи] Обнаружена страница управления сервером: ' + window.location.href);
    document.title = 'ПУ сервера ' + window.location.href.match(/(?<=.+servers\/)[\da-zA-Z]{8}/g) + ' | Админ-панель Minecraft.RENT';
/*   Поиск серверов */ } else if (window.location.href.includes("/servers") && !window.location.href.match(/.+servers\/[\da-zA-Z]{8}.*/g)) {
    console.log('[Патчи] Обнаружена страница поиска: ' + window.location.href);
    document.title = 'Поиск серверов | Админ-панель Minecraft.RENT';
} else if (window.location.href.includes("/login")) {
    var loginStyle = `@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');* {margin: 0;padding: 0;left: 0;top: 0;transition: all 0ms;}body {background-color: #1b2230;height: 100vh;}.form-signin {color: #fff;height: 100%;}.form-signin>form {display: flex;flex-direction: column;align-items: center;justify-content: center;width: 100%;gap: 0.25rem;vertical-align: top;}.form-signin>form>img {margin-top: 5rem;content: url(https://minecraft.rent/static/images/af0cdf2928908a72d447.png);width: 5rem;height: 5rem;}.form-signin>form>h1 {font-family: "Roboto";font-weight: 800;font-size: 4rem;margin-bottom: 2rem;}.btn-primary {font-size: 1rem;padding: .5rem 2rem;background-color: #0078eb;border: none;border-bottom: 1px solid #fff2;border-radius: 0.25rem;text-align: center;text-decoration: none;display: inline-block;color: #fff;}.btn-primary:hover {background-color: #0061be;border-bottom: 1px solid #fff3;}.form-group>label {display: none;}.form-control {border-radius: 0.25rem;font-size: 1rem;padding: .5rem;background-color: #2b3342;border: none;}.form-control::placeholder {color: #eee;}.form-control:autofill {border-bottom: 1px solid #fff1;margin-bottom: -1px;background-color: #00f !important;}`
    var styleSheet = document.createElement("style");
    styleSheet.textContent = loginStyle;
    document.head.append(styleSheet);
} else {
    console.log('[Патчи] Ни одной известной и поддерживаемой ссылки не найдено');
};

//
// Загрузка страницы завершена
//

document.addEventListener("DOMContentLoaded", async function () {
    if (!window.location.href.includes("my.minerent")) { // Действия с админкой
        /* ====== Элементы HEAD ====== */
        const docHead = document.head || document.getElementsByTagName("HEAD")[0];
        console.log("[Патчи] Добавляю стили");
        docHead.appendChild(cssElement);
        cssElement.href = 'https://xllifi.github.io/files/mcrccss.css?q=' + randomString();
        docHead.appendChild(faviconLink);

        /* Находим панель со вкладками */ const tabsBar = document.querySelector('.min-w-\\[300px\\].h-screen.bg-\\[\\#22293b\\].fixed.top-0.left-0');
        /* Создаём элемент со статусом */ const statusMsg = document.createElement('a'); statusMsg.target = "_blank"; statusMsg.href = 'https://github.com/xllifi/files/raw/main/mcrcsc.user.js'; statusMsg.classList.add(...['w-full', 'h-[52px]', 'flex', 'items-center', 'text-white', 'px-8', 'hover:bg-white/[.03]']);

        /* ===== Проверка версии ===== */
        var response = await fetch('https://xllifi.github.io/files/mcrcsc.user.js?q=' + randomString());
        const latest_version = parseInt((await response.text()).match(/(?<=\/\/ @version\s+)[\d\.]+/gm)[0].replaceAll("\.", ""));
        const current_version = parseInt(GM_info.script.version.replaceAll("\.", ""))
            if (current_version < latest_version) {
                console.log('[Патчи] Устаревшая версия');
                statusMsg.classList.add("updateAvaliable")
            } else if (current_version > latest_version) {
                console.log('[Патчи] Слишком новая версия');
                statusMsg.classList.add("updateWrong")
            } else {
                statusMsg.classList.add("updateLatest")
            }
        tabsBar.append(statusMsg);

        document.querySelectorAll('.min-w-\\[300px\\].h-screen')[1].remove(); // Удаление скрытого элемента сайдбара
        tabsBar.querySelectorAll('a').forEach(function(node) { // Удаление текста с кнопок сайдбара
        	node.innerHTML = ""
        })
        tabsBar.querySelector('div.w-full.flex.items-center.px-8.my-6 > p.text-lg.text-white.font-bold.pl-\\[25px\\]').remove() // Удаление текста "Админ панель"
        tabsBar.parentElement.prepend(closeMenuElement);

        if (!window.location.href.includes("status")) {
            const searchBar = document.querySelectorAll('[action="/servers"]')[0].lastElementChild;
            searchBar.append(favServerWrapper);
            searchBar.prepend(hamburgerButton);
        }

        if (window.location.href.match(/.+servers\/[\da-zA-Z]{8}.*/g)) { // Любая страница управления сервером
            document.querySelector('[href*=transfer]').href = document.querySelector('[href*=transfer]').href + "?node=5";
        }
        if (window.location.href.match(/.+servers\/[\da-zA-Z]{8}/g) && !window.location.href.match(/.+servers\/[\da-zA-Z]{8}.+/g)) { // Главная страница
            /*            Находим элемент консоли */ const consoleWrapper = document.getElementById('console-scroll');
            consoleWrapper.appendChild(consoleExpandToggle);
            consoleWrapper.appendChild(consoleScrollToggle);
        } else if (window.location.href.match(/.+servers\/[\da-zA-Z]{8}\/files\?dir.*/g)) { // Файлы сервера
            // Замена иконки
            const fileList = document.querySelector(".bg-\\[\\#22293b\\].p-4.rounded-lg").children
            for (let entry of fileList) {
                if (entry.innerHTML.includes(`<p class="font-bold">Вернуться назад</p>`)) {
                    entry.querySelector(`.min-w-\\[50px\\]`).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="w-[20px]" stroke-width="3"><path d="M9 14 4 9l5-5"></path><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"></path></svg>`;
                }
            }
        /*    =======================     ИСПРАВЛЕНО ОФИЦИАЛЬНО
            // Замена некорректных ссылок
            const currentFolder = window.location.href.match(/(?<=.*\?dir=).*$/g);
            const fileListTitle = document.querySelector(".bg-\\[\\#22293b\\].p-4.rounded-lg").previousElementSibling;
            if (currentFolder[0] != "/") {
                console.log("[Патчи] Началась замена некорректных ссылок")
                for (let item of fileList) {
                    if (item.tagName == "A" && !item.innerHTML.includes(`<p class="font-bold">Вернуться назад</p>`)) {
                        var hrefAttr = item.getAttribute("href");
                        var hrefReplaced = hrefAttr.replace(/(?<=.*\?(dir|file)=).*$/g, "") + currentFolder + hrefAttr.replace(/.*\?(dir|file)=/g, "").replace(currentFolder, "").replace(/^1/g, "/");
                        item.setAttribute("href", hrefReplaced);
                        console.debug("[Патчи | ОТЛАДКА] Заменяю ссылку \"" + hrefAttr + "\" на \"" + hrefReplaced + "\"");
                    }
                }
            }
            fileListTitle.textContent = fileListTitle.textContent + " ✅";*/
        } else if (window.location.href.includes("/servers") && !window.location.href.match(/.+servers\/[\da-zA-Z]{8}.*/g)) { /* Страница поиска */
            // Добавление кнопки избранного
            const resultsTable = document.querySelector("body div div table");
            if (resultsTable != null) {
                const searchTableContents = resultsTable.childNodes;
                const favButton = document.createElement('button'); favButton.setAttribute("onclick", "favClicked(this)");
                for (var i = 0, arr = resultsTable.childNodes; i < arr.length; i++) {
                    if (searchTableContents[i].tagName == "TBODY" && searchTableContents[i].lastElementChild.firstElementChild.firstElementChild.textContent == "UUID") {
                        var uuidEl = searchTableContents[i].lastElementChild.firstElementChild;
                        uuidEl.insertBefore(favButton.cloneNode(true), uuidEl.firstElementChild);
                        console.log('[Патчи] Кнопка "Избранное" добавлена к серверу ' + searchTableContents[i].lastElementChild.firstElementChild.lastChild.textContent.replace(/("|\n|\W)/gm, ""));
                    }
                }
            }
        };
        updateFavServers();
    } else if (window.location.href.includes("my.minerent")) { // Действия с обычной ПУ
        if (window.location.href.match(/.+server\/[\da-zA-Z]{8}.*/g)) {
            console.log("[Патчи] Добавляю кнопки перехода в админку")
            askAdminIP()

            const buttonsHolder = document.querySelector(".panelSubmenu").children[0].children[0];

            const buttonOpenInAdmin = document.createElement("A");
            buttonOpenInAdmin.classList.add("panelSubmenuLink");
            buttonOpenInAdmin.href = "https://" + localStorage.getItem("adminSubDomain") + ".minerent.net/servers/" + window.location.href.match(/.+server\/([\da-zA-Z]{8}).*/)[1];
            buttonOpenInAdmin.innerHTML = "Открыть в админке";

            buttonsHolder.appendChild(buttonOpenInAdmin);

            const buttonChangeAdminIP = document.createElement("BUTTON");
            buttonChangeAdminIP.classList.add("panelSubmenuLink");
            buttonChangeAdminIP.setAttribute("onclick", "localStorage.clear(\"adminSubDomain\"); askAdminIP()");
            buttonChangeAdminIP.innerHTML = "Сменить IP админки";

            buttonsHolder.appendChild(buttonChangeAdminIP);
        }
    }
}, false);

window.onload = function() {
    if (!window.location.href.includes("my.minerent")) {
        setTimeout(() => {
            document.querySelector("html").classList.add("smoothreveal");
            document.querySelector("html").classList.remove("hideallwbg");
        }, 500);
    }
}
