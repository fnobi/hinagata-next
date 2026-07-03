"use client";

import styled from "@emotion/styled";
import { Fragment, useMemo, useState } from "react";
import { alphaColor, em, px } from "~/common/css-util";
import {
  findUncoveredThreats,
  rankPokemonCandidates,
  recommendDefenseTypes,
  recommendOffenseTypes,
  summarizePartyDefense
} from "@hinagata-next/core/feature/pokemon-sv-analysis";
import {
  SV_POKEDEX,
  type SvPokemon
} from "@hinagata-next/core/feature/pokemon-sv-dex";
import {
  POKE_TYPE_LABEL,
  POKE_TYPE_LIST,
  type PokeType
} from "@hinagata-next/core/feature/pokemon-sv-types";
import MockActionButton from "~/component/MockActionButton";
import MockStaticLayout from "~/component/MockStaticLayout";

const MAX_PARTY_SIZE = 6;
const DEFAULT_CANDIDATE_COUNT = 10;

const TYPE_COLOR: Record<PokeType, `#${string}`> = {
  normal: "#9fa19f",
  fire: "#e62829",
  water: "#2980ef",
  electric: "#f5a500",
  grass: "#3fa129",
  ice: "#3dcef3",
  fighting: "#ff8000",
  poison: "#9141cb",
  ground: "#915121",
  flying: "#81b9ef",
  psychic: "#ef4179",
  bug: "#91a119",
  rock: "#afa981",
  ghost: "#704170",
  dragon: "#5060e1",
  dark: "#624d4e",
  steel: "#60a1b8",
  fairy: "#ef70ef"
};

const Section = styled.section({
  border: `solid ${px(1)} #ccc`,
  borderRadius: px(8),
  padding: em(1),
  display: "grid",
  gap: em(0.8)
});

const SectionTitle = styled.h2({
  fontSize: em(1.1),
  fontWeight: "bold"
});

const SectionNote = styled.p({
  fontSize: em(0.85),
  opacity: 0.7
});

const TypeBadge = styled.span<{ pokeType: PokeType }>(({ pokeType }) => ({
  display: "inline-block",
  backgroundColor: TYPE_COLOR[pokeType],
  color: "#fff",
  borderRadius: px(4),
  padding: `${px(2)} ${px(8)}`,
  fontSize: em(0.8),
  lineHeight: 1.5,
  whiteSpace: "nowrap"
}));

const BadgeFlow = styled.span({
  display: "inline-flex",
  flexWrap: "wrap",
  gap: px(4),
  verticalAlign: "middle"
});

const CheckboxGrid = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: `${px(6)} ${px(12)}`
});

const CheckboxLabel = styled.label({
  display: "inline-flex",
  alignItems: "center",
  gap: px(4),
  cursor: "pointer"
});

const ListRow = styled.div({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: px(8),
  padding: `${px(6)} 0`,
  borderBottom: `solid ${px(1)} #eee`
});

const RowMain = styled.div({
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: px(8)
});

const PokemonName = styled.span({
  fontWeight: "bold"
});

const DetailText = styled.span({
  fontSize: em(0.8),
  opacity: 0.8,
  display: "inline-flex",
  alignItems: "center",
  gap: px(4),
  flexWrap: "wrap"
});

const DefenseSummaryGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: `${px(4)} ${px(10)}`,
  alignItems: "center"
});

const SummaryCell = styled.div<{ danger?: boolean }>(({ danger }) => ({
  fontSize: em(0.85),
  padding: `${px(2)} ${px(6)}`,
  borderRadius: px(4),
  backgroundColor: danger ? alphaColor("#e62829", 0.15) : undefined
}));

const WarningText = styled.p({
  color: "#c62828",
  fontWeight: "bold",
  fontSize: em(0.9)
});

const EmptyText = styled.p({
  opacity: 0.6,
  fontSize: em(0.9)
});

const SearchInput = styled.input({
  fontSize: "inherit",
  padding: `${px(4)} ${px(8)}`,
  border: `solid ${px(1)} #ccc`,
  borderRadius: px(4),
  width: em(14)
});

const TypeBadgeList = ({ types }: { types: PokeType[] }) => (
  <BadgeFlow>
    {types.map(t => (
      <TypeBadge key={t} pokeType={t}>
        {POKE_TYPE_LABEL[t]}
      </TypeBadge>
    ))}
  </BadgeFlow>
);

const PartyBuilderScene = () => {
  const [threats, setThreats] = useState<PokeType[]>([]);
  const [party, setParty] = useState<SvPokemon[]>([]);
  const [showAllCandidates, setShowAllCandidates] = useState(false);
  const [searchText, setSearchText] = useState("");

  const isPartyFull = party.length >= MAX_PARTY_SIZE;

  const toggleThreat = (t: PokeType) =>
    setThreats(prev =>
      prev.includes(t) ? prev.filter(v => v !== t) : [...prev, t]
    );

  const addToParty = (p: SvPokemon) =>
    setParty(prev =>
      prev.length < MAX_PARTY_SIZE && !prev.some(m => m.name === p.name)
        ? [...prev, p]
        : prev
    );

  const offenseRecommendations = useMemo(
    () => recommendOffenseTypes(threats),
    [threats]
  );

  const defenseRecommendations = useMemo(
    () => recommendDefenseTypes(threats).slice(0, 6),
    [threats]
  );

  const candidates = useMemo(
    () =>
      rankPokemonCandidates(
        SV_POKEDEX.filter(p => !party.some(m => m.name === p.name)),
        threats
      ),
    [threats, party]
  );

  const visibleCandidates = useMemo(
    () =>
      showAllCandidates
        ? candidates
        : candidates.slice(0, DEFAULT_CANDIDATE_COUNT),
    [candidates, showAllCandidates]
  );

  const partyDefenseSummary = useMemo(
    () => summarizePartyDefense(party),
    [party]
  );

  const uncoveredThreats = useMemo(
    () => findUncoveredThreats(party, threats),
    [party, threats]
  );

  const searchResults = useMemo(() => {
    if (!searchText) {
      return [];
    }
    return SV_POKEDEX.filter(
      p => p.name.includes(searchText) && !party.some(m => m.name === p.name)
    ).slice(0, 8);
  }, [searchText, party]);

  return (
    <MockStaticLayout title="ポケモンSV パーティ編成ツール">
      <SectionNote>
        対策したい相手のタイプを選ぶと、パーティに入れたいタイプやポケモンの候補を提案します。
      </SectionNote>

      <Section>
        <SectionTitle>① 対策したい相手のタイプ</SectionTitle>
        <CheckboxGrid>
          {POKE_TYPE_LIST.map(t => (
            <CheckboxLabel key={t}>
              <input
                type="checkbox"
                checked={threats.includes(t)}
                onChange={() => toggleThreat(t)}
              />
              <TypeBadge pokeType={t}>{POKE_TYPE_LABEL[t]}</TypeBadge>
            </CheckboxLabel>
          ))}
        </CheckboxGrid>
      </Section>

      <Section>
        <SectionTitle>② パーティに含めたいタイプ</SectionTitle>
        {threats.length ? (
          <>
            <div>
              <SectionNote>
                攻め：これらのタイプの技があると弱点を突けます
              </SectionNote>
              {offenseRecommendations.map(r => (
                <ListRow key={r.attackType}>
                  <TypeBadge pokeType={r.attackType}>
                    {POKE_TYPE_LABEL[r.attackType]}
                  </TypeBadge>
                  <DetailText>
                    →
                    <TypeBadgeList types={r.coveredTypes} />
                    に抜群
                  </DetailText>
                </ListRow>
              ))}
            </div>
            <div>
              <SectionNote>
                受け：これらのタイプは相手の技を半減以下にできます
              </SectionNote>
              {defenseRecommendations.map(r => (
                <ListRow key={r.defenseType}>
                  <TypeBadge pokeType={r.defenseType}>
                    {POKE_TYPE_LABEL[r.defenseType]}
                  </TypeBadge>
                  <DetailText>
                    <TypeBadgeList types={r.resistedTypes} />
                    を半減
                    {r.weakTypes.length ? (
                      <>
                        ／
                        <TypeBadgeList types={r.weakTypes} />
                        が弱点
                      </>
                    ) : null}
                  </DetailText>
                </ListRow>
              ))}
            </div>
          </>
        ) : (
          <EmptyText>上でタイプを選択してください。</EmptyText>
        )}
      </Section>

      <Section>
        <SectionTitle>③ おすすめポケモン候補</SectionTitle>
        {threats.length ? (
          <>
            <div>
              {visibleCandidates.map(c => (
                <ListRow key={c.pokemon.name}>
                  <RowMain>
                    <PokemonName>{c.pokemon.name}</PokemonName>
                    <TypeBadgeList types={c.pokemon.types} />
                    <DetailText>
                      {c.resistedTypes.length ? (
                        <>
                          受け◎:
                          <TypeBadgeList types={c.resistedTypes} />
                        </>
                      ) : null}
                      {c.coveredTypes.length ? (
                        <>
                          攻め◎:
                          <TypeBadgeList types={c.coveredTypes} />
                        </>
                      ) : null}
                      {c.weakTypes.length ? (
                        <>
                          弱点△:
                          <TypeBadgeList types={c.weakTypes} />
                        </>
                      ) : null}
                    </DetailText>
                  </RowMain>
                  <MockActionButton
                    action={
                      isPartyFull
                        ? null
                        : { type: "button", onClick: () => addToParty(c.pokemon) }
                    }
                  >
                    パーティに追加
                  </MockActionButton>
                </ListRow>
              ))}
            </div>
            {candidates.length > DEFAULT_CANDIDATE_COUNT ? (
              <p>
                <MockActionButton
                  action={{
                    type: "button",
                    onClick: () => setShowAllCandidates(v => !v)
                  }}
                >
                  {showAllCandidates
                    ? "表示を減らす"
                    : `すべて表示（${candidates.length}件）`}
                </MockActionButton>
              </p>
            ) : null}
          </>
        ) : (
          <EmptyText>
            タイプを選択すると、相性の良いポケモンを提案します。
          </EmptyText>
        )}
      </Section>

      <Section>
        <SectionTitle>
          ④ パーティ（{party.length}/{MAX_PARTY_SIZE}）
        </SectionTitle>
        {party.length ? (
          <div>
            {party.map(p => (
              <ListRow key={p.name}>
                <RowMain>
                  <PokemonName>{p.name}</PokemonName>
                  <TypeBadgeList types={p.types} />
                </RowMain>
                <MockActionButton
                  action={{
                    type: "button",
                    onClick: () =>
                      setParty(prev => prev.filter(m => m.name !== p.name))
                  }}
                >
                  外す
                </MockActionButton>
              </ListRow>
            ))}
          </div>
        ) : (
          <EmptyText>まだメンバーがいません。候補から追加できます。</EmptyText>
        )}
        <div>
          <SectionNote>名前で検索して追加</SectionNote>
          <SearchInput
            type="text"
            value={searchText}
            placeholder="例: カイリュー"
            onChange={e => setSearchText(e.target.value)}
          />
          {searchResults.map(p => (
            <ListRow key={p.name}>
              <RowMain>
                <PokemonName>{p.name}</PokemonName>
                <TypeBadgeList types={p.types} />
              </RowMain>
              <MockActionButton
                action={
                  isPartyFull
                    ? null
                    : { type: "button", onClick: () => addToParty(p) }
                }
              >
                パーティに追加
              </MockActionButton>
            </ListRow>
          ))}
        </div>
        {threats.length && party.length ? (
          uncoveredThreats.length ? (
            <WarningText>
              ⚠️ 対策できていないタイプ:{" "}
              {uncoveredThreats.map(t => POKE_TYPE_LABEL[t]).join("・")}
              （弱点を突けるメンバーも、半減で受けられるメンバーもいません）
            </WarningText>
          ) : (
            <SectionNote>
              ✅ 選択した相手タイプは、攻めか受けのどちらかで全員カバーできています。
            </SectionNote>
          )
        ) : null}
        {party.length ? (
          <div>
            <SectionNote>
              パーティの耐性チェック（弱点になるメンバーが2体以上いて、半減で受けられるメンバーがいないタイプは赤く表示）
            </SectionNote>
            <DefenseSummaryGrid>
              {partyDefenseSummary
                .filter(s => s.weakMembers.length || s.resistMembers.length)
                .map(s => {
                  const danger =
                    s.weakMembers.length >= 2 && !s.resistMembers.length;
                  return (
                    <Fragment key={s.attackType}>
                      <TypeBadge pokeType={s.attackType}>
                        {POKE_TYPE_LABEL[s.attackType]}
                      </TypeBadge>
                      <SummaryCell danger={danger}>
                        {s.weakMembers.length ? (
                          <>弱点: {s.weakMembers.join("・")}</>
                        ) : null}
                        {s.weakMembers.length && s.resistMembers.length
                          ? " ／ "
                          : null}
                        {s.resistMembers.length ? (
                          <>半減: {s.resistMembers.join("・")}</>
                        ) : null}
                      </SummaryCell>
                    </Fragment>
                  );
                })}
            </DefenseSummaryGrid>
          </div>
        ) : null}
      </Section>
    </MockStaticLayout>
  );
};

export default PartyBuilderScene;
