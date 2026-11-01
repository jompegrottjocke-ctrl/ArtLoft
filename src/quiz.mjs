export function shuffle(items, random = Math.random) {
 const result = [...items];
 for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 return result;
}
export function optionsFor(work, pool) {
 const others=[...new Set(pool.map(x=>x.title))].filter(x=>x!==work.title);
 if(others.length<4) throw new Error('Minst fem olika verk behövs.');
 return shuffle([work.title,...shuffle(others).slice(0,4)]);
}
export function normalize(data) {
 return data.filter(x=>x.image_id && x.is_public_domain && x.title && x.artist_title).map(x=>({id:x.id,title:x.title,artist:x.artist_title,date:x.date_display||'',image:`https://www.artic.edu/iiif/2/${x.image_id}/full/843,/0/default.jpg`,credit:x.credit_line||'Art Institute of Chicago',source:`https://www.artic.edu/artworks/${x.id}`}));
}
