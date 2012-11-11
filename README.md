# SEAO-Ouvert

## SEAOO Scraper ! :D

Periodically scrap new notices from seao.c and insert them into a MongoDB database.

### how to run

* `npm install`
* create `.env` file with "SCRAPE_INTERVAL" (seconds), "REDIS_URL"
* `foreman start worker`

## SEAOO Server

A minimalist read-only REST API for SEAO data.

### Usage

Being a read-only API, the server only support GET request.

#### Search for notice by number (with support for buyer name and type)

Example:

`GET http://localhost:8080/notice?number=10042&buyer=Laval&buyerType=4`

```json
{
    "total": "5",
    "notices": [
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=bde3ec09-e3d2-457f-9f9a-e8755a99ab6f",
            "No": "QC-RAMQ-20110042a",
            "Title": "Avis public de qualification - Réalisation de travaux de coordination de l’exploitation et des activités d’entretien et d’évolution des solutions",
            "Status": "Fermé",
            "NoRef": "587689",
            "itemId": "bde3ec09-e3d2-457f-9f9a-e8755a99ab6f",
            "information": {
                "PublicationDate": "2012-09-07 15h39"
            }
        },
        ...
    ]
}
```

#### Search for notice by category

Example:

`GET http://localhost:8080/notice?category=G15`

```json
{
    "total": 0,
    "notices": [
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=078e2494-1dc5-44ab-bb1e-bca4be301e21",
            "No": "12-565",
            "Title": "Fourniture de poissons et de fruits de mer surgelés pour les restaurants des casinos de Montréal et du Lac-Leamy",
            "Status": "Publié",
            "NoRef": "597807",
            "itemId": "078e2494-1dc5-44ab-bb1e-bca4be301e21",
            "information": {
                "PublicationDate": "2012-11-07 14h42"
            }
        },
        ...
    ],
    "page": 1
}
```

#### Get notice details

Example:

`GET http://localhost:8080/notice/bde3ec09-e3d2-457f-9f9a-e8755a99ab6f`

```json
{
    "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=bde3ec09-e3d2-457f-9f9a-e8755a99ab6f",
    "itemId": "bde3ec09-e3d2-457f-9f9a-e8755a99ab6f",
    "No": "QC-RAMQ-20110042a",
    "NoRef": "587689",
    "Status": "Fermé",
    "Title": "Avis public de qualification - Réalisation de travaux de coordination de l’exploitation et des activités d’entretien et d’évolution des solutions",
    "information": {
        "PublicationDate": "2012-09-07",
        "OppTitle": "Avis public de qualification - Réalisation de travaux de coordination de l’exploitation et des activités d’entretien et d’évolution des solutions",
        "OppType": "Avis de qualification de fournisseurs",
        "ContractType": "Services professionnels",
        "ReceptionDate": "2012-09-08 Au plus tard 00h, Heure du Québec",
        "DeliveryArea": "Capitale Nationale",
        "AccordType": "Accord sur le commerce intérieur, Accord Québec-Ontario, Accord Québec-Nouveau-Brunswick, Accord Québec-New York"
    },
    "buyer": {
        "website": null,
        "coordinator": "'...",
        "Organisation": "<b>Régie de l'assurance maladie du Québec<br></b>",
        "OrganizationAddress": "..."
    },
    "unspsc": {
        "81111000": "Services en technologie de l'information"
    },
    "categories": {
        "S13": "Services de soutien professionnel et administratif et services de soutien à la gestion"
    },
    "description": "..."
}
```

### how to run

 * `npm install`
 * install [phantomjs](http://phantomjs.org/)
 * `node seaoo-server.js`

## SEAOO API

Scrapin API to retrieve data fron seao.ca