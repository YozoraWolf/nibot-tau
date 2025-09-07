import { GenericBooruPost } from '@/interfaces/BooruPost';

export function convertBooruToGeneric(post: any, server: any): GenericBooruPost {
  const m = server.post_mappings;
  return {
    id: post[m.id],
    score: post[m.score],
    rating: post[m.rating],
    tags_general: m.tags?.general ? post[m.tags.general] : undefined,
    tags_artist: m.tags?.artist ? post[m.tags.artist] : undefined,
    tags_character: m.tags?.character ? post[m.tags.character] : undefined,
    tags_meta: m.tags?.meta ? post[m.tags.meta] : undefined,
    file_url: post[m.file_url],
    preview_url: post[m.preview_url],
    sample_url: post[m.sample_url],
    width: post[m.width],
    height: post[m.height],
    source: post[m.source],
    booru_name: server.name,
    raw: post
  };
}
