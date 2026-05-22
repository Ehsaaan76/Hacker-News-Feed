export interface Story {
  objectID: string;
  title: string;
  url: string | null; 
  author: string; 
  points: number; 
  num_comments: number; 
  created_at: string;
  story_text: string | null;
}

export interface AlgoliaResponse {
  hits: Story[];
  page: number;
  nbPages: number;
}