const { filenameToLocalizedFilename, filenameToTypingsFilename } = require("../index");
const assert = require("assert");

describe("filename rules", () => {

    it("xxx.lang should give xxx.en.lang", () => {
      const filename = "xxx.lang";
      const enName = filenameToLocalizedFilename(filename, "en");
      assert.equal(enName, "xxx.en.lang");
    });

    it("xxx.lang should give typings xxx.lang.d.ts", () => {
      const filename = "xxx.lang";
      const enName = filenameToTypingsFilename(filename);
      assert.equal(enName, "xxx.lang.d.ts");
    });
});