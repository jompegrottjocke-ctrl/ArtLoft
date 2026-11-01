import assert from 'node:assert/strict';
import {fetchCollectionPage} from '../src/collection.mjs';
const {works}=await fetchCollectionPage(1);
assert.ok(new Set(works.map(w=>w.title)).size>=5,'Museet måste leverera fem olika spelbara verk.');
const image=await fetch(works[0].image,{signal:AbortSignal.timeout(30000)});
assert.ok(image.ok,`Bildservern svarade med HTTP ${image.status}`);
assert.ok(image.headers.get('content-type')?.startsWith('image/'),'Svaret måste vara en bild.');
assert.ok((await image.arrayBuffer()).byteLength>1000,'Bilden måste innehålla data.');
console.log(`Livekontroll godkänd: ${works.length} konstverk och en hämtad bild.`);
