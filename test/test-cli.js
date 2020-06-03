const expect = require('chai').expect;
const spawn = require('child_process').spawn;
const fs = require("fs");
const spec = __dirname + "/../spec";

function cli(options, stdin) {
  let res = "";
  const cmd = ["bin/cli.js"].concat(options || []);
  return new Promise(resolve => {
    const child = spawn("node", cmd);
    child.stdout.setEncoding('utf-8');
    child.stdout.on('data', (data) => {
      res += data;
    });
    child.on('close', (code) => {
      resolve(res);
    });
    if (stdin) {
      child.stdin.setEncoding('utf-8');
      child.stdin.write(stdin);
      child.stdin.end();
    }
  });
}

const input = {
  "@type": "日付型",
  "表記": "令和二年1月３１日"
};
const expected = {
  "@type": "日付型",
  "表記": "令和二年1月３１日",
  "標準型日付": "2020-01-31"
};

describe('imi-enrichment-date#cli', () => {

  const tempfile = `tmp.${(new Date()).getTime()}.json`;

  before((done) => {
    fs.writeFileSync(tempfile, JSON.stringify(input), "UTF-8");
    done();
  });

  after(() => {
    fs.unlinkSync(tempfile);
  });

  describe('options', () => {

    it("-h", (done) => {
      cli(["-h"]).then(res => {
        try {
          expect(res).to.have.string("imi-enrichment-date");
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it("--help", (done) => {
      cli(["--help"]).then(res => {
        try {
          expect(res).to.have.string("imi-enrichment-date");
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it("-s", (done) => {
      cli(["-s", "R2-1-1"]).then(res => {
        try {
          expect(JSON.parse(res)).deep.equal({
            "@context": "https://imi.go.jp/ns/core/context.jsonld",
            "@type": "日付型",
            "表記": "R2-1-1",
            "標準型日付": "2020-01-01"
          });
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it("--string", (done) => {
      cli(["--string", "R2-1-1"]).then(res => {
        try {
          expect(JSON.parse(res)).deep.equal({
            "@context": "https://imi.go.jp/ns/core/context.jsonld",
            "@type": "日付型",
            "表記": "R2-1-1",
            "標準型日付": "2020-01-01"
          });
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it("-f", (done) => {
      cli(["-f", tempfile]).then(res => {
        try {
          expect(JSON.parse(res)).deep.equal(expected);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it("--file", (done) => {
      cli(["--file", tempfile]).then(res => {
        try {
          expect(JSON.parse(res)).deep.equal(expected);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it("filename only", (done) => {
      cli([tempfile]).then(res => {
        try {
          expect(JSON.parse(res)).deep.equal(expected);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it("stdin", (done) => {
      cli(null, JSON.stringify(input)).then(res => {
        try {
          expect(JSON.parse(res)).deep.equal(expected);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe("spec", function() {
    fs.readdirSync(spec).filter(file => file.match(/json$/)).forEach(file => {
      describe(file, function() {
        const json = JSON.parse(fs.readFileSync(`${spec}/${file}`, "UTF-8"));
        json.forEach(a => {
          it(a.name, done => {
            const promise = typeof a.input === 'string' ? cli(["-s", a.input]) : cli(null, JSON.stringify(a.input));
            promise.then(res => {
              try {
                expect(JSON.parse(res)).deep.equal(a.output);
                done();
              } catch (e) {
                done(e);
              }
            });
          });
        });
      });
    });
  });

});
