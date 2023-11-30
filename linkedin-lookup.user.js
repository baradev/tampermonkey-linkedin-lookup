// ==UserScript==
// @name         LinkedIn Lookup in Gmail
// @namespace    http://tampermonkey.net
// @version      0.6
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
      const personName1 = $(this).text().trim();
      // Check if personName contains special characters, numbers, or is a single word
      if (/[^a-zA-Z\s]/.test(personName1) || !/\s/.test(personName1)) {
        // Skip processing if special characters or numbers are found, or it's a single word
        return;
      }
      const searchIconName = createSearchIconElementPerson(
        $(this).attr("name"),
        "blue"
      );

      $(this).before(searchIconName);
    });
}

function prependIconsToRecipients() {
  $(".gI span[email]")
    .not(".gD")
    .not(".search_icon+span[email]")
    .each(function (index) {
      // add name icon
      const innerText = $(this).prop("innerText").trim();

      // Extract the part before the '<' symbol
      const namePart = innerText.split("<")[0].trim();

      // Check if namePart is a single word or contains special characters or numbers
      if (!/\s/.test(namePart) || /[^a-zA-Z\s]/.test(namePart)) {
        // Skip processing if it's a single word or contains special characters or numbers
        return;
      }

      const searchIconName = createSearchIconElementPerson(namePart, "blue");
      $(this).before(searchIconName);
    });
}

function prependIconsToInCard() {
  $('[jsname="BXecsc"]')
    .not('.search_icon+[jsname="BXecsc"]')
    .each(function (index) {
      const personName = $(this).text().trim();

      // Check if personName contains special characters, numbers, or is a single word
      if (/[^a-zA-Z\s]/.test(personName) || !/\s/.test(personName)) {
        // Skip processing if special characters or numbers are found, or it's a single word
        return;
      }

      const searchIconName = createSearchIconElementPerson(personName, "blue");
      $(this).before(searchIconName);
    });
}

function prependLinkedInIconsToEmails() {
  prependIconsToSender();
  prependIconsToRecipients();
  prependIconsToInCard();
}

(function () {
  "use strict";
  $(function () {
    $("body").prepend(css);
    setInterval(prependLinkedInIconsToEmails, 300);
    $("body").on("click", ".search_icon", openLinkedInUrl);
  });
})();
