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
### 1. ENVELOPES ENDPOINTS
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
* Payload: JSON object `{"category": string, "budget": xxxx.xx number}`
* Response: JSON object containing the envelope along with it's newly assigned v4 UUID

### Endpoint: Delete Envelope By Id
* Description: Deletes an envelope from the database
* Path: `/api/envelopes/{id}`
* Method: `DELETE`
* Response: JSON object containing the deleted envelope

### Endpoint: Update Envelope By Id
* Description: Updates an envelope in the database with a specified new envelope
* Path: `/api/envelopes/{id}`
* Method: `PUT`
* Payload: JSON object `{"category": string, "budget": xxxx.xx number}` OR `{"id": v4 UUID string, "category": string, "budget": xxxx.xx number}`
* Response: JSON object containing the updated envelope

### Endpoint: Transfer Envelope Budget
* Description: Updates two specified envelopes in the database by transfering a specified budget from one to another
* Path: `/api/envelopes/{from-id}/transfer/{to-id}`
* Method: `PUT`
* Payload: JSON object `{"budget": xxxx.xx number}`
* Response: JSON object containing an array of the updated envelopes

### 2. PURCHASES ENDPOINTS
### Endpoint: Get All Purchases
* Description: Gets all of the purchases currently in the database
* Path: `/api/purchases`
* Method: `GET`
* Response: JSON array containing all purchases

### Endpoint: Get Purchase By Id
* Description: Returns the purchase with the specified Id from the database
* Path: `/api/purchases/{id}`
* Method: `GET`
* Response: JSON object containing the purchase of the specified Id

### Endpoint: Add New Purchase
* Description: Adds a new purchase to the database, assigns it a unique v4 UUID, and updates the budget of the corresponding envelope by subtracting the purchase amount
* Path: `/api/purchases/`
* Method: `POST`
* Payload: JSON object `{"envelope_id": v4 UUID string, "date": YYYY-MM-DD string, "description": string, "amount": xxxx.xx number}`
* Response: JSON object containing an array with the purchase along with it's newly assigned v4 UUID, and the corresponding envelope along with it's updated budget

### Endpoint: Delete Purchase By Id
* Description: Deletes a purchse from the database
* Path: `/api/purchases/{id}`
* Method: `DELETE`
* Response: JSON object containing the deleted purchase

### Endpoint: Update Purchase By Id
* Description: Updates a purchase in the database with a specified new purchase and updates the corresponding envelope with a new budget based on the difference between the new and old purchase
* Path: `/api/purchase/{id}`
* Method: `PUT`
* Payload: JSON object `{"envelope_id": v4 UUID string, "date": YYYY-MM-DD string, "description": string, "amount": xxxx.xx number}` OR `{"id": v4 UUID string, "envelope_id": v4 UUID string, "date": YYYY-MM-DD string, "description": string, "amount": xxxx.xx number}`
* Response: JSON object containing an array with the updated purchase, and the corresponding envelope along with it's updated budget

## **Acknowledgement**
Thank you to Codecademy for creating this exercise and inspiration
