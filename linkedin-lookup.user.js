// ==UserScript==
// @name         LinkedIn Lookup in Gmail
// @namespace    http://tampermonkey.net
// @version      0.6.3
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

var $ = window.jQuery

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
`

function openLinkedInUrl() {
  var urlToOpen =
    'https://www.linkedin.com/search/results/all/?keywords=' +
    $(this).attr('urlParameter')
  var win = window.open(urlToOpen, '_blank')
  win.focus()
}

function createSearchIconElementPerson(urlParameter, color) {
  return `
        <span class="search_icon" urlParameter="${urlParameter}" title="Search for ${urlParameter} on LinkedIn">
          <svg
            fill="${color}"
            xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
          </svg>
        </span>
`
}

function prependIconsToSender() {
  $('.gD')
    .not('.search_icon+.gD')
    .each(function (index) {
      const personName1 = $(this).text().trim()
      // Check if personName contains special characters, numbers, or is a single word

      if (/[^a-zA-Z\s'-]/.test(personName1) || !/\s/.test(personName1)) {
        // Skip processing if special characters or numbers are found, or it's a single word
        return
      }
      const searchIconName = createSearchIconElementPerson(
        $(this).attr('name'),
        'blue'
      )

      $(this).before(searchIconName)
    })
}

function prependIconsToRecipients() {
  $('.gI span[email]')
    .not('.gD')
    .not('.search_icon+span[email]')
    .each(function (index) {
      // add name icon
      const innerText = $(this).prop('innerText').trim()

      // Extract the part before the '<' symbol
      const namePart = innerText.split('<')[0].trim()

      // Skip processing if the name part contains '@' or '&'
      if (namePart.includes('@') || namePart.includes('&')) {
        return
      }

      // Clean the name
      const cleanName = cleanNameFunction(namePart)

      // Skip processing if it's a single word or contains numbers
      if (!/\s/.test(cleanName) || /\d/.test(cleanName)) {
        return
      }

      const searchIconName = createSearchIconElementPerson(cleanName, 'blue')
      $(this).before(searchIconName)
    })
}

function cleanNameFunction(namePart) {
  // Check if the name contains numbers
  if (/\d/.test(namePart)) {
    // Return the original name without any changes
    return namePart
  }

  // Check if the name is a single word
  if (!/\s/.test(namePart)) {
    // Replace dot with space
    namePart = namePart.replace('.', ' ')
  }

  // Remove special characters and extra spaces
  return namePart.replace(/[^\w\s'-]/g, '').replace(/\s+/g, ' ')
}

function findAndHighlightEmails() {
  // Regular expression to find email addresses with a dot before the @ sign
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g

  // Iterate through all elements in the body
  $('body')
    .find('*')
    .each(function () {
      // Check if the element contains text
      if ($(this).children().length === 0) {
        const text = $(this).text()
        const emailsFound = text.match(emailRegex)

        if (emailsFound) {
          // Iterate through found email addresses
          emailsFound.forEach((email) => {
            // Check if the email address contains a dot before the @ sign
            if (email.indexOf('.') < email.indexOf('@')) {
              // Wrap the email address with a span and apply red color
              const emailHighlighted = text.replace(
                email,
                `<span style="color: red;">${email}</span>`
              )
              $(this).html(emailHighlighted)
            }
          })
        }
      }
    })
}

// Function to handle right-click on the document
function handleContextMenu(event) {
  // Check if the right-clicked element is a highlighted email address with a dot before '@'
  const target = $(event.target)
  if (target.is('span') && target.css('color') === 'rgb(255, 0, 0)') {
    const emailAddress = target.text()
    const parts = emailAddress.split('@')[0].split('.') // Split by dot and get parts before '@'

    let nameToSearch
    if (parts.length === 2) {
      // If there are two parts (e.g., 'bob.smith'), construct the name
      nameToSearch = parts[0] + ' ' + parts[1]
    } else {
      // If there's only one part (e.g., 'bob'), use it as the name
      nameToSearch = parts[0]
    }

    // Create the context menu
    const menu = $('<menu>')
    const menuItem = $('<menuitem>')
    menuItem.text('Search on LinkedIn')
    menuItem.on('click', function () {
      // Open LinkedIn search with the modified name
      const urlToOpen =
        'https://www.linkedin.com/search/results/all/?keywords=' +
        encodeURIComponent(nameToSearch)
      window.open(urlToOpen, '_blank')
    })
    menu.append(menuItem)

    // Show the context menu at the mouse position
    menu.css({
      top: event.clientY,
      left: event.clientX,
      position: 'fixed',
      zIndex: 1000,
      background: 'white',
      border: '1px solid #ccc',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
      padding: '5px',
    })

    // Append the menu to the body
    $('body').append(menu)

    // Remove the menu when clicking outside of it
    $(document).on('click', function () {
      menu.remove()
    })

    // Prevent the default context menu
    event.preventDefault()
  }
}

// Attach the context menu event handler
$(document).on('contextmenu', handleContextMenu)

function prependLinkedInIconsToEmails() {
  console.log('Prepending...')
  prependIconsToSender()
  prependIconsToRecipients()
  findAndHighlightEmails() // Call the new function to highlight emails in the body
}

;(function () {
  'use strict'
  $(function () {
    $('body').prepend(css)
    setInterval(prependLinkedInIconsToEmails, 300)
    $('body').on('click', '.search_icon', openLinkedInUrl)
    $(document).on('contextmenu', handleContextMenu) // Attach the context menu event handler
  })
})()
