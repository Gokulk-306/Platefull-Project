const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../server");

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(() => server.close());

test("health endpoint reports the application is ready", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("restaurant API filters results by category", async () => {
  const response = await fetch(`${baseUrl}/api/restaurants?category=Pizza`);
  const restaurants = await response.json();
  assert.equal(response.status, 200);
  assert.equal(restaurants.length, 1);
  assert.equal(restaurants[0].name, "Pizza Borough");
});
