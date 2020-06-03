const normalize = require("./lib/normalize");

const metadata = function(s, o) {
  if (s["メタデータ"] === undefined) s["メタデータ"] = o;
  else if (Array.isArray(s["メタデータ"])) s["メタデータ"].push(o);
  else s["メタデータ"] = [s["メタデータ"], o];
};

const dig = function(src) {
  if (Array.isArray(src)) return src.map(dig);
  if (typeof src !== 'object') return src;

  const dst = {};
  Object.keys(src).forEach(key => {
    dst[key] = dig(src[key]);
  });

  if (dst["@type"] === '日付型' && dst["表記"] !== undefined && dst["標準型日付"] === undefined) {
    let val = dst["表記"];
    if (Array.isArray(val) && val.length > 0) val = val[0];
    if (val["@value"] !== undefined) val = val["@value"];
    if (typeof val === 'number') val = val.toString();
    if (typeof val === 'string') {
      const normalized = normalize(val);
      if (normalized !== null) {
        dst["標準型日付"] = normalize(val);
      } else {
        metadata(dst, {
          "@type": "文書型",
          "説明": "正規化できない日付表記です"
        });
      }
    }
  }

  return dst;
};

module.exports = function(src, options) {
  if (typeof src === 'string') {
    return dig({
      "@context": "https://imi.go.jp/ns/core/context.jsonld",
      "@type": "日付型",
      "表記": src
    });
  }
  return dig(src);
};
