import type { CefrLevel } from "../types";
import type { AdventureStory } from "../reading-adventure-types";
import { story1BakersCat } from "./a1/story-1-bakers-cat";
import { story2GoldenKey } from "./a1/story-2-golden-key";
import { story3MidnightTrain } from "./a1/story-3-midnight-train";
import { story4ClockworkRobot } from "./a1/story-4-clockwork-robot";
import { story5BeachRescue } from "./a1/story-5-beach-rescue";
import { story1CakeCatastrophe } from "./a2/story-1-cake-catastrophe";
import { story2TreehouseMystery } from "./a2/story-2-treehouse-mystery";
import { story3WildCamping } from "./a2/story-3-wild-camping";
import { story4MuseumTimePortal } from "./a2/story-4-museum-time-portal";
import { story5BlizzardRescue } from "./a2/story-5-blizzard-rescue";
import { story6CelebrityEncounter } from "./a2/story-6-celebrity-encounter";
import { story1TalentShow } from "./b1/story-1-talent-show";
import { story2LighthouseCipher } from "./b1/story-2-lighthouse-cipher";
import { story3EmeraldValley } from "./b1/story-3-emerald-valley";
import { story4SkyStation } from "./b1/story-4-sky-station";
import { story5CanyonFlood } from "./b1/story-5-canyon-flood";
import { story6SunsetFestival } from "./b1/story-6-sunset-festival";
import { story1CulinaryCrisis } from "./b2/story-1-culinary-crisis";
import { story2ArchitectCipher } from "./b2/story-2-architect-cipher";
import { story3SilkRoad } from "./b2/story-3-silk-road";
import { story4DeepOcean } from "./b2/story-4-deep-ocean";
import { story5AvalancheRescue } from "./b2/story-5-avalanche-rescue";
import { story6FestivalPremiere } from "./b2/story-6-festival-premiere";
import { story1AuctionChaos } from "./c1/story-1-auction-chaos";
import { story2AntiquarianCipher } from "./c1/story-2-antiquarian-cipher";
import { story3PatagoniaExpedition } from "./c1/story-3-patagonia-expedition";
import { story4QuantumStation } from "./c1/story-4-quantum-station";
import { story5HyperbaricRescue } from "./c1/story-5-hyperbaric-rescue";
import { story1DiplomaticBanquet } from "./c2/story-1-diplomatic-banquet";
import { story2AlexandrianPalimpsest } from "./c2/story-2-alexandrian-palimpsest";
import { story3KarakoramTraverse } from "./c2/story-3-karakoram-traverse";
import { story4OortCloud } from "./c2/story-4-oort-cloud";
import { story5StratosphericRescue } from "./c2/story-5-stratospheric-rescue";

export const A1_ADVENTURE_STORIES: AdventureStory[] = [
  story1BakersCat,
  story2GoldenKey,
  story3MidnightTrain,
  story4ClockworkRobot,
  story5BeachRescue,
];

export const A2_ADVENTURE_STORIES: AdventureStory[] = [
  story1CakeCatastrophe,
  story2TreehouseMystery,
  story3WildCamping,
  story4MuseumTimePortal,
  story5BlizzardRescue,
  story6CelebrityEncounter,
];

export const B1_ADVENTURE_STORIES: AdventureStory[] = [
  story1TalentShow,
  story2LighthouseCipher,
  story3EmeraldValley,
  story4SkyStation,
  story5CanyonFlood,
  story6SunsetFestival,
];

export const B2_ADVENTURE_STORIES: AdventureStory[] = [
  story1CulinaryCrisis,
  story2ArchitectCipher,
  story3SilkRoad,
  story4DeepOcean,
  story5AvalancheRescue,
  story6FestivalPremiere,
];

export const C1_ADVENTURE_STORIES: AdventureStory[] = [
  story1AuctionChaos,
  story2AntiquarianCipher,
  story3PatagoniaExpedition,
  story4QuantumStation,
  story5HyperbaricRescue,
];

export const C2_ADVENTURE_STORIES: AdventureStory[] = [
  story1DiplomaticBanquet,
  story2AlexandrianPalimpsest,
  story3KarakoramTraverse,
  story4OortCloud,
  story5StratosphericRescue,
];

export const ADVENTURE_STORIES_BY_CEFR: Record<CefrLevel, AdventureStory[]> = {
  A1: A1_ADVENTURE_STORIES,
  A2: A2_ADVENTURE_STORIES,
  B1: B1_ADVENTURE_STORIES,
  B2: B2_ADVENTURE_STORIES,
  C1: C1_ADVENTURE_STORIES,
  C2: C2_ADVENTURE_STORIES,
};

export function getLevelAdventureStories(cefr: CefrLevel): AdventureStory[] {
  return ADVENTURE_STORIES_BY_CEFR[cefr] || A1_ADVENTURE_STORIES;
}

export function getAdventureStory(
  cefr: CefrLevel,
  storyIdOrIndex: string | number
): AdventureStory | undefined {
  const stories = getLevelAdventureStories(cefr);
  if (typeof storyIdOrIndex === "number") {
    return stories.find((s) => s.storyIndex === storyIdOrIndex) || stories[0];
  }
  return stories.find((s) => s.id === storyIdOrIndex) || stories[0];
}
