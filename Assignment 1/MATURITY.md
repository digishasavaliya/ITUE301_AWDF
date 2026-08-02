# Richardson Maturity Model Evaluation

## Student Details

**Practical:** Richardson Maturity Model Evaluation

**API:** Task Management REST API

---

# Introduction

The Richardson Maturity Model is used to evaluate how RESTful an API is.

It consists of four maturity levels.

- Level 0 – Single endpoint
- Level 1 – Resource-based URLs
- Level 2 – HTTP methods and Status Codes
- Level 3 – HATEOAS

The Task Management API was evaluated against all four levels.

---

# Evaluation Table

| Level | Criterion | Does API satisfy? | Evidence |
|-------|-----------|------------------|----------|
| Level 0 | Single endpoint architecture | ❌ No | API uses multiple endpoints instead of one endpoint |
| Level 1 | Separate resources | ✅ Yes | `/tasks` and `/tasks/:id` are separate resources |
| Level 2 | Proper HTTP methods | ✅ Yes | GET, POST, PUT and DELETE methods are used |
| Level 2 | Proper HTTP status codes | ✅ Yes | 200 OK, 201 Created, 404 Not Found are returned |
| Level 3 | HATEOAS | ❌ No | Hypermedia links are not included in responses |

---

# Detailed Evaluation

## Level 0

Level 0 APIs expose only a single endpoint and all operations are performed through that endpoint.

Example

```
POST /api
```

The Task Management API does not use this architecture.

Different endpoints are available for different operations.

Result

**Not Satisfied**

---

## Level 1

Level 1 requires resource-based URLs.

The API provides the following resource endpoints.

```
GET /tasks

GET /tasks/:id

POST /tasks

PUT /tasks/:id

DELETE /tasks/:id
```

Each resource has its own URL.

Result

**Satisfied**

---

## Level 2

Level 2 requires proper HTTP methods and meaningful HTTP status codes.

### HTTP Methods Used

| Method | Endpoint | Purpose |
|---------|----------|----------|
| GET | /tasks | Retrieve all tasks |
| GET | /tasks/:id | Retrieve a single task |
| POST | /tasks | Create a task |
| PUT | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |

### Status Codes

| Status Code | Meaning |
|--------------|---------|
| 200 OK | Successful request |
| 201 Created | Task created successfully |
| 404 Not Found | Task not found |
| 204 No Content | Task deleted successfully (if implemented) |

The API correctly uses RESTful HTTP methods and meaningful status codes.

Result

**Satisfied**

---

## Level 3

Level 3 requires HATEOAS.

Currently the API responses do not contain hypermedia links.

Therefore Level 3 is not satisfied.

Result

**Not Satisfied**

---

# HATEOAS Awareness

If this API were upgraded to Level 3, each task response could include navigation links.

Example

```json
{
  "id": 1,
  "title": "Learn REST",
  "completed": false,
  "_links": {
    "self": {
      "href": "/tasks/1"
    },
    "update": {
      "href": "/tasks/1"
    },
    "delete": {
      "href": "/tasks/1"
    },
    "allTasks": {
      "href": "/tasks"
    }
  }
}
```

These links help API clients discover available actions dynamically.

---

# Improvements

The API already satisfies Level 2.

No major improvements were required.

The only enhancement needed to reach Level 3 would be implementing HATEOAS links in the response body.

---

# Why Most Production APIs Stop at Level 2

Most production REST APIs stop at Level 2 because using proper HTTP methods and status codes is sufficient for most applications.

Although HATEOAS provides dynamic navigation, it increases implementation complexity and is rarely required by frontend applications.

Therefore most modern REST APIs remain at Richardson Maturity Model Level 2.

---

# Reflection

During this practical the Task Management API was evaluated using the Richardson Maturity Model.

The API successfully satisfies Level 2 because it uses resource-based endpoints, correct HTTP methods and meaningful HTTP status codes.

Level 3 is not satisfied because HATEOAS links are not implemented.

This practical improved understanding of REST API design principles and how production APIs are evaluated.

---

# Conclusion

The Task Management API satisfies Richardson Maturity Model Level 2.

Future enhancement can include HATEOAS support to achieve Level 3 compliance.