const FOOD_DB = [
  {name:"Idli (1 piece)",category:"Breakfast",emoji:"🍚",serving:"1 medium piece",cal:58,protein:2,carbs:12,fat:.2},
  {name:"Dosa (1 medium)",category:"Breakfast",emoji:"🥞",serving:"1 medium dosa",cal:168,protein:4,carbs:28,fat:4},
  {name:"Plain chapati (1)",category:"Dinner",emoji:"🫓",serving:"1 medium chapati",cal:110,protein:3.5,carbs:18,fat:3},
  {name:"Cooked white rice (1 cup)",category:"Lunch",emoji:"🍚",serving:"1 cup cooked",cal:205,protein:4.3,carbs:45,fat:.4},
  {name:"Sambar (1 cup)",category:"Lunch",emoji:"🥣",serving:"1 cup",cal:120,protein:5,carbs:18,fat:3},
  {name:"Curd (1 cup)",category:"Lunch",emoji:"🥛",serving:"1 cup",cal:149,protein:8,carbs:11,fat:8},
  {name:"Boiled egg (1)",category:"Breakfast",emoji:"🥚",serving:"1 large egg",cal:78,protein:6.3,carbs:.6,fat:5.3},
  {name:"Banana (1 medium)",category:"Snack",emoji:"🍌",serving:"1 medium banana",cal:105,protein:1.3,carbs:27,fat:.4},
  {name:"Apple (1 medium)",category:"Snack",emoji:"🍎",serving:"1 medium apple",cal:95,protein:.5,carbs:25,fat:.3},
  {name:"Oats (40 g dry)",category:"Breakfast",emoji:"🥣",serving:"40 g dry oats",cal:152,protein:5.3,carbs:27,fat:3},
  {name:"Grilled chicken (100 g)",category:"Lunch",emoji:"🍗",serving:"100 g cooked",cal:165,protein:31,carbs:0,fat:3.6},
  {name:"Paneer (100 g)",category:"Lunch",emoji:"🧀",serving:"100 g",cal:265,protein:18,carbs:4,fat:20},
  {name:"Mixed vegetable salad (1 bowl)",category:"Lunch",emoji:"🥗",serving:"1 bowl",cal:80,protein:3,carbs:14,fat:2},
  {name:"Almonds (10)",category:"Snack",emoji:"🥜",serving:"10 almonds",cal:70,protein:2.6,carbs:2.6,fat:6.1},
  {name:"Milk (1 cup)",category:"Snack",emoji:"🥛",serving:"1 cup, whole milk",cal:149,protein:7.7,carbs:11.7,fat:8},
  {name:"Vegetable biryani (1 cup)",category:"Lunch",emoji:"🍛",serving:"1 cup",cal:250,protein:5,carbs:38,fat:8},
  {name:"Peanut butter (1 tbsp)",category:"Snack",emoji:"🥜",serving:"1 tablespoon",cal:95,protein:3.5,carbs:3.5,fat:8},
  {name:"Orange (1 medium)",category:"Snack",emoji:"🍊",serving:"1 medium orange",cal:62,protein:1.2,carbs:15.4,fat:.2},
  {name:"Dal (1 cup)",category:"Lunch",emoji:"🥣",serving:"1 cup cooked",cal:198,protein:12,carbs:30,fat:4},
  {name:"Grilled fish (100 g)",category:"Dinner",emoji:"🐟",serving:"100 g cooked",cal:140,protein:26,carbs:0,fat:4}
];

const $ = id => document.getElementById(id);
const dateInput = $("selected-date");
const today = new Date();
dateInput.value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
let entries = [];
let activeFilter = "All";
let dailyGoal = 2000;
let estimatedTarget = 2000;
let selectedFood = null;
let toastTimer;

function fmt(n){ return Math.round(n).toLocaleString("en-IN"); }
function dateKey(){ return dateInput.value || "today"; }
function storageKey(){ return `nutritrack-foods-${dateKey()}`; }
function loadDay(){ try{ entries = JSON.parse(localStorage.getItem(storageKey()) || "[]"); }catch{ entries=[]; } render(); }
function saveDay(){ localStorage.setItem(storageKey(), JSON.stringify(entries)); }
function showToast(message){ const toast=$("toast"); toast.textContent=message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2400); }
function totals(){
  return entries.reduce((a,e)=>{a.cal+=e.cal;a.protein+=e.protein;a.carbs+=e.carbs;a.fat+=e.fat;return a;},{cal:0,protein:0,carbs:0,fat:0});
}
function setProgress(id,value,target){ $(id).style.width=`${Math.min(100,target>0?value/target*100:0)}%`; }
function render(){
  const t=totals(), remaining=dailyGoal-t.cal, pct=dailyGoal>0?t.cal/dailyGoal*100:0;
  $("consumed-calories").textContent=fmt(t.cal);
  $("goal-display").innerHTML=`${fmt(dailyGoal)} <small>kcal</small>`;
  $("remaining-calories").innerHTML=`${fmt(remaining)} <small>kcal</small>`;
  $("calorie-ring").style.background=`conic-gradient(var(--green) ${Math.min(100,pct)*3.6}deg, #eaf1eb ${Math.min(100,pct)*3.6}deg 360deg)`;
  setProgress("calorie-progress",t.cal,dailyGoal);
  $("progress-caption").textContent=`${Math.round(pct)}% of daily goal${pct>100?" · goal reached":""}`;
  $("protein-value").textContent=fmt(t.protein); $("carbs-value").textContent=fmt(t.carbs); $("fats-value").textContent=fmt(t.fat);
  setProgress("protein-progress",t.protein,100);setProgress("carbs-progress",t.carbs,250);setProgress("fats-progress",t.fat,65);
  $("all-count").textContent=entries.length;
  $("diary-summary").textContent=entries.length?`${entries.length} food item${entries.length===1?"":"s"} · ${fmt(t.cal)} kcal total`:"No foods logged yet";
  renderFoods();
  const tip = t.cal===0 ? "Add your first meal to see your nutrition progress and a helpful daily tip." :
    t.protein<35 ? "Try adding a protein-rich food like dal, eggs, paneer, or yogurt to help round out your day." :
    remaining<=0 ? "You've reached your calorie goal. Listen to your hunger and choose nourishing foods that make you feel good." :
    "You're building awareness with every entry. Aim for variety, hydration, and balanced meals throughout your day.";
  $("daily-tip").textContent=tip;
}
function renderFoods(){
  const list=$("food-list"), filtered=activeFilter==="All"?entries:entries.filter(e=>e.meal===activeFilter);
  if(!filtered.length){
    list.innerHTML=`<div class="empty-state"><div class="empty-icon">♧</div><h3>${entries.length?"No foods in this meal":"Your diary starts here"}</h3><p>${entries.length?"Try another meal tab or add a food here.":"Log a meal to see your food and nutrition totals."}</p><button class="text-btn" id="dynamic-add-btn">Add ${entries.length?"food":"your first food"} →</button></div>`;
    $("dynamic-add-btn").addEventListener("click",openFoodDialog); return;
  }
  list.innerHTML=filtered.map(e=>`<div class="food-entry">
    <div class="food-emoji">${e.emoji}</div>
    <div class="food-info"><strong>${escapeHtml(e.name)}</strong><small>${escapeHtml(e.meal)} · ${escapeHtml(e.servingLabel)}</small></div>
    <div class="food-kcal">${fmt(e.cal)} <small>kcal</small></div>
    <button class="delete-food" data-id="${e.id}" aria-label="Remove ${escapeHtml(e.name)}" title="Remove food">×</button>
  </div>`).join("");
  list.querySelectorAll(".delete-food").forEach(btn=>btn.addEventListener("click",()=>{entries=entries.filter(e=>e.id!==btn.dataset.id);saveDay();render();showToast("Food removed from your diary.");}));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function openFoodDialog(){
  $("food-dialog").showModal();
  $("food-search").value="";$("quantity").value="1";$("meal-type").value="Breakfast";selectedFood=null;updateFoodPreview();
  setTimeout(()=>$("food-search").focus(),50);
}
function findFood(query){return FOOD_DB.find(f=>f.name.toLowerCase()===query.trim().toLowerCase()) || FOOD_DB.find(f=>f.name.toLowerCase().includes(query.trim().toLowerCase()));}
function updateFoodPreview(){
  const q=$("food-search").value.trim(); selectedFood=findFood(q);
  const box=$("food-preview");
  if(!q||!selectedFood){box.innerHTML=`<span class="preview-emoji">🥗</span><div><strong>${q?"Food not found in quick list":"Select a food"}</strong><p>${q?"Choose a suggestion or try a listed food.":"Nutrition estimate appears here"}</p></div>`;return;}
  const qty=Math.max(.25,Number($("quantity").value)||1);
  box.innerHTML=`<span class="preview-emoji">${selectedFood.emoji}</span><div><strong>${escapeHtml(selectedFood.name)}</strong><p>${fmt(selectedFood.cal*qty)} kcal · P ${+(selectedFood.protein*qty).toFixed(1)}g · C ${+(selectedFood.carbs*qty).toFixed(1)}g · F ${+(selectedFood.fat*qty).toFixed(1)}g</p></div>`;
}
function calculateTarget(){
  const age=Number($("age").value),height=Number($("height").value),weight=Number($("weight").value),sex=$("sex").value,activity=Number($("activity").value),goal=$("goal-type").value;
  if(!age||!height||!weight||age<18||age>100||height<120||height>230||weight<30||weight>300){showToast("Enter valid details (age 18–100, height 120–230 cm, weight 30–300 kg).");return;}
  // Mifflin–St Jeor estimate, followed by an activity multiplier.
  const bmr=10*weight+6.25*height-5*age+(sex==="male"?5:-161);
  const maintenance=bmr*activity;
  estimatedTarget=Math.round((goal==="lose"?maintenance-300:goal==="gain"?maintenance+250:maintenance)/50)*50;
  estimatedTarget=Math.max(1200,estimatedTarget);
  $("estimated-target").innerHTML=`${fmt(estimatedTarget)} <small>kcal/day</small>`;
  $("estimate-result").dataset.calculated="true";
  showToast("Your daily calorie estimate is ready.");
}
function initFoodOptions(){
  $("food-options").innerHTML=FOOD_DB.map(f=>`<option value="${escapeHtml(f.name)}"></option>`).join("");
}
$("add-food-btn").addEventListener("click",openFoodDialog);
$("hero-add-btn").addEventListener("click",openFoodDialog);
$("cancel-food-btn").addEventListener("click",()=>$("food-dialog").close());
$("food-search").addEventListener("input",updateFoodPreview);
$("quantity").addEventListener("input",updateFoodPreview);
$("food-form").addEventListener("submit",e=>{
  e.preventDefault();
  const food=findFood($("food-search").value);
  if(!food){showToast("Choose a food from the suggested list.");return;}
  const qty=Number($("quantity").value);
  if(!qty||qty<.25||qty>20){showToast("Quantity must be between 0.25 and 20 servings.");return;}
  const meal=$("meal-type").value;
  entries.push({id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,name:food.name,emoji:food.emoji,meal,servingLabel:`${qty} × ${food.serving}`,cal:food.cal*qty,protein:food.protein*qty,carbs:food.carbs*qty,fat:food.fat*qty});
  saveDay();render();$("food-dialog").close();showToast(`${food.name} added to ${meal.toLowerCase()}.`);
});
document.querySelectorAll(".meal-tab").forEach(tab=>tab.addEventListener("click",()=>{
  activeFilter=tab.dataset.filter;document.querySelectorAll(".meal-tab").forEach(t=>t.classList.toggle("active",t===tab));renderFoods();
}));
$("clear-day-btn").addEventListener("click",()=>{
  if(!entries.length){showToast("Your diary is already empty.");return;}
  if(confirm("Remove all food entries for this date?")){entries=[];saveDay();render();showToast("Today's food diary was cleared.");}
});
$("calculator-form").addEventListener("submit",e=>{e.preventDefault();calculateTarget();});
$("use-target-btn").addEventListener("click",()=>{
  if($("estimate-result").dataset.calculated!=="true"){calculateTarget();}
  dailyGoal=estimatedTarget;render();showToast(`Daily calorie goal set to ${fmt(dailyGoal)} kcal.`);
});
dateInput.addEventListener("change",loadDay);
initFoodOptions();loadDay();calculateTarget();
