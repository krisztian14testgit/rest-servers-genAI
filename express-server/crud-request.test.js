"use strict";

const request = require("supertest");
const express = require("express");
const nodeServer = require("./crud-request-server.js");

//npm install --save-dev jest supertest

describe("Elements API", () => {
  let server;
  let initialElement = { id: 1, name: "Element 1", description: "First element" };
  let newElement = { name: "New Element", description: "New description" };

  beforeAll(() => {
    server = nodeServer.listen(4000); // Start test server
  });

  afterAll((done) => {
    server.close(done); // Stop test server
  });

  // ✅ Test: Get all elements
  it("should fetch all elements", async () => {
    const res = await request(server).get("/elements");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // ✅ Test: Get a specific element by ID (valid)
  it("should fetch an element by ID", async () => {
    const res = await request(server).get(`/element/${initialElement.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Element 1");
  });

  // ❌ Test: Get a non-existing element by ID
  it("should return 404 for non-existing element", async () => {
    const res = await request(server).get("/element/999");
    expect(res.status).toBe(404);
  });

  // ✅ Test: Create a new element
  it("should create a new element", async () => {
    const res = await request(server).post("/elements").send(newElement);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("New Element");
  });

  // ❌ Test: Create an element without a name
  it("should return 400 when creating an element without name", async () => {
    const res = await request(server).post("/elements").send({ description: "Missing name" });
    expect(res.status).toBe(400);
	expect(res.text).toBe("Creating request: name prop is missing!");
  });

  // ✅ Test: Fully update an element (PUT)
  it("should update an existing element", async () => {
    const res = await request(server).put("/element/1").send({ name: "Updated Name", description: "Updated description" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated Name");
  });

  // ❌ Test: Update a non-existing element
  it("should return 404 for updating a non-existing element", async () => {
    const res = await request(server).put("/element/999").send({ name: "Won't Exist" });
    expect(res.status).toBe(404);
  });

  // ✅ Test: Partially update an element (PATCH)
  it("should partially update an element", async () => {
    const res = await request(server).patch("/element/1").send({ name: "Partially Updated" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Partially Updated");
  });

  // ❌ Test: Partially update a non-existing element
  it("should return 404 for partially updating a non-existing element", async () => {
    const res = await request(server).patch("/element/999").send({ name: "Ghost Element" });
    expect(res.status).toBe(404);
  });

  // ✅ Test: Delete an element
  it("should delete an existing element", async () => {
    const res = await request(server).delete("/element/1");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Element deleted successfully");
  });

  // ❌ Test: Delete a non-existing element
  it("should return 404 for deleting a non-existing element", async () => {
    const res = await request(server).delete("/element/999");
    expect(res.status).toBe(404);
  });
});
