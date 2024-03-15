# LinkedIn Lookup in Gmail

To use this script you need the [Tampermonkey Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).

## Installation / Update

Open the following [script](https://github.com/kbarushkaa/tampermonkey-linkedin-lookup/raw/main/linkedin-lookup.user.js) and click select _Install_ / _Reinstall_ .

To run LinkedIn Lookup, you will also need a dependency - the Trusted-Types Helper script. You can find the link [here](https://greasyfork.org/en/scripts/433051-trusted-types-helper). The Trusted-Types Helper resolves issues with Trusted-Types Chrome Errors.

## Usage

Open an email in Gmail, you can see User icon positioned next to the sender's and recepient's name.

User icon - searches LinkedIn by recipient's name.

![Usage example](img.png)

![Usage example](context-menu.png)

## Features

1. **Adding User icon to sender and recipient**  
   The icon is added to the email's sender and email's recipient(s).

2. **Searching for first@lastName@gmail.com**  
   When right-clicking, it displays a context menu with the option to search for a person on LinkedIn.
