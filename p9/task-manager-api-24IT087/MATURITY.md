# Richardson Maturity Model Evaluation

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | / | Welcome endpoint that describes the base API and available resource entry points |
| GET | /tasks | Retrieve all tasks |
| GET | /tasks/:id | Retrieve a single task by its ID |
| POST | /tasks | Create a new task |
| PUT | /tasks/:id | Update an existing task |
| DELETE | /tasks/:id | Delete a task by its ID |

## Evaluation Table

| Level | Criterion | Does API Satisfy? | Evidence |
| --- | --- | --- | --- |
| 0 | Single endpoint for everything | No | The API exposes dedicated resource routes such as `/tasks` and `/tasks/:id` instead of routing everything through one universal URL. |
| 1 | Resources exposed through distinct URLs | Yes | The collection resource is modeled as `/tasks`, while an individual resource is modeled as `/tasks/:id`. This is a clear separation of resource identity. |
| 2 | Proper HTTP methods, REST URL design, JSON responses, and correct status codes | Yes | The API uses `GET`, `POST`, `PUT`, and `DELETE` on resource-based URLs. It returns JSON responses and uses appropriate responses such as `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, and `500 Internal Server Error`. |
| 3 | Hypermedia controls (HATEOAS) | No, not implemented | The requirement explicitly says not to implement HATEOAS. A documentation example is provided below to show the intended Level 3 representation. |

## Improvements Made

- Added a missing single-resource `GET /tasks/:id` route to support proper resource-level retrieval.
- Strengthened `POST /tasks` validation so `title` must be a non-empty string.
- Strengthened `PUT /tasks/:id` validation so `title` must be a non-empty string and `completed` must be a boolean value.
- Preserved the existing project structure and CRUD behavior while improving REST consistency and error handling.

## HATEOAS Awareness

```json
{
  "id": 1,
  "title": "Complete Assignment",
  "_links": {
    "self": "/tasks/1",
    "update": "/tasks/1",
    "delete": "/tasks/1"
  }
}
```

## Reflection

This project was evaluated against the Richardson Maturity Model by reviewing its Express routes, resource naming, HTTP verbs, and response patterns. The main improvement was adding the missing single-task read endpoint and improving validation so the API behaves more consistently and predictably for clients. The assessment confirmed that the API is already a solid Level 2 REST design, while Level 3 HATEOAS is intentionally not implemented because the assignment explicitly excludes it.

## Why Most Production APIs Stop at Level 2

Most production APIs stop at Level 2 because it offers the best balance between simplicity, performance, and client integration. A Level 2 API is easy to understand, cheap to execute, and straightforward for frontend or mobile clients to consume without the overhead of hypermedia navigation. HATEOAS adds more complexity in both response design and client logic, which makes many real-world systems prefer the cleaner and more efficient Level 2 contract.
