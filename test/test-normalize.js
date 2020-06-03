const normalize = require("../lib/normalize");
const expect = require('chai').expect;
const fs = require("fs");
const spec = __dirname + "/../spec";

describe('imi-enrichment-date#normalize', function() {
  describe('spec', () => {
    const json = JSON.parse(fs.readFileSync(`${spec}/002-normalize.json`, "UTF-8"));
    json.forEach(a => {
      it(a.name, function() {
        expect(normalize(a.input["表記"])).to.equal(a.output["標準型日付"] || null);
      });
    });
  });
});
