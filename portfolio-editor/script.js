// Onboarding Modal
if(!localStorage.getItem('devspace_onboarding_done')) {
    document.getElementById('onboarding-modal').style.display = 'flex';
}
document.getElementById('btn-start-tour').onclick = function() {
    document.getElementById('onboarding-modal').style.display = 'none';
    localStorage.setItem('devspace_onboarding_done', 'true');
}

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Basic Info Sync
const syncText = (inpId, outId, defaultText) => {
    const inp = document.getElementById(inpId);
    const out = document.getElementById(outId);
    inp.addEventListener('input', (e) => {
        out.innerText = e.target.value.trim() === "" ? defaultText : e.target.value;
    });
}

syncText('inp-name', 'out-name', 'Имя Фамилия');
syncText('inp-title', 'out-title', 'Frontend Developer');
syncText('inp-about', 'out-about', 'Тут будет текст о вас...');

// Social Links Sync
const syncSocial = (inpId, outId) => {
    const inp = document.getElementById(inpId);
    const out = document.getElementById(outId);
    inp.addEventListener('input', () => {
        if(inp.value.trim() !== "") {
            out.style.display = ""; // clears inline display so css handles it (inline-flex or block)
            out.href = inp.value.trim();
        } else {
            out.style.display = "none";
        }
    });
}

syncSocial('inp-tg', 'out-tg');
syncSocial('inp-gh', 'out-gh');
syncSocial('inp-li', 'out-li');

// Avatar
let currentAvatarData = "";
document.getElementById('inp-photo').onchange = function(evt) {
    if(!evt.target.files || evt.target.files.length === 0) return;
    let fl = evt.target.files[0];
    if(fl.type.indexOf("image/") !== 0) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        currentAvatarData = e.target.result;
        document.getElementById('out-photo').src = currentAvatarData;
        document.getElementById('out-photo').style.display = "block";
    };
    reader.readAsDataURL(fl);
};

// Skills Manager
let skills = [];
const renderSkills = () => {
    const list = document.getElementById('skills-list');
    const outList = document.getElementById('out-skills');
    const outSection = document.getElementById('section-skills');
    
    list.innerHTML = "";
    outList.innerHTML = "";
    
    if(skills.length === 0) {
        outSection.style.display = "none";
        return;
    }
    
    outSection.style.display = "block";
    skills.forEach((sk, idx) => {
        // Edit panel
        const tag = document.createElement('div');
        tag.className = 'tag-item';
        tag.innerHTML = `${sk} <span class="del-tag" data-idx="${idx}">&times;</span>`;
        list.appendChild(tag);
        
        // Preview
        const outTag = document.createElement('div');
        outTag.className = 'out-skill';
        outTag.innerText = sk;
        outList.appendChild(outTag);
    });
    
    document.querySelectorAll('.del-tag').forEach(btn => {
        btn.onclick = (e) => {
            skills.splice(e.target.dataset.idx, 1);
            renderSkills();
        }
    });
};

document.getElementById('btn-add-skill').onclick = () => {
    const inp = document.getElementById('inp-skill-name');
    const val = inp.value.trim();
    if(val) {
        skills.push(val);
        inp.value = "";
        renderSkills();
    }
};

// Listen to enter key for skill add
document.getElementById('inp-skill-name').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-add-skill').click();
    }
});

// Experience Manager
let expList = [];
let expCounter = 0;
const renderExp = () => {
    const list = document.getElementById('exp-list');
    const outList = document.getElementById('out-exp');
    const outSection = document.getElementById('section-exp');
    
    list.innerHTML = "";
    outList.innerHTML = "";
    
    if(expList.length === 0) {
        outSection.style.display = "none";
        return;
    }
    
    outSection.style.display = "block";
    expList.forEach((exp) => {
        // Panel UI
        const item = document.createElement('div');
        item.className = 'p-item';
        item.innerHTML = `
            <div class="p-controls">
                <button class="up-btn" data-id="${exp.id}">&#8593;</button>
                <button class="dn-btn" data-id="${exp.id}">&#8595;</button>
                <button class="del-btn" data-id="${exp.id}">Удалить</button>
            </div>
            <input type="text" class="field exp-inp-date" placeholder="Годы (например: 2021 - 2023)" value="${exp.date}">
            <input type="text" class="field exp-inp-title" placeholder="Должность / Учебное заведение" value="${exp.title}">
            <textarea class="field exp-inp-desc" placeholder="Описание...">${exp.desc}</textarea>
        `;
        list.appendChild(item);
        
        // Listeners for live sync
        item.querySelector('.exp-inp-date').oninput = (e) => { exp.date = e.target.value; updateOutExp(); };
        item.querySelector('.exp-inp-title').oninput = (e) => { exp.title = e.target.value; updateOutExp(); };
        item.querySelector('.exp-inp-desc').oninput = (e) => { exp.desc = e.target.value; updateOutExp(); };
        
        item.querySelector('.del-btn').onclick = () => {
            expList = expList.filter(x => x.id !== exp.id);
            renderExp();
        };
        item.querySelector('.up-btn').onclick = () => {
            const idx = expList.findIndex(x => x.id === exp.id);
            if (idx > 0) {
                [expList[idx - 1], expList[idx]] = [expList[idx], expList[idx - 1]];
                renderExp();
            }
        };
        item.querySelector('.dn-btn').onclick = () => {
            const idx = expList.findIndex(x => x.id === exp.id);
            if (idx < expList.length - 1) {
                [expList[idx + 1], expList[idx]] = [expList[idx], expList[idx + 1]];
                renderExp();
            }
        };
    });
    updateOutExp();
};

const updateOutExp = () => {
    const outList = document.getElementById('out-exp');
    outList.innerHTML = "";
    expList.forEach(exp => {
        if(exp.title || exp.desc || exp.date) {
            const outItem = document.createElement('div');
            outItem.className = 'out-exp-item';
            outItem.innerHTML = `
                ${exp.date ? `<div class="out-exp-date">${exp.date}</div>` : ''}
                ${exp.title ? `<div class="out-exp-title">${exp.title}</div>` : ''}
                ${exp.desc ? `<div class="out-exp-desc">${exp.desc}</div>` : ''}
            `;
            outList.appendChild(outItem);
        }
    });
}

document.getElementById('btn-add-exp').onclick = () => {
    expCounter++;
    expList.push({ id: expCounter, date: "", title: "", desc: "" });
    renderExp();
};

// Projects Manager
let projects = [];
let projCounter = 0;
const renderProjects = () => {
    const list = document.getElementById('project-list');
    const outList = document.getElementById('out-projects');
    const outSection = document.getElementById('section-projects');
    
    list.innerHTML = "";
    outList.innerHTML = "";
    
    if(projects.length === 0) {
        outSection.style.display = "none";
        return;
    }
    
    outSection.style.display = "block";
    projects.forEach((proj) => {
        const item = document.createElement('div');
        item.className = 'p-item';
        item.innerHTML = `
            <div class="p-controls">
                <button class="up-btn" data-id="${proj.id}">&#8593;</button>
                <button class="dn-btn" data-id="${proj.id}">&#8595;</button>
                <button class="del-btn" data-id="${proj.id}">Удалить</button>
            </div>
            <input type="text" class="field proj-name" placeholder="Название проекта" value="${proj.name}">
            <textarea class="field proj-desc" placeholder="Описание проекта">${proj.desc}</textarea>
            <input type="text" class="field proj-link" placeholder="Ссылка на проект" value="${proj.link}">
            <span style="font-size:12px;display:block;margin-top:6px; margin-bottom: 4px;">Скриншот:</span>
            <input type="file" class="field proj-file" accept="image/*">
        `;
        list.appendChild(item);
        
        item.querySelector('.proj-name').oninput = (e) => { proj.name = e.target.value; updateOutProj(); };
        item.querySelector('.proj-desc').oninput = (e) => { proj.desc = e.target.value; updateOutProj(); };
        item.querySelector('.proj-link').oninput = (e) => { proj.link = e.target.value; updateOutProj(); };
        
        item.querySelector('.proj-file').onchange = (e) => {
            if(e.target.files[0]) {
                const r = new FileReader();
                r.onload = (re) => { proj.img = re.target.result; updateOutProj(); };
                r.readAsDataURL(e.target.files[0]);
            }
        };
        
        item.querySelector('.del-btn').onclick = () => {
            projects = projects.filter(x => x.id !== proj.id);
            renderProjects();
        };
        item.querySelector('.up-btn').onclick = () => {
            const idx = projects.findIndex(x => x.id === proj.id);
            if (idx > 0) {
                [projects[idx - 1], projects[idx]] = [projects[idx], projects[idx - 1]];
                renderProjects();
            }
        };
        item.querySelector('.dn-btn').onclick = () => {
            const idx = projects.findIndex(x => x.id === proj.id);
            if (idx < projects.length - 1) {
                [projects[idx + 1], projects[idx]] = [projects[idx], projects[idx + 1]];
                renderProjects();
            }
        };
    });
    updateOutProj();
}

const updateOutProj = () => {
    const outList = document.getElementById('out-projects');
    outList.innerHTML = "";
    projects.forEach(proj => {
        if(proj.name || proj.desc) {
            const outItem = document.createElement('div');
            outItem.className = 'proj';
            let html = "";
            if(proj.img) html += `<img src="${proj.img}" alt="Screenshot">`;
            if(proj.name) html += `<h3>${proj.name}</h3>`;
            if(proj.desc) html += `<p>${proj.desc}</p>`;
            if(proj.link) html += `<a href="${proj.link}" target="_blank" class="link-btn">Смотреть проект</a>`;
            outItem.innerHTML = html;
            outList.appendChild(outItem);
        }
    });
}

document.getElementById('btn-add').onclick = () => {
    projCounter++;
    projects.push({ id: projCounter, name: "", desc: "", link: "", img: "" });
    renderProjects();
};

// Design Settings
const siteContainer = document.getElementById('site');

const updateSiteClasses = () => {
    const theme = document.getElementById('sel-theme').value;
    const anim = document.getElementById('sel-anim') ? document.getElementById('sel-anim').value : 'anim-none';
    siteContainer.className = `site ${theme} ${anim}`;
    
    // In editor preview, just make everything visible instantly to avoid confusion
    document.querySelectorAll('.proj, .out-exp-item, .out-skill').forEach(el => el.classList.add('visible'));
};

document.getElementById('sel-theme').onchange = updateSiteClasses;

if(document.getElementById('sel-anim')) {
    document.getElementById('sel-anim').onchange = updateSiteClasses;
}

document.getElementById('sel-font').onchange = (e) => {
    siteContainer.style.fontFamily = e.target.value;
};

// Ensure initially updated
updateSiteClasses();

// Save & Export
document.getElementById('btn-save').addEventListener('click', () => {
    fetch('style.css')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then(cssContent => generateHTML(cssContent))
        .catch(() => {
            // Fallback just in case we are on file:// protocol and fetch fails
            let styles = "";
            for (let i = 0; i < document.styleSheets.length; i++) {
                try {
                    let sheet = document.styleSheets[i];
                    if (sheet.href && sheet.href.includes('style.css')) {
                        let rules = sheet.cssRules || sheet.rules;
                        for (let j = 0; j < rules.length; j++) {
                            styles += rules[j].cssText + "\n";
                        }
                    }
                } catch (e) {
                    console.warn("Could not read stylesheet", e);
                }
            }
            if(styles) {
                generateHTML(styles);
            } else {
                alert('Пожалуйста, запустите редактор через локальный веб-сервер, чтобы функция экспорта работала корректно.');
            }
        });
});

function generateHTML(baseCSS) {
    // Only extract the THEMES FOR PREVIEW AND EXPORT section to avoid exporting editor UI styles
    let exportCSS = baseCSS;
    if(baseCSS.includes('/* ========================================================')) {
        exportCSS = baseCSS.split('/* ========================================================')[1];
    }
    
    const fontLink = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">`;
    const iconsLink = `<link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css">`;
    
    const siteContent = document.getElementById('site').cloneNode(true);
    siteContent.removeAttribute('id');
    
    // In exported HTML, we want the body to be the container
    const selectedTheme = document.getElementById('sel-theme').value;
    const selectedFont = document.getElementById('sel-font').value;
    const selectedAnim = document.getElementById('sel-anim') ? document.getElementById('sel-anim').value : 'anim-none';
    
    let observerScript = "";
    if (selectedAnim !== 'anim-none') {
        observerScript = `
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

            document.querySelectorAll('.proj, .out-exp-item, .out-skill').forEach(el => {
                el.classList.remove('visible'); // initial hide
                observer.observe(el);
            });
        });
    </script>`;
    }
    
    const htmlTemplate = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.getElementById('inp-name').value || 'Портфолио'} - ${document.getElementById('inp-title').value || ''}</title>
    ${fontLink}
    ${iconsLink}
    <style>
        body { margin: 0; padding: 0; overflow-x: hidden; font-family: ${selectedFont}; }
        /* Exported Styles */
        ${exportCSS}
    </style>
</head>
<body>
    ${siteContent.outerHTML}
    ${observerScript}
</body>
</html>`;

    let blobData = new Blob([htmlTemplate], { type: "text/html" });
    let objectUrl = URL.createObjectURL(blobData);
    let linkElement = document.createElement("a");
    linkElement.href = objectUrl;
    linkElement.download = "portfolio.html";
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(objectUrl);
}
