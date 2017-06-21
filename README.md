# wikimedia-content-adapter

## Get started

After clone this repo. Go inside the dictory and run :

		npm install

too start the service on default configureation run:

		npm start

the Service will listen on localhost:3000.

If you want to run him under an other port/address run:

		nodejs app.js -address address-for-listening -port port-for-listening

when runnig without params port or address will be default

## Code Example

		your.domain/v1?q=search-value&page[limit]=12&filter[license]=pd

## API Reference

Query params:

-	q = query value for searching.
-	page[limit] = max cout of result elements.
-	page[offset] = offset of the result elements.
-	filer[filterKey] = filter for the result. The filterKey must be an key of the result object

## License

                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.
