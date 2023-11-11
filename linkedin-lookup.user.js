// ==UserScript==
// @name         LinkedIn Lookup in Gmail
// @namespace    http://tampermonkey.net
// @version      0.5
// @description  Search LinkedIn by recipient's full name or email address
// @author       Barbora Klusackova
// @match        *://mail.google.com/*
// @match        *://contacts.google.com/widget/hovercard/*
// @match        *://gmail.com/*
// @match        *gmail.com/*
// @match        *mail.google.com/*
// @match        *contacts.google.com/widget/hovercard/*
// @icon         https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js#sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=
// ==/UserScript==

var $ = window.jQuery;

const css = `
<style>
  .search_icon {
    outline: none;
    position: relative;
    z-index: 0;
    margin: 0;
    top: 2px;
  }
  .search_icon svg:hover {
    fill: orange;
  }
  .search_icon {
    cursor: pointer;
  }
</style>
`;

function openLinkedInUrl() {
  var urlToOpen =
    "https://www.linkedin.com/search/results/all/?keywords=" +
    $(this).attr("urlParameter");
  var win = window.open(urlToOpen, "_blank");
  win.focus();
}

function createSearchIconElementAt(urlParameter, color) {
  return `
        <span class="search_icon" urlParameter="${urlParameter}" title="Search for ${urlParameter} on LinkedIn">
          <svg
            fill="${color}"
            xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
          </svg>
        </span>
`;
}

function createSearchIconElementPerson(urlParameter, color) {
  return `
        <span class="search_icon" urlParameter="${urlParameter}" title="Search for ${urlParameter} on LinkedIn">
          <svg 
            fill="${color}" 
            xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
          </svg>
        </span>
`;
}

function prependIconsToSender() {
  $(".gD")
    .not(".search_icon+.gD")
    .each(function (index) {
      const searchIconEmail = createSearchIconElementAt(
        $(this).attr("email"),
        "blue"
      );
      const searchIconName = createSearchIconElementPerson(
        $(this).attr("name"),
        "blue"
      );

      $(this).before(searchIconEmail);
      $(this).before(searchIconName);
    });
}

function prependIconsToRecipients() {
  $(".gI span[email]")
    .not(".gD")
    .not(".search_icon+span[email]")
    .each(function (index) {
      // add email icon
      const searchIconEmail = createSearchIconElementAt(
        $(this).attr("email"),
        "blue"
      );
      $(this).before(searchIconEmail);

      // add name icon
      const nameArray = $(this).prop("innerText").split("<");
      const foundNameInInnerText = nameArray.length > 1;
      if (foundNameInInnerText) {
        const searchIconName = createSearchIconElementPerson(
          nameArray[0].trim(),
          "blue"
        );
        $(this).before(searchIconName);
      }
    });
}

function prependIconsToOtherEmails() {
  $('a[href^="mailto:"]')
    .not('.search_icon+a[href^="mailto:"]')
    .not('div[contenteditable="true"] a[href^="mailto:"]')
    .each(function (index) {
      const searchIconEmail = createSearchIconElementAt(
        $(this).attr("href").replace("mailto:", ""),
        "blue"
      );
      $(this).before(searchIconEmail);
    });
}

function prependLinkedInIconsToEmails() {
  prependIconsToSender();
  prependIconsToRecipients();
  prependIconsToOtherEmails();
}

(function () {
  "use strict";
  $(function () {
    $("body").prepend(css);
    setInterval(prependLinkedInIconsToEmails, 300);
    $("body").on("click", ".search_icon", openLinkedInUrl);
  });
})();
