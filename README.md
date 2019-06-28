# CONSENT RECEIPT PROJECT 
### Overview 

Personally identifiable information (PII) is exchanged by different parties for different uses. E.g., retail shops need PII to target consumers with more specific offers; hospitals need PII to treat their patients etc.

Certain uses of PII require the person that the PII belongs to (PII principal) to give consent to the entity controlling / using the PII (PII controller). Otherwise the usage of the PII might be illegal (as per GDPR).

The PII principal benefits from having a "receipt" of the given consent (consent receipt or CR) in his possession. This allows him to have an overview of how his PII is being used and possibly exercise some other rights over this data.

The PII controller is required by law (at least in EU and referring to GDPR) to have consent for uses of PII under his control (that does not fall under some some other grounds for processing). Therefore, the PII controller benefits from having a CR in his records, (especially if it is digitally signed by the PII principal, giving it greater weight).

Note: a "Consent receipt" can be issued even if no consent for PII is needed. In that case it acts in an informative manner. 

### Specifications 

General flow of the Consent Receipt:

![image](https://user-images.githubusercontent.com/1554520/59093151-86c5ba80-8913-11e9-9bba-0a67af598133.png)

The "CR JSONSchema" defines the structure of a CR. Starting from the schema, the PII Controller can generate a "proposed CR JSON", by adding values to all the relevant fields. The "proposed CR JSON" should be presented to the PII Principal in an appropriate way (human readable and possibly using one of the developed modules). PII Principal can  give his consent, after which a "CR JWT" is generated which both the Controller and Principal can save (to different variants of storage).

Building upon the [React JSONSchema framework](https://mozilla-services.github.io/react-jsonschema-form/), the presentation of CR on screen in either the human readable and read only form or the more flexible editable form used by the PII controller will be achieved by a combination of CR JSONSchema (defining the structure and allowed values), UISchema (defining the controls / menus displayed on screen), formData (defining the default / displayed values) and CSS styles (defining the look of the UI).

![image](https://user-images.githubusercontent.com/1554520/59093196-a230c580-8913-11e9-9a45-254204574f73.png)

Packages:
- consent receipt generator package
- consent receipt viewer package
- consent receipt summary viewer package
- API server package


### Design guidelines 
### References 

- [Kantara Consent Receipt spec v1.1](https://kantarainitiative.org/file-downloads/consent-receipt-specification-v1-1-0/)
- [CR v1.1 JSONSchema version](https://kantarainitiative.org/confluence/download/attachments/76447870/CR%20Schema%20v1_1_0%20DRAFT%206.json?version=2&modificationDate=1511151073000&api=v2)
- See [react-jsonschema-form](https://mozilla-services.github.io/react-jsonschema-form/) for reference about using JSONSchema, UISchema, formData

### 

## CONSENT RECEIPT GENERATOR PACKAGE
### Overview

Consent receipt generator package contains a graphical user interface to edit the JSONSchema, UISchema and formData parts of the consent receipt. A configuration can be exported as a project file, that contains all three components and can be used in the later process. It is meant to be used by the data user (PII Controller).

Available at: <https://github.com/datafund/dr-generator>

## CONSENT RECEIPT VIEWER PACKAGE
### Overview

Consent receipt viewer package contains a graphical user interface to view a proposed consent receipt or an already accepted consent receipt. It is meant to be used by the individual (PII Principal).

Available at: <https://github.com/datafund/dr-viewer>

## CONSENT RECEIPT SUMMARY VIEWER PACKAGE 
### Overview

Consent receipt summary viewer package contains graphical user interface to view summary information from a number of consent receipts in some storage. It is meant to be used by the individual (PII Principal). 

Available at: <https://github.com/datafund/dr-summary>

## API SERVER IMPLEMENTATION 
### Overview

API server implementation is an example of a server for signing a proposed consent receipt and making it into a consent receipt JWT. 
**NOTE: It is not meant to be used in a production environemnt as-is, as it should not be considered secured enough. Consider it a reference implementation.**

Available at: <https://github.com/datafund/dr-api-server>

## SAMPLE EDITOR VIEWER
### Overview

Sample editor viewer is a reference implementation of all the modules budled into one application. It is meant for reference and for demos.

Available at: <https://github.com/datafund/dr-editor-sample>

## FDS.JS INTEGRATION SAMPLE 

Upcoming ...

## FAIRDROP INTEGRATION
Upcoming ...

## RECLAIM INTEGRATION

Upcoming ...

## 


