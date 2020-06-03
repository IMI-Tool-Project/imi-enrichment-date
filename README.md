# imi-enrichment-date

入力となる JSON-LD に含まれる `表記 をもつ 日付型` に対して `標準型日付` を付与します。

**input.json**

```input.json
{
  "@type": "日付型",
  "表記": "令和元年5月1日"
}
```

**output.json**

```output.json
{
  "@type": "日付型",
  "表記": "令和元年5月1日",
  "標準型日付": "2019-05-01"
}
```

-   ルート直下の `日付型` に限らず、JSON-LD に含まれるすべての `日付型` に対して作用します
-   すでに `標準型日付` が付与されている `日付型` に対しては作用しません
-   `表記` をパースできなかった場合には `メタデータ` プロパティにメッセージが記述されます

**output_with_error.json**

```output_with_error.json
{
  "@type": "日付型",
  "表記": "X01-12-31",
  "メタデータ": {
    "@type": "文書型",
    "説明": "正規化できない日付表記です"
  }
}
```

# 利用者向け情報

以下の手順はパッケージアーカイブ `imi-enrichment-date-1.0.0.tgz` を用いて実行します。

## インストール

以下の手順でインストールします。

```
$ npm install imi-enrichment-date-1.0.0.tgz
```

## コマンドラインインターフェイス

`imi-enrichment-date-1.0.0.tgz` にはコマンドラインインターフェイスが同梱されており、
通常はインストールすると `imi-enrichment-date` コマンドが使用できるようになります。

コマンドラインインターフェイスのファイルの実体は `bin/cli.js` です。

```
$ npm install imi-enrichment-date-1.0.0.tgz

# ヘルプの表示
$ imi-enrichment-date -h

# JSON ファイルの変換
$ imi-enrichment-date input.json > output.json

# 標準入力からの変換
$ cat input.json | imi-enrichment-date > output.json

# 文字列からの変換
$ imi-enrichment-date -s R2-1-1 > output.json

```

または `npx` を使って以下のようにインストールせずに実行することも可能です。

```
$ npx imi-enrichment-date-1.0.0.tgz -s R2-1-1
```

## Web API

`imi-enrichment-date-1.0.0.tgz` には Web API を提供するサーバプログラムが同梱されています。

### サーバの起動方法

`bin/server.js` がサーバの実体です。
以下のように `bin/server.js` を実行することで起動できます。

```
$ npm install imi-enrichment-date-1.0.0.tgz
$ node node_modules/imi-enrichment-date/bin/server.js
Usage: node server.js [port number]

$ node node_modules/imi-enrichment-date/bin/server.js 8080
imi-enrichment-date-server is running on port 8080
```

なお、実行時にはポート番号の指定が必要です。指定しなかった場合にはエラーが表示されて終了します。
サーバを停止するには `Ctrl-C` を入力してください。

### 利用方法

WebAPI は POST された JSON または テキストを入力として JSON を返します。

```
$ curl -X POST -H 'Content-Type: application/json' -d '{"@type":"日付型","表記":"令和元年一月一日"}' localhost:8080
{
  "@type": "日付型",
  "表記": "令和元年一月一日",
  "標準型日付": "2019-01-01"
}
```

```
$ curl -X POST -H 'Content-Type: text/plain' -d 'R2-1-1' localhost:8080
{
  "@context": "https://imi.go.jp/ns/core/context.jsonld",
  "@type": "日付型",
  "表記": "R2-1-1",
  "標準型日付": "2020-01-01"
}
```

- WebAPI の URL に GET メソッドでアクセスした場合には HTML ページが表示され、WebAPI の動作を確認することができます
- POST,GET 以外のメソッドでアクセスした場合には `405 Method Not Allowed` エラーが返されます
- `Content-Type: application/json` ヘッダが設定されている場合は、POST Body を JSON として扱い、JSON に対しての変換結果を返します
- `Content-Type: application/json` ヘッダが設定されているが POST Body が JSON としてパースできない場合は `400 Bad Request` エラーが返されます
- `Content-Type: application/json` ヘッダが設定されていない場合は、POST Body を日付文字列として扱い、日付文字列を日付型に整形・正規化した結果を返します

## API (Node.js)

モジュール `imi-enrichment-date` は以下のような API の関数を提供します。

```
module.exports = function(input) {..}
```

- 入力 (input) : 変換対象となる JSON または日付文字列
- 出力 : 変換結果の JSON-LD オブジェクト ※ 変換は同期で行うため Promise でないことに注意

```
const convert = require('imi-enrichment-date');
console.log(convert("令和元年1月1日"));
```

# 開発者向け情報

以下の手順はソースコードアーカイブ `imi-enrichment-date-1.0.0.src.tgz` を用いて実行します。

## 環境構築

以下の手順で環境を構築します。

```
$ mkdir imi-enrichment-date
$ cd imi-enrichment-date
$ tar xvzf /tmp/imi-enrichment-date-1.0.0.src.tgz
$ npm install
```

## テスト

以下の手順でテストを実行します

```
$ cd imi-enrichment-date
$ npm test
```


## ブラウザビルド(参考情報)

以下の手順を実行するとブラウザで動作する Javascript `dist/imi-enrichment-date.js` が生成されます。

```
$ cd imi-enrichment-date
$ npm run browser
$ ls dist
imi-enrichment-date.js
```

以下のように HTML で読み込むと、グローバルスコープに `IMIEnrichmentDate` 関数が登録されます。

```
<script src="imi-enrichment-date.js"></script>
<script>
console.log(IMIEnrichmentDate("R1-1-1"));
</script>
```

この `IMIEnrichmentDate` に String あるいは JSON を渡すことで、変換結果を取得できます。
