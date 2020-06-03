const enrich = require("../main");
const expect = require('chai').expect;
const fs = require("fs");
const spec = __dirname + "/../spec";

describe('imi-enrichment-date', function() {

  describe("spec", function() {
    fs.readdirSync(spec).filter(file => file.match(/json$/)).forEach(file => {
      describe(file, function() {
        const json = JSON.parse(fs.readFileSync(`${spec}/${file}`, "UTF-8"))
        json.forEach(a => {
          it(a.name, function() {
            expect(enrich(a.input)).deep.equal(a.output);
          });
        });
      });
    });
  });
});


/*const enrich = require("../main");
const expect = require('chai').expect;
const data = require('./data.json');

describe('imi-enrichment-date', () => {

  describe('data.json', () => {
    Object.keys(data).forEach(key => {
      it(key, () => {
        expect(enrich({
          "@context": "https://imi.go.jp/ns/core/context.jsonld",
          "@type": "日付型",
          "表記": key
        })).deep.equal({
          "@context": "https://imi.go.jp/ns/core/context.jsonld",
          "@type": "日付型",
          "表記": key,
          "標準型日付": data[key]
        });
      });
    });
  });


  describe('placement', () => {

    it('ルート直下の日付型が正規化されること', () => {
      expect(enrich({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": "2019年12月31日"
      })).deep.equal({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": "2019年12月31日",
        "標準型日付": "2019-12-31"
      });
    });

    it('子要素の日付型が正規化されること', () => {
      expect(enrich({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "文書型",
        "日付": {
          "@type": "日付型",
          "表記": "2019年12月31日"
        }
      })).deep.equal({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "文書型",
        "日付": {
          "@type": "日付型",
          "表記": "2019年12月31日",
          "標準型日付": "2019-12-31"
        }
      });
    });


    it('グラフ直下の日付型がすべて正規化されること', () => {
      expect(enrich({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@graph": [{
          "@type": "日付型",
          "表記": "2019年12月31日"
        }, {
          "@type": "日付型",
          "表記": "2020年1月1日"
        }]
      })).deep.equal({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@graph": [{
          "@type": "日付型",
          "表記": "2019年12月31日",
          "標準型日付": "2019-12-31"
        }, {
          "@type": "日付型",
          "表記": "2020年1月1日",
          "標準型日付": "2020-01-01"
        }]
      });
    });

    it('グラフ配下の子要素の日付型がすべて正規化されること', () => {
      expect(enrich({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@graph": [{
          "@type": "文書型",
          "日付": {
            "@type": "日付型",
            "表記": "2019年12月31日"
          }
        }, {
          "@type": "文書型",
          "日付": {
            "@type": "日付型",
            "表記": "2020年1月1日"
          }
        }]
      })).deep.equal({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@graph": [{
          "@type": "文書型",
          "日付": {
            "@type": "日付型",
            "表記": "2019年12月31日",
            "標準型日付": "2019-12-31"
          }
        }, {
          "@type": "文書型",
          "日付": {
            "@type": "日付型",
            "表記": "2020年1月1日",
            "標準型日付": "2020-01-01"
          }
        }]
      });
    });
  });

  describe('value', () => {
    it('string', () => {
      expect(enrich({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": "2019年12月31日"
      })).deep.equal({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": "2019年12月31日",
        "標準型日付": "2019-12-31"
      });
    });

    it('number', () => {
      expect(enrich({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": 20191231
      })).deep.equal({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": 20191231,
        "標準型日付": "2019-12-31"
      });
    });

    it('object', () => {
      expect(enrich({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": {
          "@value": "20191231"
        }
      })).deep.equal({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": {
          "@value": "20191231"
        },
        "標準型日付": "2019-12-31"
      });
    });

    it('array of string', () => {
      expect(enrich({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": ["20191231"]
      })).deep.equal({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": ["20191231"],
        "標準型日付": "2019-12-31"
      });
    });

    it('array of number', () => {
      expect(enrich({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": [20191231]
      })).deep.equal({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": [20191231],
        "標準型日付": "2019-12-31"
      });
    });

    it('array of object', () => {
      expect(enrich({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": [{
          "@value": "20191231"
        }]
      })).deep.equal({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": [{
          "@value": "20191231"
        }],
        "標準型日付": "2019-12-31"
      });
    });

    it('empty array', () => {
      expect(enrich({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": []
      })).deep.equal({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "日付型",
        "表記": []
      });
    });


  });
});
*/
