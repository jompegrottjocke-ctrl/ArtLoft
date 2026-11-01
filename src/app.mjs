import {shuffle,optionsFor} from './quiz.mjs';
import {fetchCollectionPage} from './collection.mjs';
const $=id=>document.getElementById(id);
let pool=[],round=[],index=0,score=0,answered=false,requestId=0;
const cacheKey='artloft-cleveland-v1';
async function collection(){
 const bundled=await fetch(new URL('./collection-data.json',import.meta.url)).then(r=>r.json());
 if(bundled.length>=5) return bundled;
 let cached=[];try{cached=JSON.parse(localStorage.getItem(cacheKey)||'[]');}catch{}
 if(cached.length>=100) return cached;
 const works=[];
 for(let page=1;page<=10;page++){
  const {works:batch,totalPages}=await fetchCollectionPage(page);
  works.push(...batch);
  $('loading').textContent=`Vi hänger upp samlingen… ${works.length} konstverk`;
  if(page>=totalPages) break;
 }
 const unique=[...new Map(works.map(w=>[w.id,w])).values()];
 if(unique.length<5) throw new Error('Museet gav för få konstverk.');
 try{localStorage.setItem(cacheKey,JSON.stringify(unique));}catch{}
 return unique;
}
function update(){ $('progress').textContent=`VERK ${String(index+1).padStart(2,'0')} / ${round.length}`;$('score').textContent=`${score} rätt`;$('bar').style.width=`${index/round.length*100}%`;}
async function show(){
 answered=false;const token=++requestId;const work=round[index];update();
 $('answers').replaceChildren();$('feedback').textContent='';$('next').hidden=true;$('retry').hidden=true;$('art').hidden=true;$('loading').hidden=false;$('loading').textContent='Konstverket hängs upp…';
 $('image-number').textContent=`№ ${String(index+1).padStart(3,'0')}`;
 const img=$('art');img.onload=()=>{if(token!==requestId)return;$('loading').hidden=true;img.hidden=false;renderAnswers(work);};
 img.onerror=()=>{if(token!==requestId)return;$('loading').textContent='Bilden kunde inte laddas. Kontrollera internetanslutningen och försök igen.';$('retry').hidden=false;};
 img.src=work.image;
}
function renderAnswers(work){
 optionsFor(work,pool).forEach((title,i)=>{
 const button=document.createElement('button');button.className='answer';const badge=document.createElement('span');badge.textContent=String.fromCharCode(65+i);button.append(badge,document.createTextNode(title));button.dataset.title=title;
 button.onclick=()=>{
  if(answered)return;answered=true;const correct=title===work.title;if(correct)score++;
  for(const b of $('answers').children){b.disabled=true;if(b.dataset.title===work.title)b.classList.add('correct');else if(b===button)b.classList.add('wrong');}
  $('feedback').textContent=`${correct?'Rätt!':'Inte riktigt.'} ${work.title} — ${work.artist}, ${work.date}. ${work.credit}`;
  $('score').textContent=`${score} rätt`;$('next').hidden=false;$('next').textContent=index===round.length-1?'Se ditt resultat →':'Nästa konstverk →';$('next').focus();
 };$('answers').append(button);
 });
}
function start(){round=shuffle(pool).slice(0,20);index=0;score=0;$('question').innerHTML='Vad heter<br>konstverket?';$('hint').textContent=`20 verk ur en samling med ${pool.length} målningar.`;show();}
$('next').onclick=()=>{if(!answered)return;if(index<round.length-1){index++;show();}else{++requestId;$('bar').style.width='100%';$('progress').textContent='RUNDA AVSLUTAD';$('question').textContent=`${score} av ${round.length} rätt`;$('hint').textContent='Varje möte med konsten lär oss något nytt. Välkommen tillbaka till galleriet.';$('answers').replaceChildren();$('feedback').textContent='';$('next').hidden=true;$('retry').hidden=false;$('retry').textContent='Spela en ny runda';}};
$('retry').onclick=()=>{if(pool.length){if(index===round.length-1&&answered)start();else show();}else init();};
$('soundless').onclick=()=>{if(pool.length)start();};
async function init(){ $('retry').hidden=true;try{pool=await collection();start();}catch(error){$('loading').textContent=`Samlingen kunde inte hämtas. ${error.message} Försök igen om en stund. Internet behövs för att hämta konstverken.`;$('retry').hidden=false;}}
init();
