import {normalize} from './quiz.mjs';

export function collectionUrl(page = 1, limit = 100) {
 const query = new URLSearchParams({
  limit: String(limit),
  page: String(page),
  fields: 'id,title,artist_title,date_display,image_id,is_public_domain,credit_line',
  query: JSON.stringify({bool:{filter:[
   {term:{is_public_domain:true}},
   {term:{artwork_type_id:1}}
  ]}})
 });
 return `https://api.artic.edu/api/v1/artworks/search?${query}`;
}

export async function fetchCollectionPage(page, {fetcher = fetch, limit = 100} = {}) {
 const response = await fetcher(collectionUrl(page, limit), {signal:AbortSignal.timeout(25000)});
 if (!response.ok) throw new Error(`Museet svarade med HTTP ${response.status}.`);
 const json = await response.json();
 if (!Array.isArray(json.data)) throw new Error('Museet returnerade ett oväntat svar.');
 return {works:normalize(json.data), totalPages:json.pagination?.total_pages ?? 1};
}
