// ==UserScript==
// @name         LinkedIn Email Highlighter
// @namespace    http://barbora.cloud/
// @version      0.1
// @description  try to take over the world!
// @author       Barbora Klusackova
// @match        *://mail.google.com/*
// @match        *://contacts.google.com/widget/hovercard/*
// @match        *://gmail.com/*
// @match        *gmail.com/*
// @match        *mail.google.com/*
// @match        *contacts.google.com/widget/hovercard/*
// @icon         https://w7.pngwing.com/pngs/642/372/png-transparent-link-in-logo-linkedin-logo-linkedin-icons-no-attribution-miscellaneous-blue-angle.png
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js#sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=
// ==/UserScript==

var $ = window.jQuery;

(function () {
  "use strict";

  $(function () {
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

    $("body").prepend(css);

    function createSearchIconElementAt(urlParameter, color) {
      return `
            <span class="search_icon" urlParameter="${urlParameter}">
            <svg
            fill="${color}"
            xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/></svg>
</span>
`;
    }

    function createSearchIconElementPerson(urlParameter, color) {
      return `
            <span class="search_icon" urlParameter="${urlParameter}">
            <svg
            fill="${color}"
            xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z"/></svg>

            </span>
`;
    }

    function addSearchIconBeforeGD() {
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

    // Poll periodically for newly created divs
    setInterval(addSearchIconBeforeGD, 300);

    $("body").on("click", ".search_icon", function () {
      var urlToOpen =
        "https://www.linkedin.com/search/results/all/?keywords=" +
        $(this).attr("urlParameter");
      var win = window.open(urlToOpen, "_blank");
      if (win) {
        //Browser has allowed it to be opened
        win.focus();
      } else {
        //Browser has blocked it
        alert("Please allow popups for this website");
      }
    });
  });
})();
