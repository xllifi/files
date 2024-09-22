// ==UserScript==
// @name         Патчи админки Minecraft.RENT
// @namespace    https://xllifi.ru
// @version      1.0
// @description  Улучшения для админ-панели Minecraft.RENT
// @author       xllifi
// @match        https://*.minerent.net/*
// @exclude      https://minerent.net/*
// @exclude      https://chat.minerent.net/*
// @icon         https://minerent.net/favicon.ico
// @grant        unsafeWindow
// @grant        GM_info
// @run-at       document-start
// ==/UserScript==

/** @type { HTMLElement } */
let docHead, loadStyle, cssLink, 
sidebar, statusMsg, 
consoleWrapper, consoleView, autoScrollButton,
tarifPanel, copyNameButton,
searchBar, closeMenuElement, hamburgerButton,
submenuButtonWrapperLeft, submenuButtonOpenInAdmin, submenuButtonChangeAdminIP;

/** @type { string } */
let pageUrl = window.location.href;

let scrollIconDisabled = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none' stroke-linecap='round' stroke-linejoin='round'><defs><g id='scrollButtonPath'><path d='M12 19V5'/><path d='m6 13 6 6 6-6'/><path d='M19 23H5'/></g></defs><use href='%23scrollButtonPath' stroke='%231c2230' stroke-width='8'/><use href='%23scrollButtonPath' stroke='white' stroke-width='2'/></svg>")`;
let scrollIconEnabled = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none' stroke-linecap='round' stroke-linejoin='round'><defs><g id='scrollButtonPath'><path d='M12 19V5'/><path d='m6 13 6 6 6-6'/><path d='M19 23H5'/></g></defs><use href='%23scrollButtonPath' stroke='%230078eb' stroke-width='8'/><use href='%23scrollButtonPath' stroke='white' stroke-width='2'/></svg>")`;

/** @type { RegExp } */
let searchPageRegex, statusPageRegex, anyServerPageRegex, infoPageRegex, controlPanelPageRegex;
searchPageRegex = /^(?!.*my).*servers\/?$/m;
statusPageRegex = /^(?!.*my).*status\/?$/m;
anyServerPageRegex = /^(?!.*my).*servers\/([\d\w]{8})/m;
infoPageRegex = /^(?!.*my).*servers\/[\d\w]{8}\/?$/m;
controlPanelPageRegex = /^.*my.*server\/([\d\w]{8}).*$/m;

let autoScrollEnabled = false;
let autoScrollObserver;

let serverId, serverName;

/**
 * Prints the string and prepends a prefix
 * 
 * @param {string} string A string to print
 */
function println(string) {
  console.log('[Патчи] ' + string);
}

/**
 * Ensures that element exists and returns it.
 * 
 * @param {string} selector 
 * @returns {HTMLElement}
 */
function getEl(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    let observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true
    });
  });
}

async function loadCss() {
  println("Добавляю CSS...");
  docHead = await getEl('head');

  // Loading style
  loadStyle = document.createElement('style');
  loadStyle.innerHTML = 'html { background: #1c2230 } body { opacity: 0; transition: opacity 500ms}';
  docHead.append(loadStyle);

  // General CSS
  cssLink = document.createElement('link');
  cssLink.href = 'https://xllifi.github.io/files/mcrccss.css';
  cssLink.type = 'text/css';
  cssLink.rel = 'stylesheet';
  docHead.append(cssLink);

  window.addEventListener('load', async function removeLoading() {
    loadStyle.innerHTML = 'html { background: #1c2230 } body { opacity: 1; transition: opacity 500ms}';
    setTimeout(() => { docHead.removeChild(loadStyle) }, 500);
    window.removeEventListener('load', removeLoading);
  });
}

async function addConsoleAutoScroll() {
  println('Применяется скрипт страницы сервера...');
  
  autoScrollButton = document.createElement('button');
  autoScrollButton.id = 'consoleScrollToggle';
  autoScrollButton.classList.add('consoleButton');
  autoScrollButton.classList.add('scroll');
  autoScrollButton.style.backgroundImage = scrollIconDisabled;
  autoScrollButton.addEventListener('click', handleAutoScrollButton);
  
  document.addEventListener('DOMContentLoaded', async function removeConsoleEvents() {
    consoleWrapper = await getEl('#console-scroll');
    let newConsoleWrapper = consoleWrapper.cloneNode(true);
    consoleWrapper.parentNode.replaceChild(newConsoleWrapper, consoleWrapper);
    consoleWrapper = newConsoleWrapper;
    consoleWrapper.appendChild(autoScrollButton);

    consoleView = await getEl('#console');
    autoScrollObserver = new MutationObserver(mutations => {
      println('Console Mutation observed!!')
      executeAutoScroll();
    });
    autoScrollObserver.observe(consoleView, {
      childList: true,
      subtree: true
    });

    window.removeEventListener('DOMContentLoaded', removeConsoleEvents);
  });
}

function handleAutoScrollButton() {
  if (autoScrollEnabled) {
    autoScrollButton.style.backgroundImage = scrollIconDisabled;
    autoScrollEnabled = false;
  } else {
    autoScrollButton.style.backgroundImage = scrollIconEnabled;
    autoScrollEnabled = true;
  }

  executeAutoScroll();
}

function executeAutoScroll() {
  if (autoScrollEnabled) {
    consoleView.scroll({ top: consoleView.scrollHeight, left: consoleView.scrollLeft, behavior: "smooth" });
  }
}

async function addCopyNameButton() {
  println('Добавляю кнопку копирования названия...');
  tarifPanel = await getEl('div.p-6.w-full.flex.relative > div > div.w-full > div.p-4.rounded-lg.flex.items-center.mb-4:has(>img)');
  copyNameButton = document.createElement('a');
  copyNameButton.classList.add('x_copy_button');
  copyNameButton.addEventListener('click', handleCopyNameButton);
  tarifPanel.append(copyNameButton);

  document.addEventListener('DOMContentLoaded', function getServerData() {
    copyNameButton.parentElement.parentElement.querySelectorAll('&>div:not(.mb-4)>div').forEach((el) => {
      firstChild = el.firstElementChild;
      secondChild = firstChild.nextElementSibling;
      switch (true) {
        case firstChild.innerHTML == "UUID":
          serverId = secondChild.innerHTML;
          console.log(firstChild);
          console.log(secondChild);
          break;
        case firstChild.innerHTML == "Название":
          serverName = secondChild.innerHTML;
          console.log(firstChild);
          console.log(secondChild);
          break;
        default:
          break;
      }
    })
  })
}

async function handleCopyNameButton(e) {
  await navigator.clipboard.writeText(`[${serverId} «${serverName}»](https://my.minerent.net/server/${serverId})`);
}

async function remasterSidebar() {
  sidebar = await getEl('div.w-screen.flex > div.min-w-\\[250px\\].max-w-\\[250px\\].h-screen.bg-\\[\\#22293b\\].fixed.top-0.left-0');
  sidebar.classList.add('x-sidebar'); // TODO: Remove all other classes.

  sidebar.querySelectorAll('a').forEach((el) => { el.innerHTML = '' })
  sidebar.querySelector('div > p').remove();

  if (sidebar.nextElementSibling.classList.contains('min-w-[250px]')) { sidebar.nextElementSibling.remove() };
  statusMsg = sidebar.querySelector('a').cloneNode(true);
  statusMsg.classList.remove('hover:bg-white/[.03]');
  statusMsg.target = '_blank';
  statusMsg.href = 'https://github.com/xllifi/files/raw/main/mcrcsc.user.js';

  checkVersion();
}

async function checkVersion() {
  let response = await (await fetch('https://xllifi.github.io/files/mcrcsc.user.js')).text();

  let latest_version = response.match(/@version.*?(\d.*)$/m)[1].replaceAll("\.", "");
  let current_version = GM_info.script.version.replaceAll("\.", "");

  println(`Сравниваю версии. Текущая ${current_version} и последняя ${latest_version}`);
  switch (true) {
    case current_version < latest_version:
      println('Устаревшая версия.');
      statusMsg.classList.add("updateAvaliable");
      break;
    case current_version > latest_version:
      println('Слишком новая версия.');
      statusMsg.classList.add("updateWrong");
      break;
    default:
      println('Версии совпадают.');
      statusMsg.classList.add("updateLatest");
      break;
  }
  sidebar.append(statusMsg);
}

async function addLinksToControlPanel() {
  let oldPageUrl = pageUrl;
  askAdminIP();
  
  submenuButtonOpenInAdmin = document.createElement('a');
  submenuButtonOpenInAdmin.innerHTML = "Открыть в админке";
  submenuButtonOpenInAdmin.classList.add('panelSubmenuLink');
  submenuButtonOpenInAdmin.href = "https://" + localStorage.getItem("adminSubDomain") + ".minerent.net/servers/" + pageUrl.match(controlPanelPageRegex)[1];

  submenuButtonChangeAdminIP = document.createElement('a');
  submenuButtonChangeAdminIP.style.cursor = 'pointer';
  submenuButtonChangeAdminIP.innerHTML = "Сменить адрес админки";
  submenuButtonChangeAdminIP.classList.add('panelSubmenuLink');
  submenuButtonChangeAdminIP.addEventListener('click', async function buttonChangeAdminIP() {
    localStorage.removeItem('adminSubDomain');
    askAdminIP();
  });

  async function addLinks() {
    submenuButtonWrapperLeft = await getEl('.panelSubmenu > div.container.mx-auto.flex.items-center.justify-between > div.flex.items-center');

    submenuButtonWrapperLeft.appendChild(submenuButtonChangeAdminIP);
    submenuButtonWrapperLeft.appendChild(submenuButtonOpenInAdmin);
  }
  addLinks();

  let observer = new MutationObserver(mutations => {
    pageUrl = window.location.href;
    println(oldPageUrl + ', ' + pageUrl);
    if (oldPageUrl != pageUrl) {
      oldPageUrl = pageUrl;
      addLinks();
    }
  })
  let body = await getEl('body');
  observer.observe(body, {
    childList: true,
    subtree: true
  })
}

function askAdminIP() {
  let counter = 0;
  while ([null, undefined, '', 'null'].includes(localStorage.getItem('adminSubDomain'))) {
      counter++;
      localStorage.setItem('adminSubDomain', prompt('Введите субдомен админ-панели. Он сохранится в «локальном хранилище» сайта my.minerent.net\n' + ((counter>1) ? '\nСубдомен необходимо ввести, чтобы избежать проблем!' : '')));
  }
}

async function addMobileButtons() {
  closeMenuElement = document.createElement('a');
  closeMenuElement.id = "closeMenu";
  closeMenuElement.addEventListener('click', handleHamburgerButton);

  hamburgerButton = document.createElement('a');
  hamburgerButton.id = 'hamburgerMenuButton';
  hamburgerButton.addEventListener('click', handleHamburgerButton);

  switch (true) {
    case statusPageRegex.test(pageUrl):
      searchBar = await getEl('div.w-full:has(>p.text-lg.font-bold)');
      searchBar.parentElement.classList.remove('grid-cols-2');

      let titleRoot = document.createElement('div');
      titleRoot.classList.add('x_title_wrapper');
      searchBar.prepend(titleRoot);
      let titleWrapper = document.createElement('div');
      titleWrapper.classList.add('x_title_wrapper_text');
      titleRoot.append(titleWrapper);

      searchBar.querySelectorAll('&>p').forEach((el) => {
        el.classList.remove('mb-2');
        titleWrapper.append(el);
      });
      searchBar = titleRoot;
      break;
    default:
      searchBar = await getEl('form[action="/servers"] > div.flex.items-center.gap-2');
      break;
  }
  sidebar.parentElement.prepend(closeMenuElement);
  searchBar.prepend(hamburgerButton);
}

function handleHamburgerButton() {
  if (!sidebar.classList.contains("enabled") && !closeMenuElement.classList.contains("enabled")) {
    sidebar.classList.add('enabled'); closeMenuElement.classList.add('enabled');
  } else {
    sidebar.classList.remove('enabled'); closeMenuElement.classList.remove('enabled');
  }
}

// Are we on `my.minerent.net`? Don't execute further if we are.
if (controlPanelPageRegex.test(pageUrl)) {
  println('Применяется скрипт страницы обычной ПУ...');
  addLinksToControlPanel();
  return;
}

// Change window title
switch (true) {
  case anyServerPageRegex.test(pageUrl):
    document.title = 'ПУ сервера ' + window.location.href.match(anyServerPageRegex)[1] + ' | Админ-панель Minecraft.RENT';
    break;
  case searchPageRegex.test(pageUrl):
    document.title = 'Поиск серверов | Админ-панель Minecraft.RENT';
    break;
  default:
    break;
}

// Run page-specific scripts
switch (true) {
  case searchPageRegex.test(pageUrl):
    break;
  case infoPageRegex.test(pageUrl):
    addConsoleAutoScroll();
    addCopyNameButton();
    break;
  default:
    break;
}

loadCss();
remasterSidebar();
addMobileButtons();
