# CQRSMediatR

This repository is a template for ASP.NET Core projects using CQRS and MediatR. 
Feel free to use it as a base for projects you want to further develop.

## Backend
* ASP.NET Core 3.1
* Entity Framework Core (SQL)
* ASP.NET Core Identity
* MediatR
* AutoMapper

Using the above together with the design pattern CQRS results in what I consider a very clean codebase that is easy to extend and maintain.

## Frontend
* React - functional components using hooks
* Typescript
* Compiled and bundled with Webpack
* Yarn is used as package manager

With React you are able to create a great looking SPA build on components. 
TypeScript lets you have type safety as well. What's not to like.

All frontend code is located in [Template.Web/client](https://github.com/JonTvermose/CQRSMediatR/tree/master/Template.Web/client)

# How to run
* Update the appsettings.json and appsettings.development.json with your settings (connectionstring etc).
* Build the frontend
  * Install yarn
  * Open command prompt and navigate to the root of Template.Web
  * Run <code>yarn app</code> or <code>yarn app-prod</code>
* Run the application in Visual Studio
* Register a new user (Create account)
  * You activation mail is found in <code>C:/Mails"</code> when running on localhost

