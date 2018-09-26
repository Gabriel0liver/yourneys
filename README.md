# Project Name
> YOUrneys

## Description

Yourneys is a platform for travelers to discover cities through customized journeys created by locals.
 
## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **sign up** - As a user I want to sign up on the webpage so that I can see all the Yourney or create a new Yourney
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage in case other user wants to log in
- **Homepage-cities** - As I user I want to be able to see all the cities so that I can find Yourneys in that cities
- **yourneys** - As I user I want to be able to see yourneys so that I can choose one
- **yourney-details** - As I user I want to be able to see what the yourney is about
- **add-yourney** - As I user I want to be able to add a yourney so that I make the journey later
- **profile-upcoming-yourneys** -my upcoming yourneys
- **create-yourney** - As I user I want to be able to create and edit yourneys for other users

## MVP

- Homepage
- Sign Up
- Display Yourneys
- Add Yourney
- Create Yourney


## Backlog
Onboarding:
- **onboarding-page** - As a user I want to be able to access the onboarding page so that I see what the app is about

User profile:
- **profile** - As I user I want to be able to see my profile details
- **profile** -I've done
- **profile** -I've created
- **profile** -delete yourneys I've created
- upload my profile picture
- see other users profile
- list of upcoming yourneys
- list of yourneys I've done
- list of created yourneys
- checkbox to update from upcoming yourney to done
- messages (view and notifications)

Geo Location:
- add geolocation to yourneys when creating
- show yourneys route in a map in the yourney detail page

Explore
- filter latest/new yourneys
- display top rated yourneys
- **explore** - As I user I want to be able to see suggestions to inspire me, like the last added yourneys and the top rated yourneys

Search
- filter cities on the homepage
- add filters for interest...
- **search** - As I user I want to be able to filter yourneys in a city, with different criteria (date, interest...)

Create
- upload images
- add routes in map

Favorites
- add yourneys to favorites and identify them with an icon
- remove yourneys from favorites

Messages
- create, send, and receive messages from other users
- receive notifications

Settings
- change password
- change email
- activate/ deactivate notifications

Yourneys details
- user view of added yourney with checkboxes to mark what the user have accomplished


## ROUTES:

- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)

- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - email
    - password
  - validation
    - fields not empty
    - user does not exist
  - create user with encrypted password
  - store user in session
  - redirect to /

- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)

- POST /auth/login
  - redirects to / if user logged in
  - body:
    - username or email
    - password
  - validation
    - fields not empty
    - user exists
    - passdword matches
  - store user in session
  - redirect to /

- POST /auth/logout
  - body: (empty)
  - removes user from sesion
  - redirect to /auth/login

- GET / 
  - renders the homepage
  - redirects to /auth/login if user logged out

- GET /profile
  - renders the profile details
  
- GET /yourney?city=<cityName>
  - renders the yourney list for <cityName>

- GET /yourney/create
  - renders the create form

- POST /yourney/create
  - redirects to /auth/login if user is anonymous
  - body: 
    - name
    - description
    - location
    - date
    - days
  - validation
    - check required fields 
    - if data is valid = create a new yourney and redirect to /yourney/:id
    - if data is invalid = create an error message and redirect to /yourney/create

- GET /yourney/:id
  - redirects to /auth/login if user is anonymous
  - validation
    - id is !valid (next to 404)
    - id !exists (next to 404)
  - renders the yourney detail page
    - shows the add button if not the owner

- POST /yourney/:id/add
  - redirects to /auth/login if user is anonymous
  - body:
  - validation
    - id is !valid (next to 404)
    - NOTE: findById to perform next validations
      - id !exists (next to 404)
      - check if is already added 
      - if added = flash message "already in your list"
  - add to user's list [use findAndUpdate] and flash message "yourney added"
  - redirect to /profile

## Models

User model
 
```
username: String // backlog
email: String (required)
password: String (required)

```

Yourney model

```
owner: ObjectId (user)
name: String (required)
description: String (required)
location: String (required)
date: Date
days: Number (required)
addedBy: [ObjectId (user)]
// not MVP
doneBy: [ObjectId (user)]
favoritedBy: [ObjectId (user)]
tags: String (enum: food, party, adventure, cultural, wandering, sports, shopping, music) (required)

``` 


## Links

### Trello

[Link to your trello board](https://trello.com/b/82m4gamv/yourneys)

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/MJHRhacker/yourneys)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)


## Wireframes
 
![Yourneys wireframes][wireframes]

[wireframes]: https://github.com/MJHRhacker/yourneys/blob/master/YOURNEYS%20wireframes%20Overview.png
