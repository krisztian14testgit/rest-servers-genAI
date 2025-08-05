# CRUD method vs REST API

link: https://www.logicmonitor.com/blog/rest-vs-crud


**REST (Representational State Transfer)**
* A software architectural style that provides standards for computers on the web
* Focuses on how clients and servers interact and communicate
* Key principles: independent client-server interaction, stateless communication, caching, uniform interface, and layered architecture

**CRUD (Create, Read, Update, Delete)**
* An acronym for database operations
* Focuses on managing data
* Can be used within a REST environment, but they are not the same

**Similarities between CRUD and REST:**

* Both are used for data management and manipulation
* Both have similar commands (e.g., Create, Read, Update, Delete)
* Both can be used together in a REST-CRUD combination

**Differences between CRUD and REST:**

* **Purpose**: CRUD is a function for database operations, while REST is a standard for API architecture
* **Scope**: CRUD is a limited scope for data management, while REST is a broader scope for web services communication
* **Implementation**: CRUD is typically implemented using SQL or other database languages, while REST is implemented using HTTP methods (e.g., GET, POST, PUT, DELETE)

**When to use REST and CRUD:**

* **REST**:
  * Public APIs (e.g., social media, streaming services, online banking)
  * Interoperable systems (e.g., microservices, IoT applications)
  * Stateless servers
* **CRUD**:
  * Basic data-management applications (e.g., CMS editors, interactive calendars, event management applications)
  * Direct data manipulation (e.g., admin dashboards, inventory management systems)
  * Simple database operations
