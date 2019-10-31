# request-handler

[![Discord](https://discordapp.com/api/guilds/339942739275677727/embed.png)](https://klasa.js.org)
[![npm](https://img.shields.io/npm/v/@klasa/request-handler.svg?maxAge=3600)](https://www.npmjs.com/package/@klasa/request-handler)
[![npm](https://img.shields.io/npm/dt/@klasa/request-handler.svg?maxAge=3600)](https://www.npmjs.com/package/@klasa/request-handler)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/dirigeants/request-handler.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/dirigeants/request-handler/alerts/)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=dirigeants/request-handler)](https://dependabot.com)
[![David](https://img.shields.io/david/dirigeants/request-handler.svg?maxAge=3600)](https://david-dm.org/dirigeants/request-handler)
[![Patreon](https://img.shields.io/badge/donate-patreon-F96854.svg)](https://www.patreon.com/klasa)

## About

`@klasa/request-handler` is an abstracted utility made for [klasa]'s SettingsGateway, where in certain scenarios, many
entries have to be synchronized at arbitrarily any time. This tool helps reducing the database load by batching multiple
queries into chunks.

[klasa]: https://github.com/dirigeants/klasa
