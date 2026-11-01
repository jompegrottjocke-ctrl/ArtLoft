import assert from 'node:assert/strict';
import {fetchCollectionPage} from '../src/collection.mjs';
const {works}=await fetchCollectionPage(1);
assert.ok(new Set(works.map(w=>w.title)).size>=5);
const image=await fetch(works[0].image,{signal:AbortSignal.timeout(30000)});
assert.ok(image.ok,`Image HTTP ${image.status}`);
assert.ok(image.headers.get('content-type')?.startsWith('image/'));
assert.ok((await image.arrayBuffer()).byteLength>1000);
console.log(`Verified ${works.length} paintings and one image.`);
