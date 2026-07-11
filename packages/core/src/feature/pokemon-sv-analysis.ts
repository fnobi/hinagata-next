import { type SvPokemon } from "@hinagata-next/core/feature/pokemon-sv-dex";
import {
  POKE_TYPE_LIST,
  typeEffectiveness,
  type PokeType
} from "@hinagata-next/core/feature/pokemon-sv-types";

export type OffenseRecommendation = {
  attackType: PokeType;
  // 選択した相手タイプのうち、この攻撃タイプで抜群を取れるもの
  coveredTypes: PokeType[];
};

export const recommendOffenseTypes = (
  threatTypes: PokeType[]
): OffenseRecommendation[] =>
  POKE_TYPE_LIST.map(attackType => ({
    attackType,
    coveredTypes: threatTypes.filter(
      t => typeEffectiveness(attackType, [t]) > 1
    )
  }))
    .filter(r => r.coveredTypes.length > 0)
    .sort((a, b) => b.coveredTypes.length - a.coveredTypes.length);

export type DefenseRecommendation = {
  defenseType: PokeType;
  // 選択した相手タイプの攻撃を半減以下で受けられるもの
  resistedTypes: PokeType[];
  // 逆に弱点を突かれてしまうもの
  weakTypes: PokeType[];
};

export const recommendDefenseTypes = (
  threatTypes: PokeType[]
): DefenseRecommendation[] =>
  POKE_TYPE_LIST.map(defenseType => ({
    defenseType,
    resistedTypes: threatTypes.filter(
      t => typeEffectiveness(t, [defenseType]) < 1
    ),
    weakTypes: threatTypes.filter(t => typeEffectiveness(t, [defenseType]) > 1)
  }))
    .filter(r => r.resistedTypes.length > 0)
    .sort(
      (a, b) =>
        b.resistedTypes.length -
        b.weakTypes.length -
        (a.resistedTypes.length - a.weakTypes.length)
    );

const defensePoint = (eff: number) => {
  if (eff === 0) {
    return 2;
  }
  if (eff <= 0.25) {
    return 1.5;
  }
  if (eff < 1) {
    return 1;
  }
  if (eff === 1) {
    return 0;
  }
  if (eff <= 2) {
    return -1;
  }
  return -2;
};

export type PokemonEvaluation = {
  pokemon: SvPokemon;
  // 相手の攻撃タイプを半減以下で受けられるもの
  resistedTypes: PokeType[];
  // 弱点を突かれてしまうもの
  weakTypes: PokeType[];
  // タイプ一致技で抜群を取れる相手タイプ
  coveredTypes: PokeType[];
  totalScore: number;
};

export const evaluatePokemon = (
  pokemon: SvPokemon,
  threatTypes: PokeType[]
): PokemonEvaluation => {
  const resistedTypes = threatTypes.filter(
    t => typeEffectiveness(t, pokemon.types) < 1
  );
  const weakTypes = threatTypes.filter(
    t => typeEffectiveness(t, pokemon.types) > 1
  );
  const coveredTypes = threatTypes.filter(t =>
    pokemon.types.some(own => typeEffectiveness(own, [t]) > 1)
  );
  const defenseScore = threatTypes.reduce(
    (acc, t) => acc + defensePoint(typeEffectiveness(t, pokemon.types)),
    0
  );
  return {
    pokemon,
    resistedTypes,
    weakTypes,
    coveredTypes,
    totalScore: defenseScore + coveredTypes.length
  };
};

export const rankPokemonCandidates = (
  pokedex: SvPokemon[],
  threatTypes: PokeType[]
): PokemonEvaluation[] =>
  pokedex
    .map(p => evaluatePokemon(p, threatTypes))
    .sort((a, b) => b.totalScore - a.totalScore);

export type PartyTypeSummary = {
  attackType: PokeType;
  // このタイプの攻撃が弱点になるメンバー
  weakMembers: string[];
  // このタイプの攻撃を半減以下で受けられるメンバー
  resistMembers: string[];
};

// パーティ全体で、各攻撃タイプに対する耐性の分布をまとめる
export const summarizePartyDefense = (
  party: SvPokemon[]
): PartyTypeSummary[] =>
  POKE_TYPE_LIST.map(attackType => ({
    attackType,
    weakMembers: party
      .filter(p => typeEffectiveness(attackType, p.types) > 1)
      .map(p => p.name),
    resistMembers: party
      .filter(p => typeEffectiveness(attackType, p.types) < 1)
      .map(p => p.name)
  }));

// 選択した相手タイプのうち、パーティの誰も対策できていないものを洗い出す
export const findUncoveredThreats = (
  party: SvPokemon[],
  threatTypes: PokeType[]
) =>
  threatTypes.filter(
    t =>
      !party.some(p =>
        p.types.some(own => typeEffectiveness(own, [t]) > 1)
      ) && !party.some(p => typeEffectiveness(t, p.types) < 1)
  );
