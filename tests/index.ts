const assert = require("assert");
const add = require("../jalaali/jalaali-date-time");

describe("Demo", () => {
  it("should add correctly", () => assert.equal(add(1, 1), 2));
});