// @ts-nocheck

/* elements */
const themeBtn = document.querySelector('#themeBtn');
const yearEl   = document.querySelector('#year');
const toTop    = document.querySelector('#toTop');

/* year */
yearEl && (yearEl.textContent = new Date().getFullYear());

/* theme */
const THEME_KEY = 'site.theme';
const loadTheme = () => localStorage.getItem(THEME_KEY) || 'dark';
const saveTheme = t => localStorage.setItem(THEME_KEY, t);
const applyTheme = t => {
  document.documentElement.setAttribute('data-theme', t);
  themeBtn && (themeBtn.textContent = t === 'dark' ? 'Dark' : 'Light');
};
let theme = loadTheme();
applyTheme(theme);
themeBtn?.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  saveTheme(theme); applyTheme(theme);
});

/* reveal on scroll */
const io = new IntersectionObserver((entries)=>{
  for (const e of entries) if (e.isIntersecting) {
    e.target.classList.add('show'); io.unobserve(e.target);
  }
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* contact form */
const form = document.querySelector('#contactForm');
const tip  = document.querySelector('#formTip');

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();

  const fd = new FormData(form);
  const name  = (fd.get('name') || '').toString().trim();
  const email = (fd.get('email')|| '').toString().trim();
  const msg   = (fd.get('message')|| '').toString().trim();

  if(!name || !email || !msg){ tip.textContent = 'Please fill all fields.'; return; }

  // set reply-to to sender so Formspree reply works
  fd.set('_replyto', email);

  tip.textContent = 'Sending…';
  const btn = document.querySelector('#sendBtn');
  btn && (btn.disabled = true);

  try{
    const res = await fetch(form.action, { method:'POST', body: fd });
    if(res.ok){
      tip.textContent = 'Thanks! Your message was sent.';
      form.reset();
    }else{
      tip.textContent = 'Oops, something went wrong. Try again later.';
    }
  }catch(err){
    tip.textContent = 'Network error. Please try again.';
  }finally{
    btn && (btn.disabled = false);
  }
});

/* back to top */
function updateTop(){
  if(window.scrollY > 320) toTop?.classList.add('show');
  else toTop?.classList.remove('show');
}
updateTop();
window.addEventListener('scroll', updateTop);
toTop?.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
