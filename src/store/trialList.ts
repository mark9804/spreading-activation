import { type Word, Condition } from "@/types/Experiment";

export const SRList: Word[] = [
  {
    prime: "キモチ",
    target: "キブン",
  },
  {
    prime: "ウゴキ",
    target: "イドウ",
  },
  {
    prime: "アイテ",
    target: "ドウシ",
  },
  {
    prime: "ナマエ",
    target: "シメイ",
  },
  {
    prime: "ジケン",
    target: "ジレイ",
  },
  {
    prime: "カゾク",
    target: "カテイ",
  },
  {
    prime: "イケン",
    target: "シテキ",
  },
  {
    prime: "キオク",
    target: "アンキ",
  },
  {
    prime: "リユウ",
    target: "リクツ",
  },
  {
    prime: "バショ",
    target: "カショ",
  },
  {
    prime: "ヘンカ",
    target: "カワリ",
  },
  {
    prime: "マワリ",
    target: "アタリ",
  },
  {
    prime: "ヨウス",
    target: "グアイ",
  },
  {
    prime: "ジダイ",
    target: "コダイ",
  },
  {
    prime: "サイゴ",
    target: "オワリ",
  },
  {
    prime: "オカネ",
    target: "カヘイ",
  },
  {
    prime: "デンワ",
    target: "ツウワ",
  },
  {
    prime: "コトバ",
    target: "ゲンゴ",
  },
  {
    prime: "ジカン",
    target: "トケイ",
  },
  {
    prime: "セイビ",
    target: "カクホ",
  },
  {
    prime: "テイド",
    target: "ドアイ",
  },
  {
    prime: "レキシ",
    target: "ユライ",
  },
  {
    prime: "チイキ",
    target: "チホウ",
  },
  {
    prime: "シゴト",
    target: "コヨウ",
  },
  {
    prime: "ツモリ",
    target: "ヨサン",
  },
  {
    prime: "ブブン",
    target: "イチブ",
  },
  {
    prime: "ジブン",
    target: "ジシン",
  },
  {
    prime: "ケッカ",
    target: "セイカ",
  },
  {
    prime: "コウカ",
    target: "サヨウ",
  },
  {
    prime: "オオク",
    target: "タスウ",
  },
].map(word => ({
  ...word,
  condition: Condition.SR,
}));

export const NOList: Word[] = [
  {
    prime: "ライウ",
    target: "キアベ",
  },
  {
    prime: "エンソ",
    target: "メシキ",
  },
  {
    prime: "カイキ",
    target: "ヒカバ",
  },
  {
    prime: "カラシ",
    target: "トエウ",
  },
  {
    prime: "クチエ",
    target: "フヘウ",
  },
  {
    prime: "ケイシ",
    target: "ブアリ",
  },
  {
    prime: "コウジ",
    target: "シイキ",
  },
  {
    prime: "コウヤ",
    target: "ウジロ",
  },
  {
    prime: "サコツ",
    target: "ゾウガ",
  },
  {
    prime: "ジュズ",
    target: "キイゴ",
  },
  {
    prime: "スミビ",
    target: "マンケ",
  },
  {
    prime: "トウキ",
    target: "コッガ",
  },
  {
    prime: "ブツダ",
    target: "ギイコ",
  },
  {
    prime: "ホウト",
    target: "クカン",
  },
  {
    prime: "ホウビ",
    target: "ケタメ",
  },
  {
    prime: "ホシュ",
    target: "ゴワミ",
  },
  {
    prime: "アミド",
    target: "ハサコ",
  },
  {
    prime: "オウケ",
    target: "バシア",
  },
  {
    prime: "ジッチ",
    target: "フスキ",
  },
  {
    prime: "ジンギ",
    target: "ボコセ",
  },
  {
    prime: "ダイリ",
    target: "アトソ",
  },
  {
    prime: "ニハツ",
    target: "イセラ",
  },
  {
    prime: "ヒイキ",
    target: "イリサ",
  },
  {
    prime: "ブンケ",
    target: "ルゲリ",
  },
  {
    prime: "ミギメ",
    target: "シサレ",
  },
  {
    prime: "コウチ",
    target: "セロヒ",
  },
  {
    prime: "サンピ",
    target: "ツバギ",
  },
  {
    prime: "ショキ",
    target: "ハソギ",
  },
  {
    prime: "ジッシ",
    target: "ヘビサ",
  },
  {
    prime: "スイマ",
    target: "ワべク",
  },
  {
    prime: "ベイソ",
    target: "マシア",
  },
  {
    prime: "カジュ",
    target: "イサジ",
  },
  {
    prime: "キカン",
    target: "キウレ",
  },
  {
    prime: "コナシ",
    target: "シブエ",
  },
  {
    prime: "ゾウサ",
    target: "サウフ",
  },
  {
    prime: "テジナ",
    target: "ナシビ",
  },
  {
    prime: "ドカタ",
    target: "カラセ",
  },
  {
    prime: "フニン",
    target: "ソイク",
  },
  {
    prime: "ブヨウ",
    target: "ソマイ",
  },
  {
    prime: "アリカ",
    target: "ヘイミ",
  },
  {
    prime: "ゴカク",
    target: "ムタテ",
  },
  {
    prime: "シタミ",
    target: "リメカ",
  },
  {
    prime: "シロキ",
    target: "レッモ",
  },
  {
    prime: "ジレイ",
    target: "フンサ",
  },
  {
    prime: "ドンカ",
    target: "ロハイ",
  },
  {
    prime: "ナナイ",
    target: "イツヒ",
  },
  {
    prime: "フンド",
    target: "カヤフ",
  },
  {
    prime: "ブカイ",
    target: "ヘクゴ",
  },
  {
    prime: "ホブネ",
    target: "ナホダ",
  },
  {
    prime: "イシン",
    target: "ヌヤジ",
  },
  {
    prime: "イチザ",
    target: "ボサユ",
  },
  {
    prime: "ウモウ",
    target: "ヌヨウ",
  },
  {
    prime: "キカン",
    target: "シネツ",
  },
  {
    prime: "シルケ",
    target: "ハサノ",
  },
  {
    prime: "ジライ",
    target: "ホバク",
  },
  {
    prime: "ゾウシ",
    target: "カブプ",
  },
  {
    prime: "チカバ",
    target: "クブボ",
  },
  {
    prime: "フウウ",
    target: "シコべ",
  },
  {
    prime: "ライウ",
    target: "スアボ",
  },
  {
    prime: "エンソ",
    target: "パウチ",
  },
].map(word => ({
  ...word,
  condition: Condition.NO,
}));

export const URList: Word[] = [
  {
    prime: "ナカマ",
    target: "アッカ",
  },
  {
    prime: "スウジ",
    target: "キセツ",
  },
  {
    prime: "キカン",
    target: "アツサ",
  },
  {
    prime: "クウキ",
    target: "セキユ",
  },
  {
    prime: "ブンカ",
    target: "ソクザ",
  },
  {
    prime: "ヒヨウ",
    target: "ケイコ",
  },
  {
    prime: "ギモン",
    target: "カセン",
  },
  {
    prime: "ブンヤ",
    target: "ユビワ",
  },
  {
    prime: "フアン",
    target: "デンパ",
  },
  {
    prime: "ヒガイ",
    target: "ダイズ",
  },
  {
    prime: "ニチジ",
    target: "シッポ",
  },
  {
    prime: "ハンイ",
    target: "カケイ",
  },
  {
    prime: "ガゾウ",
    target: "シタギ",
  },
  {
    prime: "シセツ",
    target: "オナカ",
  },
  {
    prime: "イタミ",
    target: "ウワギ",
  },
  {
    prime: "ワダイ",
    target: "イノリ",
  },
  {
    prime: "ニンキ",
    target: "デグチ",
  },
  {
    prime: "タカサ",
    target: "ホドウ",
  },
  {
    prime: "ジコウ",
    target: "ノゾミ",
  },
  {
    prime: "リエキ",
    target: "ジゲン",
  },
  {
    prime: "オミセ",
    target: "アイズ",
  },
  {
    prime: "トナリ",
    target: "ホンキ",
  },
  {
    prime: "キホン",
    target: "ズツウ",
  },
  {
    prime: "ソシキ",
    target: "キゲン",
  },
  {
    prime: "ゴハン",
    target: "セイジ",
  },
  {
    prime: "チホウ",
    target: "イチジ",
  },
  {
    prime: "ヤサイ",
    target: "シマツ",
  },
  {
    prime: "ジユウ",
    target: "ザッシ",
  },
  {
    prime: "キテイ",
    target: "メイキ",
  },
  {
    prime: "コドモ",
    target: "ヨウジ",
  },
].map(word => ({
  ...word,
  condition: Condition.UR,
}));
