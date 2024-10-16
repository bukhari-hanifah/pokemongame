export interface MoveDetails {
  accuracy: any
  contest_combos: any
  contest_effect: ContestEffect
  contest_type: ContestType
  damage_class: DamageClass
  effect_chance: any
  effect_changes: any[]
  effect_entries: EffectEntry[]
  flavor_text_entries: FlavorTextEntry[]
  generation: Generation
  id: number
  learned_by_pokemon: LearnedByPokemon[]
  machines: any[]
  meta: Meta
  name: string
  names: Name[]
  past_values: any[]
  power: any
  pp: number
  priority: number
  stat_changes: any[]
  super_contest_effect: SuperContestEffect
  target: Target
  type: Type
}

export interface ContestEffect {
  url: string
}

export interface ContestType {
  name: string
  url: string
}

export interface DamageClass {
  name: string
  url: string
}

export interface EffectEntry {
  effect: string
  language: Language
  short_effect: string
}

export interface Language {
  name: string
  url: string
}

export interface FlavorTextEntry {
  flavor_text: string
  language: Language2
  version_group: VersionGroup
}

export interface Language2 {
  name: string
  url: string
}

export interface VersionGroup {
  name: string
  url: string
}

export interface Generation {
  name: string
  url: string
}

export interface LearnedByPokemon {
  name: string
  url: string
}

export interface Meta {
  ailment: Ailment
  ailment_chance: number
  category: Category
  crit_rate: number
  drain: number
  flinch_chance: number
  healing: number
  max_hits: any
  max_turns: any
  min_hits: any
  min_turns: any
  stat_chance: number
}

export interface Ailment {
  name: string
  url: string
}

export interface Category {
  name: string
  url: string
}

export interface Name {
  language: Language3
  name: string
}

export interface Language3 {
  name: string
  url: string
}

export interface SuperContestEffect {
  url: string
}

export interface Target {
  name: string
  url: string
}

export interface Type {
  name: string
  url: string
}
