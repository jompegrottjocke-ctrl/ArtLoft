import test from 'node:test';
import assert from 'node:assert/strict';
import {shuffle,optionsFor,normalize} from '../src/quiz.mjs';
test('five distinct options include the correct work exactly once',()=>{const pool=Array.from({length:20},(_,i)=>({title:`Work ${i}`}));for(let i=0;i<100;i++){const options=optionsFor(pool[0],pool);assert.equal(options.length,5);assert.equal(new Set(options).size,5);assert.equal(options.filter(x=>x===pool[0].title).length,1);}});
test('shuffle preserves input and all items',()=>{const input=[1,2,3,4];assert.deepEqual([...shuffle(input)].sort(),input);assert.deepEqual(input,[1,2,3,4]);});
test('collection excludes copyrighted or unusable images',()=>{const base={id:1,title:'Painting',artist_title:'Artist',image_id:'abc',is_public_domain:true};assert.equal(normalize([base,{...base,is_public_domain:false},{...base,image_id:null}]).length,1);});

import {collectionUrl,fetchCollectionPage} from '../src/collection.mjs';
test('museum request uses one JSON query with both filters',()=>{
 const url=new URL(collectionUrl(3));
 assert.equal(url.searchParams.get('page'),'3');
 assert.equal(url.searchParams.get('limit'),'100');
 assert.deepEqual(JSON.parse(url.searchParams.get('query')), {bool:{filter:[{term:{is_public_domain:true}},{term:{artwork_type_id:1}}]}});
 assert.equal([...url.searchParams.keys()].some(k=>k.startsWith('query[')),false);
});
test('museum response provides playable works and pagination',async()=>{
 const result=await fetchCollectionPage(1,{fetcher:async()=>({ok:true,json:async()=>({data:[{id:1,title:'Painting',artist_title:'Artist',image_id:'abc',is_public_domain:true}],pagination:{total_pages:10}})})});
 assert.equal(result.works.length,1);assert.equal(result.totalPages,10);
});
test('museum HTTP errors are reported',async()=>{
 await assert.rejects(fetchCollectionPage(1,{fetcher:async()=>({ok:false,status:400})}),/HTTP 400/);
});
