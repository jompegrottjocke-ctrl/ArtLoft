import test from 'node:test';
import assert from 'node:assert/strict';
import {shuffle,optionsFor,normalize} from '../src/quiz.mjs';
test('five distinct options include the correct work exactly once',()=>{const pool=Array.from({length:20},(_,i)=>({title:`Work ${i}`}));for(let i=0;i<100;i++){const options=optionsFor(pool[0],pool);assert.equal(options.length,5);assert.equal(new Set(options).size,5);assert.equal(options.filter(x=>x===pool[0].title).length,1);}});
test('shuffle preserves input and all items',()=>{const input=[1,2,3,4];assert.deepEqual([...shuffle(input)].sort(),input);assert.deepEqual(input,[1,2,3,4]);});
test('collection excludes copyrighted or unusable images',()=>{const base={id:1,title:'Painting',artist_title:'Artist',image_id:'abc',is_public_domain:true};assert.equal(normalize([base,{...base,is_public_domain:false},{...base,image_id:null}]).length,1);});
