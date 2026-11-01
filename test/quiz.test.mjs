import test from 'node:test';
import assert from 'node:assert/strict';
import {shuffle,optionsFor,normalize} from '../src/quiz.mjs';
test('five distinct options include the correct work exactly once',()=>{const pool=Array.from({length:20},(_,i)=>({title:`Work ${i}`}));for(let i=0;i<100;i++){const options=optionsFor(pool[0],pool);assert.equal(options.length,5);assert.equal(new Set(options).size,5);assert.equal(options.filter(x=>x===pool[0].title).length,1);}});
test('shuffle preserves input and all items',()=>{const input=[1,2,3,4];assert.deepEqual([...shuffle(input)].sort(),input);assert.deepEqual(input,[1,2,3,4]);});
test('collection excludes copyrighted or unusable images',()=>{const base={id:1,title:'Painting',artist_title:'Artist',image_id:'abc',is_public_domain:true};assert.equal(normalize([base,{...base,is_public_domain:false},{...base,image_id:null}]).length,1);});

import {collectionUrl,fetchCollectionPage} from '../src/collection.mjs';
test('Cleveland request selects CC0 paintings and paginates',()=>{
 const url=new URL(collectionUrl(3));
 assert.equal(url.hostname,'openaccess-api.clevelandart.org');
 assert.equal(url.searchParams.get('skip'),'200');
 assert.equal(url.searchParams.get('cc0'),'1');
 assert.equal(url.searchParams.get('type'),'Painting');
});
test('Cleveland response provides licensed playable works',async()=>{
 const result=await fetchCollectionPage(1,{fetcher:async()=>({ok:true,json:async()=>({data:[{id:1,title:'Painting',creators:[{description:'Artist'}],images:{web:{url:'https://openaccess-cdn.clevelandart.org/test.jpg'}},share_license_status:'CC0'}],info:{total:1000}})})});
 assert.equal(result.works.length,1);assert.equal(result.totalPages,10);
});
test('museum HTTP errors are reported',async()=>{
 await assert.rejects(fetchCollectionPage(1,{fetcher:async()=>({ok:false,status:400})}),/HTTP 400/);
});
