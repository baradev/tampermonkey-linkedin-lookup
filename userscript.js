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
  .email_search_icon {
    outline: none;
    position: relative;
    z-index: 0;
    padding: 0 4px;
    margin: 0;
    top: 2px;
  }
  .email_search_icon svg {
    fill: yellow;
  }
  .email_search_icon svg:hover {
    fill: orange;
  }
  .email_search_icon {
    cursor: pointer;
  }
</style>
        `;

    $("body").prepend(css);

    function getEmails() {
      var search_in = document.body.innerHTML;
      var string_context = search_in.toString();

      var array_mails = string_context.match(
        /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
      );
      return array_mails;
    }

    function get_email_search_icon_link(email) {
      return `
            <span class="email_search_icon" email="${email}">
            
  <svg
    focusable="false"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5
4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
    ></path>
    <path d="M0 0h24v24H0z" fill="none"></path>
  </svg>
</span>
`;
    }

    function insert_email_search_icon() {
      $(".gD")
        .not(".email_search_icon+.gD")
        .each(function (index) {
          const emailSearchIconLink = get_email_search_icon_link(
            $(this).attr("email")
          );

          $(this).before(emailSearchIconLink);
        });
    }

    // Poll periodically for newly created divs
    setInterval(insert_email_search_icon, 300);

    $("body").on("click", ".email_search_icon", function () {
      var urlToOpen =
        "https://www.linkedin.com/search/results/all/?keywords=" +
        $(this).attr("email");
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
