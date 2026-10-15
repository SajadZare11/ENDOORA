import type {
  AdventureNode,
  AdventureEnding,
  AdventureStory,
  AdventureChoice,
  AdventureGenre,
} from "../reading-adventure-types";

export interface NodeDraft {
  stepNumber: number;
  pathCode: string;
  passageEn: string;
  keywords: Array<{ word: string; meaningFa: string; phonetic?: string }>;
  question: {
    promptEn: string;
    promptFa: string;
    options: string[];
    correctIndex: number;
    hintSnippet: string;
    clueFa: string;
  };
  choiceA: {
    labelEn: string;
    labelFa: string;
    descriptionFa: string;
  };
  choiceB: {
    labelEn: string;
    labelFa: string;
    descriptionFa: string;
  };
}

export interface EndingDraft {
  pathCode: string; // e.g. "AAAAA"
  titleEn: string;
  titleFa: string;
  badgeCategory: "legendary" | "heroic" | "funny" | "secret" | "explorer" | "scholar";
  badgeIcon: string;
  badgeNameFa: string;
  climaxEn: string;
  climaxFa: string;
  xpReward: number;
}

export function buildAdventureStory(config: {
  id: string;
  storyIndex: number;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  titleEn: string;
  titleFa: string;
  genre: AdventureGenre;
  genreLabelFa: string;
  genreIcon: string;
  synopsisEn: string;
  synopsisFa: string;
  coverImage: string;
  nodes: NodeDraft[];
  endings: EndingDraft[];
}): AdventureStory {
  const nodesRecord: Record<string, AdventureNode> = {};
  const endingsRecord: Record<string, AdventureEnding> = {};

  // Register all 32 endings
  for (const end of config.endings) {
    const endingId = `ending-${end.pathCode}`;
    endingsRecord[endingId] = {
      id: endingId,
      pathCode: end.pathCode,
      titleEn: end.titleEn,
      titleFa: end.titleFa,
      badgeCategory: end.badgeCategory,
      badgeIcon: end.badgeIcon,
      badgeNameFa: end.badgeNameFa,
      climaxEn: end.climaxEn,
      climaxFa: end.climaxFa,
      xpReward: end.xpReward,
    };
  }

  // Register nodes
  for (const n of config.nodes) {
    const nodeId = n.pathCode === "root" ? "node-root" : `node-${n.pathCode}`;
    const nextPathA = n.pathCode === "root" ? "A" : `${n.pathCode}A`;
    const nextPathB = n.pathCode === "root" ? "B" : `${n.pathCode}B`;

    const choiceA: AdventureChoice = {
      id: "A",
      labelEn: n.choiceA.labelEn,
      labelFa: n.choiceA.labelFa,
      descriptionFa: n.choiceA.descriptionFa,
      nextNodeId: n.stepNumber < 5 ? `node-${nextPathA}` : undefined,
      endingId: n.stepNumber === 5 ? `ending-${nextPathA}` : undefined,
    };

    const choiceB: AdventureChoice = {
      id: "B",
      labelEn: n.choiceB.labelEn,
      labelFa: n.choiceB.labelFa,
      descriptionFa: n.choiceB.descriptionFa,
      nextNodeId: n.stepNumber < 5 ? `node-${nextPathB}` : undefined,
      endingId: n.stepNumber === 5 ? `ending-${nextPathB}` : undefined,
    };

    nodesRecord[nodeId] = {
      id: nodeId,
      stepNumber: n.stepNumber,
      pathCode: n.pathCode,
      passageEn: n.passageEn,
      keywords: n.keywords,
      question: n.question,
      choices: [choiceA, choiceB],
    };
  }

  return {
    id: config.id,
    storyIndex: config.storyIndex,
    cefr: config.cefr,
    titleEn: config.titleEn,
    titleFa: config.titleFa,
    genre: config.genre,
    genreLabelFa: config.genreLabelFa,
    genreIcon: config.genreIcon,
    synopsisEn: config.synopsisEn,
    synopsisFa: config.synopsisFa,
    coverImage: config.coverImage,
    rootNodeId: "node-root",
    nodes: nodesRecord,
    endings: endingsRecord,
  };
}
