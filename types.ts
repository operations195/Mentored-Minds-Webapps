
export enum StageType {
  OBSERVATION = 'Observation and Identification',
  ACTION = 'Action and Correction',
  VALIDATION = 'Validation and Explanation'
}

export interface DatasetItem {
  [key: string]: string | number | null;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  businessImpact: string;
}

export interface ChallengeStage {
  id: number;
  type: StageType;
  question: string;
  options: Option[];
  correctExplanation: string;
}

export interface Scenario {
  title: string;
  role: string;
  bossName: string;
  brief: string;
  dataset: DatasetItem[];
  stages: ChallengeStage[];
}

export interface AppState {
  currentStageIndex: number;
  completed: boolean;
  score: number;
  mistakes: number;
  history: string[];
}
