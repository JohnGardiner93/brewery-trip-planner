# 🍺 Brewery Trip Planner 🍺

## 🚩 Purpose

This is a project of my own design. The long-term objective is to provide information to a user that can be used as part of planning trips to breweries. This project will be split into multiple parts and will be periodically enhanced as I progress through more Node.JS topics covered in [Jonas Schmedtmann's Node.JS Course](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/).

## 📑 Table of Contents

- [Part 1](#-part-1-async--apis)
  - [Description](#-description)
  - [Requirements](#-requirements)
  - [Usage](#-usage)
  - [Result](#-result
- [Part 2](#-part-2-client-side-elements)
- [Part 3](#-part-3-itinerary-planning)
- [Installation](#-installation)

# 🔎 Part 1: Async & API's

## 🔴 Description

Part 1 of this project centers around practicing asynchronous JS behavior. It includes API calls and other asynchronous activities using promises. The information gathered in the Part 1 exercise will be used in Part 2 to build dynamic web pages that will be served to the user. This exercise was designed to practice information from Sections 3-5 of the aforementioned NodeJS course.

The user can input a state of interest. An API is called to retrieve the towns and cities in that state. The user can then select a city/town. That information is then used to serve the user with the predicted weather for the next 5 days. It is also used to give the user a list of breweries in the city they supplied. With this information, the user can make an informed decision regarding which breweries to visit or if they'd like to visit a brewery at all (given the weather)

## 🔵 Requirements

Call three API's and feed this information to the user in a palatable manner. Handle errors that may occur. Store the information requested by the user in a format that can be called upon later by the server.

## 🟢 Usage

Run the index.js file to get started. Input the state then city of your choice into the console. Weather and nearby brewery information will be provided via a generated HTML page (resultsPage.html). The information will also be placed into a JSON file.

## ✅ Result
https://user-images.githubusercontent.com/7349117/131990045-810b4305-0820-42e3-9095-0ddc965e43ec.mp4

# 💻 Part 2: Client-Side Elements

Part 2 of this project will focus on providing the information gathered in Part 1 to a user on a client-side browser. This information will be displayed in a desktop-focused layout. New information requests for information will be initiated by the user, such as brewery website links. Breweries will be displayed on a map, thus an open-source Map API will be used as part of the presentation to the client.

# 🗺 Part 3: Itinerary Planning

Part 3 of this project will focus on enhancing the functionality of the site. The goal of this part will be to enable a user to map routes to breweries such that they can create their own custom itinerary. A routing API will be needed for this step.

# 🔮 Future Plans

Long-term, information regarding the taplist at locations of interest would be ideal for those user planning trips around their favorite styles. This will either require a custom API or a pre-existing API that requires fees.

# 🚀 Installation

Use npm to insall inquirer and nodemon (or whatever server-hosting method you prefer).
