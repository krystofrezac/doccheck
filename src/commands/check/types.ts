export interface CheckFileResult {
  filename: string;
  updateRequired: boolean;
  updatedDependencies: string[];
}

export interface ParseFileOptions {
  gitDir?: string;
}

export interface ParsedFile {
  updatedAt: Date;
  dependencies: { file: string; lastUpdate?: Date }[];
}
