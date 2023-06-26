# Calendar

A free pulic calendar that's easy to share and easy for PAX to maintain.

## Infrastructure
The front end is HTML with Javascript, the backend is Node.JS, and the database is Google Sheets.

Theoretically the site can be hosted anywhere. I have had success with Google Cloud Platform's Cloud Run product.

## APIs
There are a couple APIs that the Node.JS server exposes.
1. /api/events - this queries the Google Sheet and returns a list of events
1. /api/categories - this queries the Google Sheet and returns a list of categories and what color they should be
1. /status - will return a value of "Running" if the Node.JS system is functional
1. / - the root of the site is the calendar

## Calendar Plumbing
The bulk of the calendar code is from the fullcalendar.io library.

## Customization
There are no environmental files associated with this code. There are 2 places you can customize the look of the calendar without messing with any code.
1. app.js - there is a section towards the top labeled "Custom Variables"
    1. title - this text doesn't show up on the webpage, it shows up i the tab of your browser
    1. linkToEventDatabase - a link to the Google Sheet that houses your events. When people click the edit button on the calendar page, they will be directed to this link.
    1. port - the port your hosting platform will be listening to for this application
    1. timeZone.id - which time zone your Google Sheet events are in. See the comment line in the code for allowable values. e.g., America/Denver
    1. timeZone.description - the bottom of the calendar has a note indicating which time zone the events are in. This is free form text which will tell them the time zone. e.g., Mountain Time
    1. timezone.abbreviation - this text will show up next to any times listed in the event detail pop-up. e.g., MT
1. source/routers/apiRouter.js - there is a section towards the top labeled "Custom Variables"
    1. eventQueryLink - a URL that, when called, will return the list of events in your Google Sheet as JSON. The URL should be https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet ID}/values/Events?key={API Key}
        1. Spreadsheet ID can be found in the URL bar of your browser while you're looking at the Sheet.
        2. API Key is more complicated. You'll need to make sure you have a Google Cloud Platform account, activate the [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com), and follow these [instructions](https://support.google.com/googleapi/answer/6158862?hl=en&ref_topic=7013279) to create a key.

    1. categoryQueryLink - the Google Sheet should have an App Script already configured. Follow these [instructions](https://developers.google.com/apps-script/guides/web#deploy_a_script_as_a_web_app) to publish the App Script as a web app. To ge tto the App Script go to https://script.google.com/ and log in as the person that owns the Google Sheet.

## Google Sheet
The calendar requires the Google Sheet to have very specific structure and formatting. If not, the calendar could fail to display an events. The easiest way to start is to make a copy of [F3 Denver's Calendar Spreadsheet](calendar.f3denverco.com) onto your Google drive.

- Tab called "Events"
  - Required columns (case sensitive)
    - Title
    - Category
        - Should have Data Validation that only allows users to pick from the "Category" column of the "Categories" tab (see below)
    - Description
    - Location
    - Day
        - Should have Data Validation requiring format of d/M/YYYY
        - May add a comment to the header: "If non-recurring, mandatory. If recurring, optional."
    - Start
        - Should have Data Validation requiring format of HH:mm (military time)
        - May add a comment to the header: "{Time Zone}. If All Day is true, this is ignored"
    - End
        - Should have Data Validation requiring format of HH:mm (military time)
        - May add a comment to the header: "{Time Zone}. If All Day is true, this is ignored"
    - All Day
        - Should have Data Validation requiring user to choose "TRUE" or "FALSE"
    - Recurring Day
        - Should have Data Validation requiring user to choose a day of the week: Sunday, Monday, etc.
    - Last Day
        - Should have Data Validation requiring format of d/M/YYYY
        - May add a comment to header: "Optional. For recurring, will set last day of recurrence. If All Day is true, will imply multi-day event. If All Day is false, and is non-recurring, allows a normal event to span multiple days."
- Tab called "Categories"
    - Required columns (case sensitive)
        - Category
            - e.g., 1st F, 2nd F, Birthday
        - Color
            - Entries should not have a value. User needs to set the background color of the cell to the color they want events of that category to show up in the calendar.

