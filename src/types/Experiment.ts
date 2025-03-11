export const enum ExperimentMode {
  PRACTICE = 0,
  EXPERIMENT = 1,
}

// 实验组别
// A 组左手（F）是无意味，右手（J）是有意味；
// B 组左手（J）是有意味，右手（F）是无意味；
export const enum GroupType {
  A = "A",
  B = "B",
}

export const enum Condition {
  UR = "UR", // unrelated
  SR = "SR", // related
  NO = "NO", // random stimuli
}

export const enum Answer {
  F = "F",
  J = "J",
}

export type Word = {
  prime: string;
  target: string;
  answer?: Answer;
  response?: string;
  condition: Condition;
};

export type Result = {
  group: GroupType;
  prime: string;
  target: string;
  response: string;
  responseTime: number;
  condition: Condition;
  isCorrect: boolean;
};
