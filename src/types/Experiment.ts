export const enum ExperimentMode {
  PRACTICE = 0,
  EXPERIMENT = 1,
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
  prime: string;
  target: string;
  response: string;
  condition: Condition;
};
