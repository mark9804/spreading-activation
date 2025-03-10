export enum ExperimentMode {
  PRACTICE = 0,
  EXPERIMENT = 1,
}

export enum Condition {
  UR = 0, // unrelated
  SR = 1, // related
  NO = 2, // random stimuli
}

export enum Answer {
  F = 0,
  J = 1,
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
