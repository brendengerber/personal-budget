//Variable used to hold envelopes, will replace with database
/* 
Envelopes are objects with the following format after an id is assigned:
{
    category: string,
    budget: number,
    id: number
}
*/

let envelopes = [
    {
        "category": "something",
        "budget": 4000,
        "id": 1
    },
    {
        "category": "something",
        "budget": 4000,
        "id": 2
    },
    {
        "category": "something",
        "budget": 4000,
        "id": 3
    }
]

module.exports = envelopes;