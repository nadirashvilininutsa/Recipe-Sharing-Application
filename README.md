# Introduction

This is a recipe sharing application built with Angular framework. This application allows users to register, add recipes to favorites and post/view/edit/delete recipes.

Anonymous users are only allowed to view list of recipes as well as detailed information of any recipe. They can navigate to home, login and register pages.

Logged in users are allowed to create new recipes, also edit/delete their own recipes and add any recipe in favorites. Authorized users can navigate to home and new-recipe pages.

Angular routing is used for routing. There are two module: App Module and Main Module. App module consists of login, register and header components. Main module consists of main, recipe, details, new-recipe and delete-dialog components.

Services are used for communication with back. Common service is used for communication with db.json file, that acts as a mock service for sorting all information. Auth service is used for user authentication.

Firebase is used for user authentication. After new user is registered, user's detailed information (except password) is also sent to back

Interfaces are located in models folder. Auth-models.ts file contains of all user related interfaces. recipe-models.ts file contains all recipe related interfaces and form-models.ts file contains all form related interfaces

In main component, recipe or details components are rendered and input/output decorators are used for data flow.

Angular forms are used for all type of forms (new recipe, registration. login, search). Forms have their own validation requirements.

Mixins and color variables are used for styling commonly used elements.

# Installation and Setup

Clone the repository.

Install Node.js and npm.

Navigate to the project folder.

Run npm install to install all the dependencies.

Run nom run server to run db.json file.

Run npm start for a local dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.
