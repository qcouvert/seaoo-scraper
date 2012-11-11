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

### Search for notice by category

Example:

`GET http://localhost:8080/notice?number=10042&buyer=Laval&buyerType=4`

### Search for notice by number (with support for buyer and buyer type)

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
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=51869902-9f3c-4bf8-8bf8-bee9d332c73d",
            "No": "2012-128-01-01",
            "Title": "Jus de fruits en conserve, eau et boissons gazeuses",
            "Status": "Publié",
            "NoRef": "597331",
            "itemId": "51869902-9f3c-4bf8-8bf8-bee9d332c73d",
            "information": {
                "PublicationDate": "2012-11-06 14h26"
            }
        },
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=c6c20da0-d036-4edc-9d3c-5b54f5f2f9a4",
            "No": "2012-125-01-01",
            "Title": "Produits de boulangerie et desserts surgelés",
            "Status": "Publié",
            "NoRef": "597329",
            "itemId": "c6c20da0-d036-4edc-9d3c-5b54f5f2f9a4",
            "information": {
                "PublicationDate": "2012-11-06 14h20"
            }
        },
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=b3ab5c60-3dc6-4663-b8ef-de786f583394",
            "No": "2012-137-01-01",
            "Title": "Céréales prêtes à servir, biscuits et grignotines",
            "Status": "Publié",
            "NoRef": "597334",
            "itemId": "b3ab5c60-3dc6-4663-b8ef-de786f583394",
            "information": {
                "PublicationDate": "2012-11-06 14h19"
            }
        },
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=551ccb61-4e5c-4291-a23d-15179f7a09e0",
            "No": "2012-138-01-01",
            "Title": "Aliments pour bébés",
            "Status": "Publié",
            "NoRef": "597336",
            "itemId": "551ccb61-4e5c-4291-a23d-15179f7a09e0",
            "information": {
                "PublicationDate": "2012-11-06 14h18"
            }
        },
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=fa0b0fc1-d14e-4bc6-aa60-17e8305d06c9",
            "No": "2012-147-01-01",
            "Title": "Soupes en conserve",
            "Status": "Publié",
            "NoRef": "597338",
            "itemId": "fa0b0fc1-d14e-4bc6-aa60-17e8305d06c9",
            "information": {
                "PublicationDate": "2012-11-06 14h14"
            }
        },
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=3c375575-e101-46da-8d5b-5886419e710c",
            "No": "2012-153-01-01",
            "Title": "Bases pour boissons diverses",
            "Status": "Publié",
            "NoRef": "597339",
            "itemId": "3c375575-e101-46da-8d5b-5886419e710c",
            "information": {
                "PublicationDate": "2012-11-06 14h13"
            }
        },
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=a6c0375d-109e-4307-8612-1474a1660c3f",
            "No": "2012-149-01-01",
            "Title": "Fruits surgelés",
            "Status": "Publié",
            "NoRef": "597340",
            "itemId": "a6c0375d-109e-4307-8612-1474a1660c3f",
            "information": {
                "PublicationDate": "2012-11-06 14h12"
            }
        },
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=a809b3c2-85a8-4104-b4ef-ed501d3eed97",
            "No": "2012-130-01-01",
            "Title": "Légumes secs",
            "Status": "Publié",
            "NoRef": "597343",
            "itemId": "a809b3c2-85a8-4104-b4ef-ed501d3eed97",
            "information": {
                "PublicationDate": "2012-11-06 14h11"
            }
        },
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=dfcbf203-b81a-4dee-bb4f-b870f2a4a4d0",
            "No": "2012-122-01-01",
            "Title": "Repas surgelés",
            "Status": "Publié",
            "NoRef": "597346",
            "itemId": "dfcbf203-b81a-4dee-bb4f-b870f2a4a4d0",
            "information": {
                "PublicationDate": "2012-11-06 14h11"
            }
        },
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=623d15aa-40aa-4545-a532-7eb5ac2ab5cb",
            "No": "2012-136-01-01",
            "Title": "Produits de pâtisserie, sirops et confitures",
            "Status": "Publié",
            "NoRef": "597332",
            "itemId": "623d15aa-40aa-4545-a532-7eb5ac2ab5cb",
            "information": {
                "PublicationDate": "2012-11-06 14h01"
            }
        },
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=e35cf525-d240-4e99-8a68-daca2c4da569",
            "No": "P12-031",
            "Title": "Service d'autodistribution de café",
            "Status": "Publié",
            "NoRef": "596640",
            "itemId": "e35cf525-d240-4e99-8a68-daca2c4da569",
            "information": {
                "PublicationDate": "2012-11-02 9h02"
            }
        },
        {
            "url": "https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=3f5cf688-b39f-4000-8259-dbacffb611de",
            "No": "Cont2012-1000-01",
            "Title": "Acquisition d'un four pour le 625, des épilobes",
            "Status": "Publié",
            "NoRef": "596650",
            "itemId": "3f5cf688-b39f-4000-8259-dbacffb611de",
            "information": {
                "PublicationDate": "2012-11-01 15h04"
            }
        }
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
        "coordinator": "<span>Audrey Walker </span><br><span>Téléphone: (418) 682-5195</span><br><span>Télécopieur: (418) 646-7170</span><br><span>Courriel: <a href=\"mailto:audrey.walker@ramq.gouv.qc.ca\">audrey.walker@ramq.gouv.qc.ca</a></span> <!--temTemplate> <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\"> <tr> <td colspan=\"2\"> <span id=\"MainUserControl_ResponsablesList_lbName\"></span> </td> </tr> <tr> <td> <span id=\"MainUserControl_ResponsablesList_lbPhoneNumber\"></span> </td> <td> </td> </tr> <tr> <td> <span id=\"MainUserControl_ResponsablesList_lbEMail\"></span> </td> <td> </td> </tr> </table> </ItemTemplate--> ",
        "Organisation": "<b>Régie de l'assurance maladie du Québec<br></b>",
        "OrganizationAddress": "1125 Grande Allée Ouest<br>Québec, QC<br>G1S 1E7"
    },
    "unspsc": {
        "81111000": "Services en technologie de l'information"
    },
    "categories": {
        "S13": "Services de soutien professionnel et administratif et services de soutien à la gestion"
    },
    "description": "<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify;\"><font face=\"Arial\"><span lang=\"FR\">Comme mentionné au 3</span><sup><span lang=\"FR\" style=\"mso-bidi-font-size: 11.0pt;\">o</span></sup><span lang=\"FR\"> paragraphe de l’article 43 du Règlement sur les contrats de services des organismes publics, un avis public de qualification doit être publié à nouveau au moins une fois l’an, et ce, bien que l’organisme public puisse procéder à une qualification à des intervalles pouvant aller jusqu’à trois ans.</span></font></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify;\"><span lang=\"FR\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify;\"><span lang=\"FR\"><font face=\"Arial\">Afin de se conformer à la réglementation en vigueur, la Régie publie le présent avis public de qualification <u>sans pour autant procéder à la qualification de nouveaux prestataires de services</u>.</font></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: 48.0pt;\"><span lang=\"FR\" style=\"mso-bidi-font-weight: bold;\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: 48.0pt;\"><b><span lang=\"FR\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></b></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt 48pt; TEXT-INDENT: -48pt; TEXT-ALIGN: justify; tab-stops: 48.0pt;\"><b><span lang=\"FR\"><font face=\"Arial\">Projet&nbsp;:<span style=\"mso-tab-count: 1;\">&nbsp;&nbsp; </span>Réalisation de travaux de coordination de l’exploitation et des activités d’entretien et d’évolution des solutions <o:p></o:p></font></span></b></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: 48.0pt;\"><b><span lang=\"FR\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></b></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: 48.0pt;\"><span lang=\"FR\" style=\"mso-bidi-font-weight: bold;\"><font face=\"Arial\">Numéro de l’avis&nbsp;: QC-RAMQ-20110042<o:p></o:p></font></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: 48.0pt;\"><span lang=\"FR\" style=\"mso-bidi-font-weight: bold;\"><font face=\"Arial\">Numéro de référence SÉAO&nbsp;: 499535<o:p></o:p></font></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify;\"><span lang=\"FR\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify;\"><span lang=\"FR\"><font face=\"Arial\">Listes des prestataires de services qualifiés pour chacun des volets<span style=\"mso-tab-count: 1;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><o:p></o:p></font></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; tab-stops: 48.0pt;\"><span lang=\"FR\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; tab-stops: 48.0pt;\"><u><span lang=\"FR\"><font face=\"Arial\">Volet A&nbsp;:<span style=\"mso-tab-count: 1;\">&nbsp;&nbsp; </span>Coordination des activités d’exploitation<o:p></o:p></font></span></u></p>\r\n<ul style=\"MARGIN-TOP: 0in;\" type=\"square\">\r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l2 level1 lfo1;\"><span lang=\"FR\"><font face=\"Arial\">Conseillers en Informatique et Gestion CGI inc.</font></span> \r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l2 level1 lfo1;\"><span lang=\"FR\"><font face=\"Arial\">Nurun inc.</font></span></li>\r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l2 level1 lfo1;\"><span lang=\"FR\"></span><span lang=\"FR\"><font face=\"Arial\">Société TELUS Communications</font></span></li></li></ul>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; tab-stops: 48.0pt;\"><span lang=\"FR\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; tab-stops: 48.0pt;\"><u><span lang=\"FR\"><font face=\"Arial\">Volet B&nbsp;:<span style=\"mso-tab-count: 1;\">&nbsp;&nbsp; </span>Coordination des activités d’entretien et d’évolution des infrastructures<o:p></o:p></font></span></u></p>\r\n<ul style=\"MARGIN-TOP: 0in;\" type=\"square\">\r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l2 level1 lfo1;\"><span lang=\"FR\"><font face=\"Arial\">Conseillers en Informatique et Gestion CGI inc.</font></span></li>\r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l2 level1 lfo1;\"><span lang=\"FR\"></span><span lang=\"FR\"><font face=\"Arial\">DMR, une division de Fujitsu Canada inc.</font></span> </li>\r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l1 level1 lfo2;\"><span lang=\"FR\"><font face=\"Arial\">Nurun inc.</font></span> \r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; tab-stops: list .5in left 48.0pt; mso-list: l1 level1 lfo2;\"><span lang=\"FR\"><font face=\"Arial\">Sinapse Intervention Stratégiques inc.</font></span></li></li></ul>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; tab-stops: 48.0pt;\"><span lang=\"FR\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: 48.0pt;\"><u><span lang=\"FR\"><font face=\"Arial\">Volet C&nbsp;:<span style=\"mso-tab-count: 1;\">&nbsp; </span>Coordination des activités d’entretien et d’évolution applicatifs et des solutions d’intégration<o:p></o:p></font></span></u></p>\r\n<ul style=\"MARGIN-TOP: 0in;\" type=\"square\">\r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l2 level1 lfo1;\"><span lang=\"FR\"><font face=\"Arial\">Conseillers en Informatique et Gestion CGI inc.</font></span> \r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; tab-stops: list .5in left 48.0pt; mso-list: l2 level1 lfo1;\"><span lang=\"FR\"><font face=\"Arial\">DMR, une division de Fujitsu Canada inc.</font></span> \r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l2 level1 lfo1;\"><span lang=\"FR\"><font face=\"Arial\">Les services conseils Systématix inc.</font></span></li></li></li></ul>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt 0.25in; TEXT-ALIGN: justify;\"><span lang=\"FR\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: 48.0pt;\"><u><span lang=\"FR\"><font face=\"Arial\">Volet D&nbsp;:<span style=\"mso-tab-count: 1;\">&nbsp; </span>Soutien à la gestion<o:p></o:p></font></span></u></p>\r\n<ul style=\"MARGIN-TOP: 0in;\" type=\"square\">\r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l2 level1 lfo1;\"><span lang=\"FR\"><font face=\"Arial\">Conseillers en Informatique et Gestion CGI inc.</font></span> \r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l2 level1 lfo1;\"><span lang=\"FR\"><font face=\"Arial\">GDG Informatique et Gestion inc.</font></span></li>\r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l2 level1 lfo1;\"><span lang=\"FR\"></span><span lang=\"FR\"><font face=\"Arial\">La Société conseil Lambda inc.</font></span> </li>\r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in; mso-list: l0 level1 lfo3;\"><span lang=\"FR\"><font face=\"Arial\">Les services conseils Systématix inc.</font></span> \r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in left 48.0pt; mso-list: l0 level1 lfo3;\"><span lang=\"FR\"><font face=\"Arial\">MCDA Conseils inc.</font></span> \r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in left 48.0pt; mso-list: l0 level1 lfo3;\"><span lang=\"FR\"><font face=\"Arial\">R3D Conseil inc.</font></span> \r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; tab-stops: list .5in left 48.0pt; mso-list: l0 level1 lfo3;\"><span lang=\"FR\"><font face=\"Arial\">Sinapse Intervention Stratégiques inc.</font></span> \r\n<li class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: list .5in left 48.0pt; mso-list: l0 level1 lfo3;\"><span lang=\"FR\"><font face=\"Arial\">TechnoConseil inc.</font></span></li></li></li></li></li></li></ul>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify;\"><span lang=\"FR\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify;\"><span lang=\"FR\"><font face=\"Arial\">Date d’échéance de la liste&nbsp;: 31 juillet 2014</font></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify;\"><span lang=\"FR\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify;\"><span lang=\"FR\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: 27.0pt;\"><b style=\"mso-bidi-font-weight: normal;\"><u><span style=\"COLOR: black; mso-bidi-font-size: 11.0pt; mso-bidi-font-family: Arial; mso-ansi-language: FR-CA;\"><font face=\"Arial\">Signataire de l’avis public de qualification<o:p></o:p></font></span></u></b></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: 27.0pt;\"><span style=\"COLOR: black; mso-bidi-font-size: 11.0pt; mso-bidi-font-family: Arial; mso-ansi-language: FR-CA;\"><o:p><font face=\"Arial\">&nbsp;</font></o:p></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify; tab-stops: 27.0pt;\"><span style=\"COLOR: black; mso-bidi-font-size: 11.0pt; mso-bidi-font-family: Arial; mso-ansi-language: FR-CA;\"><font face=\"Arial\">Monsieur Serge Bégin<o:p></o:p></font></span></p>\r\n<p class=\"MsoNormal\" style=\"MARGIN: 0in 0in 0pt; TEXT-ALIGN: justify;\"><span style=\"COLOR: black; mso-bidi-font-size: 11.0pt; mso-bidi-font-family: Arial; mso-fareast-language: FR; mso-ansi-language: FR-CA;\"><font face=\"Arial\">Chef du Service de la gestion contractuelle et des ressources matérielles</font></span><span lang=\"FR\" style=\"mso-bidi-font-size: 11.0pt; mso-bidi-font-family: Arial;\"><o:p></o:p></span></p>"
}
```

Where `itemid` is the UUID of a notice.

### how to run

 * `npm install`
 * install [phantomjs](http://phantomjs.org/)
 * `node seaoo-server.js`

## SEAOO API

Scrapin API to retrieve data fron seao.ca