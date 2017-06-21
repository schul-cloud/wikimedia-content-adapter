# wikimedia-content-adapter

## Get started

After clone this repo go inside the directory and run :

		npm install

To start the service on default configurations run:

		npm start

The Service will listen on localhost:3000.

If you want to run it under an other port/address run:

		nodejs app.js -address address-to-listen-on -port port-to-listen-on

When running without params port or address will be default

## Code Example

		your.domain/v1?q=search-value&page[limit]=12&filter[license]=pd

## API Reference

Query params:

-	q = query value for searching.
-	page[limit] = max number of result elements.
-	page[offset] = offset of the result elements.
-	filer[filterKey] = filter for the result. The filterKey must be an key of the result object.

## License

                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.
