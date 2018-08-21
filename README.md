# My neighborhood map react app

This is a single-page web app where i display some of Rotterdams places that you need to visit.


## What does the site contain

* reactjs
* Google map api
* Foursquare api
* Javascript
* escape-string-regexp
* sort-by

## How does the app work

For displaying the map i make use of the google maps api.
All the locations are displayed on the map with a marker and in a list on the left side.
Above the list is an input field for filter locations. The filter works on both the map and the list.
On the right top there's a menu icon the close and open the list. When you click on the marker or one of the list items there opens an infowindow that displays info from foursquare. Such as a photo and tips.

## How you can use this app

If you want to try the app you can do the following steps

* clone or download from github
* in the project folder run npm install to install all the dependencies
* run npm start to start the development server

NOTE: The service workers for this app will only cache the site when it is in production mode

## How to run this app in production mode

* Go to the root directory of the app.
* Give the command npm run build in the terminal.

This will create a production build of the app in the build/ folder of the project.

For environments using Node, the easiest way to handle this would be to install serve and let it handle the rest:

* npm install -g serve
* serve -s build


Now you are ready to test the app.