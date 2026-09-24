export interface MemoryVaultState {
  level1Unlocked: boolean;
  level2Unlocked: boolean;
  level3Unlocked: boolean;
}

export interface ModalAlertInfo {
  isOpen: boolean;
  title: string;
  message: string;
}

export interface PhotoMemoryItem {
  id: number;
  title: string;
  question: string;
  options: [string, string, string];
  correctIndex: number;
  imageUrl: string;
  romanticCaption: string;
  isAnswered: boolean;
  isScratched: boolean;
  scratchPercentage: number;
}
