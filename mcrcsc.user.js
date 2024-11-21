// ==UserScript==
// @name         Патчи админки Minecraft.RENT
// @namespace    https://xllifi.ru
// @version      1.0.9
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
infoPanel, tarifPanel, copyNameButton,
searchBar, closeMenuElement, hamburgerButton,
submenuButtonWrapperLeft, submenuButtonOpenInAdmin, submenuButtonChangeAdminIP;

/** @type { string } */
let pageUrl = window.location.href;

let scrollIconDisabled = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none' stroke-linecap='round' stroke-linejoin='round'><defs><g id='scrollButtonPath'><path d='M12 19V5'/><path d='m6 13 6 6 6-6'/><path d='M19 23H5'/></g></defs><use href='%23scrollButtonPath' stroke='%231c2230' stroke-width='8'/><use href='%23scrollButtonPath' stroke='white' stroke-width='2'/></svg>")`;
let scrollIconEnabled = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none' stroke-linecap='round' stroke-linejoin='round'><defs><g id='scrollButtonPath'><path d='M12 19V5'/><path d='m6 13 6 6 6-6'/><path d='M19 23H5'/></g></defs><use href='%23scrollButtonPath' stroke='%230078eb' stroke-width='8'/><use href='%23scrollButtonPath' stroke='white' stroke-width='2'/></svg>")`;

/** @type { RegExp } */
let searchPageRegex, statusPageRegex, anyServerPageRegex, infoPageRegex, fileListPageRegex, fileReaderPageRegex, controlPanelPageRegex;
searchPageRegex = /^(?!.*my).*servers\/?$/m;
statusPageRegex = /^(?!.*my).*status\/?$/m;
anyServerPageRegex = /^(?!.*my).*servers\/([\d\w]{8})/m;
infoPageRegex = /^(?!.*my).*servers\/[\d\w]{8}\/?$/m;
fileListPageRegex = /^(?!.*my).*servers\/[\d\w]{8}\/files\?dir=.*$/m;
fileReaderPageRegex = /^(?!.*my).*servers\/[\d\w]{8}\/files\/read\?file=.*$/m;
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
  cssLink.href = 'https://xllifi.github.io/files/mcrccss.css?q=' + Math.floor(Math.random() * Math.pow(10, 10));
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
  println('Добавляю кнопку автопрокрутки...');

  autoScrollButton = document.createElement('button');
  autoScrollButton.id = 'consoleScrollToggle';
  autoScrollButton.classList.add('consoleButton');
  autoScrollButton.classList.add('scroll');
  autoScrollButton.style.backgroundImage = scrollIconDisabled;
  autoScrollButton.addEventListener('click', handleAutoScrollButton);

  // Remove scroll event
  consoleWrapper = await getEl('#console-scroll');
  let newConsoleWrapper = consoleWrapper.cloneNode(true);
  consoleWrapper.parentNode.replaceChild(newConsoleWrapper, consoleWrapper);
  consoleWrapper = newConsoleWrapper;
  consoleWrapper.appendChild(autoScrollButton);

  // Add mutation observer for new elements in console
  consoleView = await getEl('#console');
  autoScrollObserver = new MutationObserver(mutations => {
    println('Console Mutation observed!')
    executeAutoScroll();
  });
  autoScrollObserver.observe(consoleView, {
    childList: true,
    subtree: true
  });
  println('Кнопка автопрокрутки добавлена:');
  console.log(autoScrollButton)
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

  infoPanel = tarifPanel.parentElement.querySelector('&>div:not(.mb-4)');
  serverId = infoPanel.querySelector('div:nth-child(1)>p:nth-child(2)').innerHTML;
  serverName = infoPanel.querySelector('div:nth-child(2)>p:nth-child(2)').innerHTML;
}

async function handleCopyNameButton(e) {
  await navigator.clipboard.writeText(`[${serverId} «${serverName}»](https://my.minerent.net/server/${serverId})`);
}

async function remasterSidebar() { // TODO: Remake same as remasterFiles(), not as 0.0.36
  sidebar = await getEl('div.w-screen.flex > div.min-w-\\[250px\\].max-w-\\[250px\\].h-screen.bg-\\[\\#22293b\\].fixed.top-0.left-0');
  sidebar.classList.add('x-sidebar'); // TODO: Remove all other classes.
  sidebar.removeAttribute(':class');

  sidebar.querySelectorAll('a').forEach((el) => { el.innerHTML = '' })
  sidebar.querySelector('div > p').remove();

  if (sidebar.nextElementSibling.nextElementSibling.classList.contains('lg:min-w-[250px]')) { sidebar.nextElementSibling.nextElementSibling.remove() };
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

    submenuButtonWrapperLeft.appendChild(submenuButtonOpenInAdmin);
    submenuButtonWrapperLeft.appendChild(submenuButtonChangeAdminIP);
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
  const officialHamburgerButton = await getEl('button.lg\\:hidden.fixed.top-6.right-4.z-50.p-2.rounded-md.bg-\\[\\#22293b\\].text-white.shadow-xl');
  officialHamburgerButton.remove();

  closeMenuElement = document.createElement('a');
  closeMenuElement.id = "closeMenu";
  closeMenuElement.addEventListener('click', handleHamburgerButton);

  hamburgerButton = document.createElement('a');
  hamburgerButton.id = 'hamburgerMenuButton';
  hamburgerButton.addEventListener('click', handleHamburgerButton);

  let titleRoot, titleWrapper;
  switch (true) {
    case statusPageRegex.test(pageUrl):
      searchBar = await getEl('div.w-full:has(>p.text-lg.font-bold)');
      searchBar.parentElement.classList.remove('grid-cols-2');

      titleRoot = document.createElement('div');
      titleRoot.classList.add('x_title_wrapper');
      searchBar.prepend(titleRoot);
      titleWrapper = document.createElement('div');
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

async function remasterFileList() {
  println('Применяется скрипт списка файлов...')

  let filesRoot = await getEl('div.bg-\\[\\#22293b\\].p-4.rounded-lg');
  filesRoot.removeAttribute('class');
  filesRoot.id = 'x_files_root';

  let filesHeader = await getEl('#x_files_root > div:first-of-type');
  filesHeader.removeAttribute('class');
  filesHeader.id = 'x_files_header';
  filesHeader.prepend(filesHeader.querySelector('&>div>p'));
  filesHeader.querySelector('&>div').remove();


  filesRoot.querySelectorAll('&>a:not(#x_files_file)').forEach((el) => {
    if (el.querySelector('p').classList.contains('font-bold')) {
      el.querySelector('p').removeAttribute('class');
      el.querySelector('div').remove();
      el.removeAttribute('class');
      el.id = 'x_files_return';
      return;
    }

    let x_elName = document.createElement('p');
    x_elName.innerHTML = el.querySelector('&>div>p').innerHTML;

    el.id = 'x_files_folder';
    el.removeAttribute('class');
    el.querySelector('&>div').remove();

    el.prepend(x_elName);
  })

  filesRoot.querySelectorAll('&>div:not(:first-of-type)').forEach((el) => {
    let name = el.querySelector('&>a>p');

    let download = el.querySelector('&>a[target="_blank"]');
    download.id = 'x_files_download';

    let newCell = document.createElement('a');
    newCell.id = 'x_files_file';
    newCell.href = el.querySelector('&>a').href;

    el.prepend(name);
    el.querySelectorAll('p').forEach((subEl) => {
      newCell.append(subEl);
    })
    newCell.append(download);
    el.parentElement.replaceChild(newCell, el);
  })
}

async function remasterFileReader() {
  println('Применяется скрипт просмотрщика файлов...')

  let filesRoot = await getEl('div.bg-\\[\\#22293b\\].p-4.rounded-lg');
  filesRoot.removeAttribute('class');
  filesRoot.id = 'x_files_root';

  let returnButton = filesRoot.querySelector('&>a');
  returnButton.removeAttribute('class');
  returnButton.id = 'x_files_return';
  returnButton.querySelector('div').remove();
  returnButton.querySelector('p').removeAttribute('class');

  let filePath = filesRoot.querySelector('&>p');
  filePath.innerHTML = filePath.innerHTML.replace(/^Путь: /m, '');
  filePath.removeAttribute('class');
  filePath.id = 'x_files_reader-path';

  let fileText = filesRoot.querySelector('&>textarea');
  fileText.removeAttribute('class');
  fileText.id = 'x_files_reader-text';
}

// Are we on `my.minerent.net`? Don't execute further if we are.
if (controlPanelPageRegex.test(pageUrl)) {
  println('Применяется скрипт страницы обычной ПУ...');
  document.addEventListener('DOMContentLoaded', function init() {
    addLinksToControlPanel();
    document.removeEventListener('DOMContentLoaded', init);
  })
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
    document.addEventListener('DOMContentLoaded', function execInfoPage() {
      addConsoleAutoScroll();
      addCopyNameButton();
      document.removeEventListener('DOMContentLoaded', execInfoPage)
    })
    break;
  case fileListPageRegex.test(pageUrl):
    document.addEventListener('DOMContentLoaded', function execFileList() {
      remasterFileList();
      document.removeEventListener('DOMContentLoaded', execFileList)
    })
    break;
    case fileReaderPageRegex.test(pageUrl):
    document.addEventListener('DOMContentLoaded', function execFileReader() {
      remasterFileReader();
      document.removeEventListener('DOMContentLoaded', execFileReader)
    })
    break;
  default:
    break;
}

loadCss();
document.addEventListener('DOMContentLoaded', function init() {
  remasterSidebar();
  addMobileButtons();
  document.removeEventListener('DOMContentLoaded', init);
})
