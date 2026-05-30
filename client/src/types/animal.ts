export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnimalData {
  animal: string;
  confidence: number;
  position: Position;
}

export interface AnimalResponse {
  success: boolean;
  message: string;
  data: AnimalData | null;
}

export interface AnimalNameResponse {
  animal_name: string[];
}
