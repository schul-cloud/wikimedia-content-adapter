[![Travis Status](https://travis-ci.org/schul-cloud/wikimedia-content-adapter.svg?branch=master)](https://travis-ci.org/schul-cloud/wikimedia-content-adapter) [![Docker Build Statu](https://img.shields.io/docker/build/schulcloud/wikimedia-content-adapter.svg)](https://hub.docker.com/r/schulcloud/wikimedia-content-adapter/builds/) [![Greenkeeper badge](https://badges.greenkeeper.io/schul-cloud/wikimedia-content-adapter.svg)](https://greenkeeper.io/)

# wikimedia-content-adapter

This repository contains a service adapter for querying the [Wikimedia API][wikimedia-api].
The service provides the [Schul-Cloud Search API interface][search-api].

[search-api]: https://github.com/schul-cloud/resources-api-v1#search-api
[wikimedia-api]: https://commons.wikimedia.org/w/api.php

## Get started

After clone this repo go inside the directory and run :

```bash
npm install
```
To start the service on default configurations run:

```bash
npm start
```
The Service will listen on [localhost:3000](http://localhost:3000).

If you want to run it under an other port/address run:

```bash
nodejs app.js -address address-to-listen-on -port port-to-listen-on
```
When running without params port or address will be default

## Code Example

```http
 your.domain/v1?q=search-value&page[limit]=12&filter[license]=pd
```
## API Reference

Query params:

-	Q = query value for searching.
-	page[limit] = max number of result elements.
-	page[offset] = offset of the result elements.
-	filer[filterKey] = filter for the result. The filterKey must be an key of the result object.

## License
```
                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.
```
