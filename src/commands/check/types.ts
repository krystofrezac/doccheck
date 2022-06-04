export interface CheckFileResult {
  filename: string;
  updateRequired: boolean;
  updatedDependencies: string[];
}

export interface ParseFileOptions {
  gitDir?: string;
}

export interface ParsedFile {
  lastUpdate?: Date;
  dependencies: { file: string; lastUpdate?: Date }[];
}

export interface Metadata {
  updatedAfter: string;
  dependencies: string[];
}

export interface ParsingMetadata {
  updatedAfter?: string;
  dependencies: string[];
}
