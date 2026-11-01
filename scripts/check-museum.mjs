import assert from 'node:assert/strict';
import {fetchCollectionPage} from '../src/collection.mjs';
const {works}=await fetchCollectionPage(1);
assert.ok(new Set(works.map(w=>w.title)).size>=5,'Museet måste leverera fem olika spelbara verk.');
// Match the desktop browser request: some museum CDNs reject Node's default user agent.
const image=await fetch(works[0].image,{
 signal:AbortSignal.timeout(30000),
 headers:{
  'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  'Accept':'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
  'Referer':'https://www.artic.edu/'
 }
});
if (!image.ok) {
 const detail=(await image.text()).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,350);
 throw new Error(`Bildservern svarade med HTTP ${image.status}. URL: ${works[0].image}. Svar: ${detail}`);
}
assert.ok(image.ok,`Bildservern svarade med HTTP ${image.status}`);
assert.ok(image.headers.get('content-type')?.startsWith('image/'),'Svaret måste vara en bild.');
assert.ok((await image.arrayBuffer()).byteLength>1000,'Bilden måste innehålla data.');
console.log(`Livekontroll godkänd: ${works.length} konstverk och en hämtad bild.`);
