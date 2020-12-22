<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** zaephyr, fpl_app, twitter_handle, email, App for Fantasy Premier League, project_description
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/zaephyr/fpl_app">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">App for Fantasy Premier League</h3>

  <p align="center">
    Small app that uses <a href="https://fantasy.premierleague.com/">Fantasy Premier League</a> API.
    <br />
    <a href="https://github.com/zaephyr/fpl_app"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="http://fpl-app.surge.sh/">View Demo</a>
    ·
    <a href="https://github.com/zaephyr/fpl_app/issues">Report Bug</a>
    ·
    <a href="https://github.com/zaephyr/fpl_app/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#build-setup">Build Setup</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

App uses certain Fantasy Premier League API endpoints to get some additional data, like showing choosen captains by FPL managers and ownership of footballers in specific league and a new version of the game.

Endpoints used:

> `https://fantasy.premierleague.com/api/bootstrap-static/`

On this endpoint you can get generic information:

- A summery of all 38 gameweeks
- Basic info on all 20 Premier League teams
- Basic info on all Premier League players

> `https://fantasy.premierleague.com/api/entry/{manager-id}/event/{GW}/picks/`

On this endpoint you can get picks from certain FPL manager for certain gameweek. Replace `{manager-id}` with, well, FPL player ID. For example here's an ID of one of the most famous FPL managers, a chess champ, Magnus Carlsen - `76862`. In place of `{GW}` choose a number between 1 and 38, would recommend earlier numbers as later gameweek might not happen yet.

> `https://fantasy.premierleague.com/api/leagues-classic/{league-id}/standings/`

FPL league's standings and it's overall info are avaible on this endpoint. Replace `{league-id}` with specific league's ID. For example, use an ID of one of the feirciest leagues - #Elite64 - `21004`

### Built With

- [Nuxt.js](https://nuxtjs.org/)
- [Vue.js](https://vuejs.org/)
- [Vuex](https://vuex.vuejs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/zaephyr/fpl_app.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

### Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

<!-- USAGE EXAMPLES -->

## Usage

For quick look of the app, testing account was created:

- e-mail: test@testing.com
- password: asdfasdf

On left side is a menu with Username (tester), standard league (#Elite64) and Free Hit League (test-league) already added. Creating your own Free Hit League via app is currently not possible, to do so you you'll need to contact the author.

For Free Hit League, official team [rules](https://fantasy.premierleague.com/help), exept there are 11 players to be picked instead of 15 (no bench) and starting bank is 83m instead of 100m.

_For more examples, please refer to the [Documentation](https://example.com)_

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/zaephyr/fpl_app/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Project Link: [https://github.com/zaephyr/fpl_app](https://github.com/zaephyr/fpl_app)
