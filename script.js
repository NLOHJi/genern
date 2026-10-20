// @ts-nocheck
(() => {
  const $ = id => document.getElementById(id);

  // ---------- STORAGE ----------
  const KEY = 'pfgen.clients';
  const uid = () => 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);

  const blank = () => ({
    personal: { fullName:'', headline:'', photo:'', email:'', phone:'', location:'',
                social:{ linkedin:'', github:'', website:'' } },
    about:'', skills:[], projects:[], experience:[], education:[],
    certifications:[], languages:[], references:[], hobbies:[]
  });

  const Store = {
    all() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } },
    list() { return Object.values(Store.all()).sort((a,b) => b.updatedAt - a.updatedAt); },
    get(id) { return Store.all()[id]; },
    create(name) {
      const all = Store.all(); const id = uid();
      all[id] = { id, name: name || 'Untitled', theme:'modern',
                  createdAt: Date.now(), updatedAt: Date.now(), data: blank() };
      localStorage.setItem(KEY, JSON.stringify(all));
      return all[id];
    },
    save(c) { const all = Store.all(); c.updatedAt = Date.now(); all[c.id] = c; localStorage.setItem(KEY, JSON.stringify(all)); },
    remove(id) { const all = Store.all(); delete all[id]; localStorage.setItem(KEY, JSON.stringify(all)); }
  };

  // ---------- RENDER PORTFOLIO ----------
  const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  function portfolioHtml(c) {
    const d = c.data, p = d.personal, out = [];
    out.push(`<div class="pf" data-theme="${esc(c.theme||'modern')}">`);
    out.push(`<header class="pf-hero">`);
    if (p.photo) out.push(`<img class="pf-photo" src="${p.photo}" alt="">`);
    out.push(`<h1>${esc(p.fullName||'Your Name')}</h1>`);
    if (p.headline) out.push(`<div class="headline">${esc(p.headline)}</div>`);
    const contacts = [];
    if (p.email) contacts.push(`<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`);
    if (p.phone) contacts.push(`<a href="tel:${esc(p.phone)}">${esc(p.phone)}</a>`);
    if (p.location) contacts.push(esc(p.location));
    if (p.social.linkedin) contacts.push(`<a href="${esc(p.social.linkedin)}">LinkedIn</a>`);
    if (p.social.github) contacts.push(`<a href="${esc(p.social.github)}">GitHub</a>`);
    if (p.social.website) contacts.push(`<a href="${esc(p.social.website)}">Website</a>`);
    if (contacts.length) out.push(`<div class="contact">${contacts.join(' · ')}</div>`);
    out.push(`</header>`);

    if (d.about) out.push(`<section class="pf-section"><h2>About</h2><p>${esc(d.about).replace(/\n/g,'<br>')}</p></section>`);

    if (d.skills.length) {
      out.push(`<section class="pf-section"><h2>Skills</h2>`);
      d.skills.forEach(g => {
        if ((g.category||'') || (g.items||[]).length) {
          out.push(`<div class="pf-skill-group">`);
          if (g.category) out.push(`<div class="cat">${esc(g.category)}</div>`);
          out.push(`<div class="pf-skills">`);
          (g.items||[]).forEach(i => out.push(`<span class="pf-skill">${esc(i)}</span>`));
          out.push(`</div></div>`);
        }
      });
      out.push(`</section>`);
    }

    if (d.projects.length) {
      out.push(`<section class="pf-section"><h2>Projects</h2><div class="pf-projects">`);
      d.projects.forEach(pr => {
        out.push(`<div class="pf-project">`);
        if (pr.image) out.push(`<img src="${pr.image}" alt="">`);
        out.push(`<div class="body"><h3>${esc(pr.title)}</h3>`);
        if (pr.description) out.push(`<p>${esc(pr.description)}</p>`);
        if ((pr.tags||[]).length) {
          out.push(`<div class="tags">`);
          pr.tags.forEach(t => out.push(`<span class="tag">${esc(t)}</span>`));
          out.push(`</div>`);
        }
        if (pr.link) out.push(`<p style="margin-top:10px"><a href="${esc(pr.link)}">View project →</a></p>`);
        out.push(`</div></div>`);
      });
      out.push(`</div></section>`);
    }

    if (d.experience.length) {
      out.push(`<section class="pf-section"><h2>Experience</h2><div class="pf-timeline">`);
      d.experience.forEach(e => {
        out.push(`<div class="pf-item"><p class="role">${esc(e.role)}</p>`);
        if (e.company) out.push(`<p class="org">${esc(e.company)}</p>`);
        if (e.period) out.push(`<p class="period">${esc(e.period)}</p>`);
        if (e.description) out.push(`<p>${esc(e.description).replace(/\n/g,'<br>')}</p>`);
        out.push(`</div>`);
      });
      out.push(`</div></section>`);
    }

    if (d.education.length) {
      out.push(`<section class="pf-section"><h2>Education</h2><div class="pf-timeline">`);
      d.education.forEach(e => {
        out.push(`<div class="pf-item"><p class="role">${esc(e.degree)}</p>`);
        if (e.school) out.push(`<p class="org">${esc(e.school)}</p>`);
        if (e.period) out.push(`<p class="period">${esc(e.period)}</p>`);
        if (e.note) out.push(`<p>${esc(e.note)}</p>`);
        out.push(`</div>`);
      });
      out.push(`</div></section>`);
    }

    if (d.certifications.length) {
      out.push(`<section class="pf-section"><h2>Certifications</h2><div class="pf-timeline">`);
      d.certifications.forEach(c => {
        out.push(`<div class="pf-item"><p class="role">${esc(c.name)}</p>`);
        if (c.issuer) out.push(`<p class="org">${esc(c.issuer)}</p>`);
        if (c.year) out.push(`<p class="period">${esc(c.year)}</p>`);
        out.push(`</div>`);
      });
      out.push(`</div></section>`);
    }

    if (d.languages.length) {
      out.push(`<section class="pf-section"><h2>Languages</h2><div class="pf-skills">`);
      d.languages.forEach(l => out.push(`<span class="pf-skill">${esc(l.name)}${l.level ? ' · ' + esc(l.level) : ''}</span>`));
      out.push(`</div></section>`);
    }

    if (d.references.length) {
      out.push(`<section class="pf-section"><h2>References</h2><div class="pf-timeline">`);
      d.references.forEach(r => {
        out.push(`<div class="pf-item"><p class="role">${esc(r.name)}</p>`);
        if (r.role || r.organization) out.push(`<p class="org">${esc([r.role, r.organization].filter(Boolean).join(', '))}</p>`);
        if (r.phone) out.push(`<p class="period">${esc(r.phone)}</p>`);
        out.push(`</div>`);
      });
      out.push(`</div></section>`);
    }

    if (d.hobbies.length) {
      out.push(`<section class="pf-section"><h2>Interests</h2><div class="pf-skills">`);
      d.hobbies.forEach(h => out.push(`<span class="pf-skill">${esc(h)}</span>`));
      out.push(`</div></section>`);
    }

    out.push(`<footer class="pf-footer">Portfolio of ${esc(p.fullName||'')}</footer></div>`);
    return out.join('');
  }

  async function fullDoc(c) {
    let css = '';
    try { css = await (await fetch('style.css')).text(); } catch {}
    const title = c.data.personal.fullName || 'Portfolio';
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${css}</style></head><body style="background:#fff; margin:0;">${portfolioHtml(c)}</body></html>`;
  }

  // ---------- SAFE EXPORT (Acode Preview Safe) ----------
  async function download(name, content, mime) {
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([content], name, { type: mime });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: name });
          return;
        }
      } catch (err) {
        console.warn('Share failed', err);
      }
    }

    try {
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (!win) throw new Error('Popup blocked');
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      alert("Acode is blocking the download. Please copy the text below to save your file:\n\n" + content);
    }
  }

  const safe = s => String(s||'portfolio').replace(/[^\w\-]+/g,'_').slice(0,60);

  // ---------- APP ----------
  let current = null, saveTimer = null;

  const show = id => {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
    window.scrollTo(0,0);
  };

  function refreshList() {
    const list = Store.list();
    const el = $('client-list'); el.innerHTML = '';
    $('empty-note').style.display = list.length ? 'none' : 'block';
    list.forEach(c => {
      const div = document.createElement('div'); div.className = 'client-item';
      const left = document.createElement('div');
      const name = document.createElement('div'); name.className = 'name'; name.textContent = c.name;
      const sub = document.createElement('div'); sub.className = 'sub';
      sub.textContent = c.data.personal.headline || new Date(c.updatedAt).toLocaleDateString();
      left.appendChild(name); left.appendChild(sub);
      const del = document.createElement('button'); del.className = 'del'; del.textContent = '×';
      del.addEventListener('click', e => {
        e.stopPropagation();
        if (confirm('Delete this client?')) { Store.remove(c.id); refreshList(); }
      });
      div.appendChild(left); div.appendChild(del);
      div.addEventListener('click', () => openClient(c.id));
      el.appendChild(div);
    });
  }

  function openClient(id) {
    current = Store.get(id);
    if (!current) return;
    $('edit-title').textContent = current.name;
    renderForm();
    switchTab('form');
    show('screen-edit');
  }

  function switchTab(name) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    $('tab-form').hidden = name !== 'form';
    $('tab-preview').hidden = name !== 'preview';
    if (name === 'preview') refreshPreview();
  }

  async function refreshPreview() {
    if (!current) return;
    $('tab-preview').srcdoc = await fullDoc(current);
  }

  function autoSave() {
    if (!current) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => Store.save(current), 500);
  }

  // ---------- FORM HELPERS ----------
  const sectionTitle = t => { const h = document.createElement('div'); h.className='section-title'; h.textContent = t; return h; };

  function field(label, value, onChange, opts={}) {
    const wrap = document.createElement('div');
    const l = document.createElement('label'); l.className='lbl'; l.textContent = label;
    const i = document.createElement(opts.area ? 'textarea' : 'input');
    if (!opts.area) i.type = opts.type || 'text';
    i.value = value || '';
    i.placeholder = opts.placeholder || '';
    i.addEventListener('input', () => onChange(i.value));
    wrap.appendChild(l); wrap.appendChild(i);
    return wrap;
  }

  function card(children, onRemove) {
    const c = document.createElement('div'); c.className = 'card';
    children.forEach(x => c.appendChild(x));
    if (onRemove) {
      const b = document.createElement('button'); b.className='remove'; b.textContent='Remove';
      b.addEventListener('click', onRemove); c.appendChild(b);
    }
    return c;
  }

  function addBtn(label, onClick) {
    const b = document.createElement('button');
    b.className='ghost block'; b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  function renderForm() {
    const d = current.data;
    const root = $('tab-form');
    root.innerHTML = '';

    root.appendChild(sectionTitle('Personal'));
    root.appendChild(field('Full name', d.personal.fullName, v => { d.personal.fullName = v; autoSave(); }));
    root.appendChild(field('Headline', d.personal.headline, v => { d.personal.headline = v; autoSave(); },
      { placeholder:'e.g. Irrigation & Drainage Technology Student' }));
    root.appendChild(field('Email', d.personal.email, v => { d.personal.email = v; autoSave(); }, { type:'email' }));
    root.appendChild(field('Phone', d.personal.phone, v => { d.personal.phone = v; autoSave(); }, { type:'tel' }));
    root.appendChild(field('Location', d.personal.location, v => { d.personal.location = v; autoSave(); },
      { placeholder:'e.g. Gicumbi, Rwanda' }));

    root.appendChild(sectionTitle('Photo'));
    const photoWrap = document.createElement('div');
    const pi = document.createElement('input'); pi.type='file'; pi.accept='image/*';
    pi.addEventListener('change', e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { d.personal.photo = r.result; autoSave(); renderForm(); };
      r.readAsDataURL(f);
    });
    photoWrap.appendChild(pi);
    if (d.personal.photo) {
      const img = document.createElement('img'); img.src = d.personal.photo;
      img.style.cssText = 'width:80px;height:80px;border-radius:50%;object-fit:cover;margin-top:8px';
      photoWrap.appendChild(img);
      const rm = document.createElement('button'); rm.className='remove'; rm.textContent='Remove photo';
      rm.addEventListener('click', () => { d.personal.photo=''; autoSave(); renderForm(); });
      photoWrap.appendChild(rm);
    }
    root.appendChild(photoWrap);

    root.appendChild(sectionTitle('Social'));
    root.appendChild(field('LinkedIn', d.personal.social.linkedin, v => { d.personal.social.linkedin = v; autoSave(); }));
    root.appendChild(field('GitHub', d.personal.social.github, v => { d.personal.social.github = v; autoSave(); }));
    root.appendChild(field('Website', d.personal.social.website, v => { d.personal.social.website = v; autoSave(); }));

    root.appendChild(sectionTitle('About'));
    root.appendChild(field('About', d.about, v => { d.about = v; autoSave(); }, { area:true }));

    root.appendChild(sectionTitle('Theme'));
    const sel = document.createElement('select');
    ['modern','forest','royal'].forEach(t => {
      const o = document.createElement('option'); o.value = t; o.textContent = t;
      if (current.theme === t) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', () => { current.theme = sel.value; autoSave(); });
    root.appendChild(sel);

    root.appendChild(sectionTitle('Skills (grouped)'));
    d.skills.forEach((g,i) => {
      root.appendChild(card([
        field('Category', g.category, v => { g.category = v; autoSave(); }, { placeholder:'e.g. Technical' }),
        field('Items (comma separated)', (g.items||[]).join(', '), v => {
          g.items = v.split(',').map(x=>x.trim()).filter(Boolean); autoSave();
        })
      ], () => { d.skills.splice(i,1); autoSave(); renderForm(); }));
    });
    root.appendChild(addBtn('+ Skill group', () => { d.skills.push({ category:'', items:[] }); autoSave(); renderForm(); }));

    root.appendChild(sectionTitle('Projects'));
    d.projects.forEach((p,i) => {
      root.appendChild(card([
        field('Title', p.title, v => { p.title = v; autoSave(); }),
        field('Description', p.description, v => { p.description = v; autoSave(); }, { area:true }),
        field('Link', p.link, v => { p.link = v; autoSave(); }),
        field('Tags (comma separated)', (p.tags||[]).join(', '), v => {
          p.tags = v.split(',').map(x=>x.trim()).filter(Boolean); autoSave();
        })
      ], () => { d.projects.splice(i,1); autoSave(); renderForm(); }));
    });
    root.appendChild(addBtn('+ Project', () => { d.projects.push({ title:'', description:'', link:'', tags:[] }); autoSave(); renderForm(); }));

    root.appendChild(sectionTitle('Experience'));
    d.experience.forEach((e,i) => {
      root.appendChild(card([
        field('Role / Title', e.role, v => { e.role = v; autoSave(); }),
        field('Company / Place', e.company, v => { e.company = v; autoSave(); }),
        field('Period', e.period, v => { e.period = v; autoSave(); }),
        field('Description', e.description, v => { e.description = v; autoSave(); }, { area:true })
      ], () => { d.experience.splice(i,1); autoSave(); renderForm(); }));
    });
    root.appendChild(addBtn('+ Experience', () => { d.experience.push({ role:'', company:'', period:'', description:'' }); autoSave(); renderForm(); }));

    root.appendChild(sectionTitle('Education'));
    d.education.forEach((e,i) => {
      root.appendChild(card([
        field('Degree / Certificate', e.degree, v => { e.degree = v; autoSave(); }),
        field('School', e.school, v => { e.school = v; autoSave(); }),
        field('Period', e.period, v => { e.period = v; autoSave(); }),
        field('Note (optional)', e.note, v => { e.note = v; autoSave(); }, { area:true })
      ], () => { d.education.splice(i,1); autoSave(); renderForm(); }));
    });
    root.appendChild(addBtn('+ Education', () => { d.education.push({ degree:'', school:'', period:'', note:'' }); autoSave(); renderForm(); }));

    root.appendChild(sectionTitle('Certifications'));
    d.certifications.forEach((c,i) => {
      root.appendChild(card([
        field('Name', c.name, v => { c.name = v; autoSave(); }),
        field('Issuer', c.issuer, v => { c.issuer = v; autoSave(); }),
        field('Year', c.year, v => { c.year = v; autoSave(); })
      ], () => { d.certifications.splice(i,1); autoSave(); renderForm(); }));
    });
    root.appendChild(addBtn('+ Certification', () => { d.certifications.push({ name:'', issuer:'', year:'' }); autoSave(); renderForm(); }));

    root.appendChild(sectionTitle('Languages (name:level, comma separated)'));
    root.appendChild(field('Languages', d.languages.map(l => `${l.name}:${l.level}`).join(', '), v => {
      d.languages = v.split(',').map(x=>x.trim()).filter(Boolean).map(s => {
        const [name,level] = s.split(':');
        return { name:(name||'').trim(), level:(level||'').trim() };
      });
      autoSave();
    }, { placeholder:'Kinyarwanda:Native, English:Good, French:Fair' }));

    root.appendChild(sectionTitle('References'));
    d.references.forEach((r,i) => {
      root.appendChild(card([
        field('Name', r.name, v => { r.name = v; autoSave(); }),
        field('Role', r.role, v => { r.role = v; autoSave(); }),
        field('Organization', r.organization, v => { r.organization = v; autoSave(); }),
        field('Phone', r.phone, v => { r.phone = v; autoSave(); })
      ], () => { d.references.splice(i,1); autoSave(); renderForm(); }));
    });
    root.appendChild(addBtn('+ Reference', () => { d.references.push({ name:'', role:'', organization:'', phone:'' }); autoSave(); renderForm(); }));

    root.appendChild(sectionTitle('Hobbies (comma separated)'));
    root.appendChild(field('Hobbies', d.hobbies.join(', '), v => {
      d.hobbies = v.split(',').map(x=>x.trim()).filter(Boolean); autoSave();
    }));
  }

  // ---------- EVENTS & DARK MODE ----------
  const btnTheme = $('btn-theme');
  
  function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    btnTheme.textContent = isDark ? '☀️' : '🌙';
  }

  // Load saved theme
  const isDark = localStorage.getItem('darkMode') === 'true';
  applyTheme(isDark);

  btnTheme.addEventListener('click', () => {
    const nowDark = !document.body.classList.contains('dark');
    applyTheme(nowDark);
    localStorage.setItem('darkMode', nowDark);
  });

  $('new-client').addEventListener('click', () => {
    const name = prompt('Client name:');
    if (name === null) return;
    openClient(Store.create(name.trim() || 'Untitled').id);
  });

  document.querySelectorAll('.tab').forEach(t =>
    t.addEventListener('click', () => switchTab(t.dataset.tab)));

  document.querySelectorAll('[data-home]').forEach(b =>
    b.addEventListener('click', () => { if (current) Store.save(current); refreshList(); show('screen-home'); }));

  $('btn-save').addEventListener('click', () => { if (current) { Store.save(current); alert('Saved.'); } });
  
  $('btn-export-html').addEventListener('click', async () => { 
    if (!current) return; 
    Store.save(current); 
    download(safe(current.data.personal.fullName)+'_portfolio.html', await fullDoc(current), 'text/html'); 
  });

  $('btn-export-pdf').addEventListener('click', async () => {
    if (!current) return; 
    Store.save(current);
    
    const btn = $('btn-export-pdf');
    const originalText = btn.textContent;
    btn.textContent = 'Generating PDF...';
    btn.disabled = true;

    const doc = await fullDoc(current);
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(doc);
    iframeDoc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.error('Print blocked', e);
        alert('Printing is blocked in this preview. Exporting HTML instead.');
        download(safe(current.data.personal.fullName)+'_portfolio.html', doc, 'text/html');
      } finally {
        setTimeout(() => {
          if (iframe.parentNode) document.body.removeChild(iframe);
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1500);
      }
    }, 1000);
  });

  $('btn-export-json').addEventListener('click', () => {
    if (!current) return; Store.save(current);
    download(safe(current.data.personal.fullName)+'_portfolio.json', JSON.stringify(current.data, null, 2), 'application/json');
  });

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});

  refreshList();
})();