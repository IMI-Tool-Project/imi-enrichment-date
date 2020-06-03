const replacement = {
  "元": "1",
  "〇": "0",
  "一": "1",
  "二": "2",
  "三": "3",
  "四": "4",
  "五": "5",
  "六": "6",
  "七": "7",
  "八": "8",
  "九": "9",
  "十": "10",
  "十一": "11",
  "十二": "12",
  "十三": "13",
  "十四": "14",
  "十五": "15",
  "十六": "16",
  "十七": "17",
  "十八": "18",
  "十九": "19",
  "二十": "20",
  "二十一": "21",
  "二十二": "22",
  "二十三": "23",
  "二十四": "24",
  "二十五": "25",
  "二十六": "26",
  "二十七": "27",
  "二十八": "28",
  "二十九": "29",
  "三十": "30",
  "三十一": "31",
  "三十二": "32",
  "三十三": "33",
  "三十四": "34",
  "三十五": "35",
  "三十六": "36",
  "三十七": "37",
  "三十八": "38",
  "三十九": "39",
  "四十": "40",
  "四十一": "41",
  "四十二": "42",
  "四十三": "43",
  "四十四": "44",
  "四十五": "45",
  "四十六": "46",
  "四十七": "47",
  "四十八": "48",
  "四十九": "49",
  "五十": "50",
  "五十一": "51",
  "五十二": "52",
  "五十三": "53",
  "五十四": "54",
  "五十五": "55",
  "五十六": "56",
  "五十七": "57",
  "五十八": "58",
  "五十九": "59",
  "六十": "60",
  "六十一": "61",
  "六十二": "62",
  "六十三": "63",
  "六十四": "64",
  "六十五": "65",
  "六十六": "66",
  "六十七": "67",
  "六十八": "68",
  "六十九": "69",
  "七十": "70",
  "七十一": "71",
  "七十二": "72",
  "七十三": "73",
  "七十四": "74",
  "七十五": "75",
  "七十六": "76",
  "七十七": "77",
  "七十八": "78",
  "七十九": "79",
  "八十": "80",
  "八十一": "81",
  "八十二": "82",
  "八十三": "83",
  "八十四": "84",
  "八十五": "85",
  "八十六": "86",
  "八十七": "87",
  "八十八": "88",
  "八十九": "89",
  "九十": "90",
  "九十一": "91",
  "九十二": "92",
  "九十三": "93",
  "九十四": "94",
  "九十五": "95",
  "九十六": "96",
  "九十七": "97",
  "九十八": "98",
  "九十九": "99",
  "０": "0",
  "１": "1",
  "２": "2",
  "３": "3",
  "４": "4",
  "５": "5",
  "６": "6",
  "７": "7",
  "８": "8",
  "９": "9"
};

const pattern = new RegExp(Object.keys(replacement).sort((a, b) => b.length - a.length).join("|"), "g");

const format = function(date) {
  return [
    date.getFullYear().toString(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0')
  ].join("-");
};

const parse = function(src) {

  src = src.trim().replace(pattern, s => replacement[s]);

  if (src.match(/^(\d{4})(\d{2})(\d{2})$/))
    return new Date(parseInt(RegExp.$1), parseInt(RegExp.$2) - 1, parseInt(RegExp.$3));

  if (src.match(/^(\d+)\D+(\d+)\D+(\d+)\D*$/))
    return new Date(parseInt(RegExp.$1), parseInt(RegExp.$2) - 1, parseInt(RegExp.$3));

  if (src.match(/^(令和|[令RrＲｒ㋿\uF9A8])(\d+)\D+(\d+)\D+(\d+)\D*$/))
    return new Date(2018 + parseInt(RegExp.$2), parseInt(RegExp.$3) - 1, parseInt(RegExp.$4));

  if (src.match(/^(平成|[平HhＨｈ㍻])(\d+)\D+(\d+)\D+(\d+)\D*$/))
    return new Date(1988 + parseInt(RegExp.$2), parseInt(RegExp.$3) - 1, parseInt(RegExp.$4));

  if (src.match(/^(昭和|[昭SsＳｓ㍼])(\d+)\D+(\d+)\D+(\d+)\D*$/))
    return new Date(1925 + parseInt(RegExp.$2), parseInt(RegExp.$3) - 1, parseInt(RegExp.$4));

  if (src.match(/^(大正|[大TtＴｔ㍽])(\d+)\D+(\d+)\D+(\d+)\D*$/))
    return new Date(1911 + parseInt(RegExp.$2), parseInt(RegExp.$3) - 1, parseInt(RegExp.$4));

  if (src.match(/^(明治|[明MmＭｍ㍾])(\d+)\D+(\d+)\D+(\d+)\D*$/))
    return new Date(1867 + parseInt(RegExp.$2), parseInt(RegExp.$3) - 1, parseInt(RegExp.$4));

  return null;
};

module.exports = function(src) {
  const date = parse(src);
  return date ? format(date) : null;
};
