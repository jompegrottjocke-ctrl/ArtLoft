export function collectionUrl(page = 1, limit = 100) {
 const query=new URLSearchParams({has_image:'1',cc0:'1',type:'Painting',limit:String(limit),skip:String((page-1)*limit)});
 return `https://openaccess-api.clevelandart.org/api/artworks/?${query}`;
}
export function normalizeCleveland(data) {
 return data.filter(w=>w.title && w.images?.web?.url && w.creators?.length && w.share_license_status==='CC0').map(w=>({
  id:w.id,title:w.title,artist:w.creators.map(c=>c.description).join('; '),date:w.creation_date||'',
  image:w.images.web.url,credit:w.creditline||'The Cleveland Museum of Art · CC0',source:w.url
 }));
}
export async function fetchCollectionPage(page,{fetcher=fetch,limit=100}={}) {
 const response=await fetcher(collectionUrl(page,limit),{signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw new Error(`Museet svarade med HTTP ${response.status}.`);
 const json=await response.json();
 if(!Array.isArray(json.data))throw new Error('Museet returnerade ett oväntat svar.');
 return {works:normalizeCleveland(json.data),totalPages:Math.ceil((json.info?.total??json.data.length)/limit)};
}
