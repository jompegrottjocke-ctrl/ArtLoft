// Bundle verified CC0 images so the installed quiz works without museum requests.
import {mkdir,writeFile} from 'node:fs/promises';
import {fetchCollectionPage} from '../src/collection.mjs';
const output=new URL('../src/artworks/',import.meta.url);
await mkdir(output,{recursive:true});
const saved=[];
for(let page=1;page<=10 && saved.length<300;page++){
 const {works,totalPages}=await fetchCollectionPage(page);
 for(let i=0;i<works.length && saved.length<300;i+=4){
  const batch=await Promise.all(works.slice(i,i+Math.min(4,300-saved.length)).map(async work=>{
   const url=new URL(work.image);
   if(url.protocol!=='https:' || url.hostname!=='openaccess-cdn.clevelandart.org')throw new Error('Unexpected museum image host');
   const response=await fetch(url,{signal:AbortSignal.timeout(45000)});
   if(!response.ok)throw new Error(`Image ${work.id}: HTTP ${response.status}`);
   if(!response.headers.get('content-type')?.startsWith('image/'))throw new Error(`Image ${work.id}: not an image`);
   const bytes=Buffer.from(await response.arrayBuffer());
   if(bytes.length<1000)throw new Error(`Image ${work.id}: empty image`);
   await writeFile(new URL(`${work.id}.jpg`,output),bytes);
   return {...work,image:`./artworks/${work.id}.jpg`};
  }));
  saved.push(...batch);
 }
 console.log(`Verified and bundled ${saved.length} paintings`);
 if(page>=totalPages)break;
}
if(new Set(saved.map(w=>w.title)).size<100)throw new Error('At least 100 distinct paintings must be bundled before building.');
await writeFile(new URL('../src/collection-data.json',import.meta.url),JSON.stringify(saved));
console.log(`Offline collection ready: ${saved.length} paintings.`);
