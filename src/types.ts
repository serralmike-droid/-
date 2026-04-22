export interface Miracle {
  id: string;
  timestamp: number;
  content: string;
  reflection?: string;
  tags: string[];
}

export interface Lesson {
  number: number;
  title: string;
  content: string; // The practice instructions
  insight: string; // Deep interpretation
}
