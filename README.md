# Personal Budget
## **Desctiption**

This small api is based off of the envelope budgeting system. The concept is that a set of envelopes each represent a category of spending. The money you have to spend each month is divided accordingly and placed inside the corresponding envelope. When the time comes to pay for an expense, the money is withdrawn from the appropriate envelope. Portions of a budget can also be transferred from one envelope to another if the situation calls for it.  At the end of the month the money in the envelopes is refilled and the process begins again.

## **Technologies**
1. JavaScript
2. Node.js 
3. Express.js
4. PostgresSql
---
## **Features**

### 1. Built to scale. 

* Moduler design allows new functionality to be added without affecting existing files.
* Route functionality is kept in seperate middleware functions to maintain separation of concerns and allow for re use in multiple routes.
* Helper functions are kept generic to allow for re-use by multiple modules for multiple purposes.
* Helper functions are used to obtain data, such that if the data storage method is changed, they can be refactored to return the same results, without affecting the rest of the server and allowing it to continue functioning as normal.

### 2. Paramaterized dynamic query functions.
* Generic functions use arguments to build dynamic queries which can be reused on any table regardless of columns.
* Queries are paramaterized to prevent SQL injection.
* Dynamic table and column names are escaped to prevent SQL injection

### 3. Data stored in database. 
* All data is stored in a PostgresSql database.
* New entries are auto-assigned a unique v4 UUID.
---
## **Summary of API Specification**
### Endpoint: Get All Envelopes
* Description: Gets all of the envelopes currently in the database
* Path: `/api/envelopes`
* Method: `GET`
* Response: JSON array containing all envelopes

### Endpoint: Get Envelope By Id
* Description: Returns the envelope with the specified Id from the database
* Path: `/api/envelopes/{id}`
* Method: `GET`
* Response: JSON object containing the envelope of the specified Id

### Endpoint: Add New Envelope
* Description: Adds a new envelope to the database and assigns it a unique v4 UUID
* Path: `/api/envelopes/`
* Method: `POST`
* Payload: JSON object `{"category": string, "budget": number}`
* Response: JSON object containing the envelope and it's newly assigned v4 UUID

### Endpoint: Delete Envelope By Id
* Description: Deletes an envelope from the database
* Path: `/api/envelopes/{id}`
* Method: `DELETE`
* Response: JSON object containing the envelope that was deleted

### Endpoint: Update Envelope By Id
* Description: Updates an envelope in the database with a specified new envelope
* Path: `/api/envelopes/{id}`
* Method: `PUT`
* Payload: JSON object `{"category": string, "budget": number}` OR `{"id": string, "category": string, "budget": number}`
* Response: JSON object containing the updated envelope

### Endpoint: Transfer Envelope Budget
* Description: Updates two specified envelopes in the database by transfering a specified budget from one to another
* Path: `/api/envelopes/{from-id}/transfer/{to-id}`
* Method: `PUT`
* Payload: JSON object `{"budget": number}`
* Response: JSON object containing an array of the updated envelopes

## **Acknowledgement**
Thank you to Codecademy for creating this exercise and inspiration
