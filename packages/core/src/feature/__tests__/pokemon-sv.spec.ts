import {
  evaluatePokemon,
  findUncoveredThreats,
  recommendDefenseTypes,
  recommendOffenseTypes,
  summarizePartyDefense
} from "@hinagata-next/core/feature/pokemon-sv-analysis";
import { SV_POKEDEX } from "@hinagata-next/core/feature/pokemon-sv-dex";
import {
  POKE_TYPE_LIST,
  typeEffectiveness
} from "@hinagata-next/core/feature/pokemon-sv-types";

describe("typeEffectiveness", () => {
  it("単タイプへの相性を計算できる", () => {
    expect(typeEffectiveness("fire", ["grass"])).toBe(2);
    expect(typeEffectiveness("fire", ["water"])).toBe(0.5);
    expect(typeEffectiveness("fire", ["normal"])).toBe(1);
    expect(typeEffectiveness("ground", ["flying"])).toBe(0);
  });

  it("複合タイプは掛け算になる", () => {
    // でんき → みず/ひこう（ギャラドス）は4倍
    expect(typeEffectiveness("electric", ["water", "flying"])).toBe(4);
    // こおり → ドラゴン/ひこう（カイリュー）は4倍
    expect(typeEffectiveness("ice", ["dragon", "flying"])).toBe(4);
    // でんき → ドラゴン/じめん（ガブリアス）は無効
    expect(typeEffectiveness("electric", ["dragon", "ground"])).toBe(0);
    // ほのお → みず/いわは1/4
    expect(typeEffectiveness("fire", ["water", "rock"])).toBe(0.25);
  });
});

describe("recommendOffenseTypes", () => {
  it("選択タイプへ抜群を取れる攻撃タイプを挙げる", () => {
    const result = recommendOffenseTypes(["water"]);
    const attackTypes = result.map(r => r.attackType);
    expect(attackTypes).toContain("electric");
    expect(attackTypes).toContain("grass");
    expect(attackTypes).toHaveLength(2);
  });

  it("多くのタイプをカバーできる攻撃タイプが先頭に来る", () => {
    const result = recommendOffenseTypes(["dragon", "flying", "ice"]);
    // こおり技はドラゴン・ひこうの両方に抜群
    expect(result[0].attackType).toBe("ice");
    expect(result[0].coveredTypes).toEqual(
      expect.arrayContaining(["dragon", "flying"])
    );
  });
});

describe("recommendDefenseTypes", () => {
  it("はがねはドラゴン・フェアリーどちらも半減できる", () => {
    const result = recommendDefenseTypes(["dragon", "fairy"]);
    const steel = result.find(r => r.defenseType === "steel");
    expect(steel).toBeDefined();
    expect(steel?.resistedTypes).toEqual(
      expect.arrayContaining(["dragon", "fairy"])
    );
    expect(steel?.weakTypes).toHaveLength(0);
  });
});

describe("evaluatePokemon", () => {
  it("耐性と攻撃面の両方を評価する", () => {
    const nattorei = { name: "ナットレイ", types: ["grass", "steel"] } as const;
    const result = evaluatePokemon(
      { name: nattorei.name, types: [...nattorei.types], imageId: 598 },
      ["water", "fairy"]
    );
    // みず・フェアリーどちらも半減以下
    expect(result.resistedTypes).toEqual(
      expect.arrayContaining(["water", "fairy"])
    );
    // くさ技でみずに、はがね技でフェアリーに抜群
    expect(result.coveredTypes).toEqual(
      expect.arrayContaining(["water", "fairy"])
    );
    expect(result.totalScore).toBeGreaterThan(0);
  });
});

describe("summarizePartyDefense", () => {
  it("パーティの弱点・耐性を攻撃タイプごとに集計する", () => {
    const party = [
      { name: "ギャラドス", types: ["water", "flying"] as const, imageId: 130 },
      { name: "ガブリアス", types: ["dragon", "ground"] as const, imageId: 445 }
    ].map(p => ({ name: p.name, types: [...p.types], imageId: p.imageId }));
    const result = summarizePartyDefense(party);
    const electric = result.find(r => r.attackType === "electric");
    expect(electric?.weakMembers).toEqual(["ギャラドス"]);
    expect(electric?.resistMembers).toEqual(["ガブリアス"]);
    const ice = result.find(r => r.attackType === "ice");
    expect(ice?.weakMembers).toEqual(["ガブリアス"]);
    expect(result).toHaveLength(POKE_TYPE_LIST.length);
  });
});

describe("findUncoveredThreats", () => {
  it("攻守どちらでも対策できていないタイプを返す", () => {
    const party = [{ name: "ウインディ", types: ["fire" as const], imageId: 59 }];
    // みずには攻守とも対応できない / くさは半減かつ抜群を取れる
    expect(findUncoveredThreats(party, ["water", "grass"])).toEqual(["water"]);
  });
});

describe("SV_POKEDEX", () => {
  it("名前が重複していない", () => {
    const names = SV_POKEDEX.map(p => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("タイプは1〜2個", () => {
    SV_POKEDEX.forEach(p => {
      expect(p.types.length).toBeGreaterThanOrEqual(1);
      expect(p.types.length).toBeLessThanOrEqual(2);
    });
  });

  it("画像IDが重複していない", () => {
    const ids = SV_POKEDEX.map(p => p.imageId);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach(id => expect(id).toBeGreaterThan(0));
  });
});
