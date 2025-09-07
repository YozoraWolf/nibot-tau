export interface GenericBooruPost {
  id: string | number;
  score?: number | string;
  rating?: string;
  tags_general?: string;
  tags_artist?: string;
  tags_character?: string;
  tags_meta?: string;
  file_url?: string;
  preview_url?: string;
  sample_url?: string;
  width?: number | string;
  height?: number | string;
  source?: string;
  booru_name: string;
  raw?: any; // original post object for reference
}
