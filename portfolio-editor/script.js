try {
    if(localStorage.getItem('port_name')) {
        document.getElementById('inp-name').value = localStorage.getItem('port_name');
        document.getElementById('out-name').innerText = localStorage.getItem('port_name');
    }
} catch(e) {}

document.getElementById('inp-name').addEventListener('input', function(e) {
    let v = e.target.value;
    document.getElementById('out-name').innerText = v === "" ? "Name" : v;
    try { localStorage.setItem('port_name', v); } catch(e) {}
});

document.getElementById('inp-about').addEventListener('input', function(e) {
    let txt = e.target.value;
    document.getElementById('out-about').innerText = txt === "" ? "..." : txt;
});

let tgInp = document.getElementById('inp-tg');
tgInp.oninput = function() {
    let link = document.getElementById('out-tg');
    if(this.value.length > 0) {
        link.style.display = "inline-flex";
        link.href = this.value;
    } else {
        link.style.display = "none";
    }
};

let vkInp = document.getElementById('inp-vk');
vkInp.oninput = function() {
    let link = document.getElementById('out-vk');
    if(this.value.length > 0) {
        link.style.display = "inline-flex";
        link.href = this.value;
    } else {
        link.style.display = "none";
    }
};

let ghInp = document.getElementById('inp-gh');
ghInp.oninput = function() {
    let link = document.getElementById('out-gh');
    if(this.value.length > 0) {
        link.style.display = "inline-flex";
        link.href = this.value;
    } else {
        link.style.display = "none";
    }
};

let siteContainer = document.getElementById('site');

document.getElementById('sel-grad').onchange = function() {
    let currentLay = document.getElementById('sel-lay').value;
    siteContainer.className = "site " + this.value + " " + currentLay;
};

document.getElementById('sel-lay').onchange = function() {
    let currentGrad = document.getElementById('sel-grad').value;
    siteContainer.className = "site " + currentGrad + " " + this.value;
};

let currentAvatarData = "";
document.getElementById('inp-photo').onchange = function(evt) {
    if(!evt.target.files || evt.target.files.length === 0) {
        return;
    }
    let fl = evt.target.files[0];
    if(fl.type.indexOf("image/") !== 0) {
        return;
    }
    let readerObj = new FileReader();
    readerObj.onload = function(readEvent) {
        currentAvatarData = readEvent.target.result;
        document.getElementById('out-photo').src = currentAvatarData;
        document.getElementById('out-photo').style.display = "block";
    };
    readerObj.onerror = function() {
        console.log("err");
    };
    readerObj.readAsDataURL(fl);
};

let projectsWrapper = document.getElementById('out-projects');
let controlsWrapper = document.getElementById('project-list');
let projectCounter = 0;

document.getElementById('btn-add').addEventListener('click', function(e) {
    e.preventDefault();
    projectCounter++;
    let pid = "project_card_" + Date.now() + "_" + projectCounter;

    let prevCard = document.createElement('div');
    prevCard.className = "proj";
    prevCard.id = pid;
    prevCard.style.display = "none";
    projectsWrapper.appendChild(prevCard);

    let ctrlBox = document.createElement('div');
    ctrlBox.className = "p-item";
    ctrlBox.innerHTML = `
        <div class="p-controls">
            <button class="up-btn" title="Вверх">↑</button>
            <button class="dn-btn" title="Вниз">↓</button>
            <button class="del-btn">Удалить</button>
        </div>
        <input class="pj-name" placeholder="Название проекта">
        <textarea class="pj-desc" placeholder="Описание проекта"></textarea>
        <input class="pj-link" placeholder="Ссылка на проект">
        <span style="font-size:12px;display:block;margin-top:6px">Картинка:</span>
        <input type="file" class="pj-file" accept="image/*">
    `;
    controlsWrapper.appendChild(ctrlBox);

    let currentPic = "";

    function syncPreview() {
        let n = ctrlBox.querySelector('.pj-name').value;
        let d = ctrlBox.querySelector('.pj-desc').value;
        let l = ctrlBox.querySelector('.pj-link').value;
        
        if(n.trim() === "") {
            prevCard.innerHTML = "";
            prevCard.style.display = "none";
            return;
        }
        prevCard.style.display = "block";
        
        let builder = "";
        if(currentPic !== "") {
            builder += `<img src="${currentPic}">`;
        }
        builder += `<h3>${n}</h3>`;
        if(d !== "") {
            builder += `<p>${d}</p>`;
        }
        if(l !== "") {
            builder += `<a href="${l}" target="_blank" class="link-btn">Смотреть проект</a>`;
        }
        prevCard.innerHTML = builder;
    }

    ctrlBox.querySelector('.pj-name').oninput = syncPreview;
    ctrlBox.querySelector('.pj-desc').oninput = syncPreview;
    ctrlBox.querySelector('.pj-link').oninput = syncPreview;

    ctrlBox.querySelector('.pj-file').onchange = function(fileEvent) {
        let fileInfo = fileEvent.target.files[0];
        if(fileInfo) {
            if(fileInfo.size > 5000000) {
                this.value = "";
                return;
            }
            let r2 = new FileReader();
            r2.onload = function(re) {
                currentPic = re.target.result;
                syncPreview();
            }
            r2.readAsDataURL(fileInfo);
        }
    };

    ctrlBox.querySelector('.del-btn').onclick = function() {
        controlsWrapper.removeChild(ctrlBox);
        projectsWrapper.removeChild(prevCard);
    };

    ctrlBox.querySelector('.up-btn').onclick = function() {
        let prevCtrl = ctrlBox.previousElementSibling;
        if(prevCtrl) {
            controlsWrapper.insertBefore(ctrlBox, prevCtrl);
            let prevPreview = prevCard.previousElementSibling;
            if(prevPreview) {
                projectsWrapper.insertBefore(prevCard, prevPreview);
            }
        }
    };

    ctrlBox.querySelector('.dn-btn').onclick = function() {
        let nextCtrl = ctrlBox.nextElementSibling;
        if(nextCtrl) {
            controlsWrapper.insertBefore(nextCtrl, ctrlBox);
            let nextPreview = prevCard.nextElementSibling;
            if(nextPreview) {
                projectsWrapper.insertBefore(nextPreview, prevCard);
            }
        }
    };

    syncPreview();
});

document.getElementById('btn-save').addEventListener('click', function() {
    let nameField = document.getElementById('inp-name').value;
    if(nameField.trim() === "") {
        document.getElementById('inp-name').focus();
        return;
    }
    
    let finalStyles = 'body{margin:0;font-family:"Segoe UI",sans-serif}@keyframes bgMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}.site{width:100vw;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:50px 20px;overflow-y:auto;box-sizing:border-box}.card{background:rgba(255,255,255,.92);padding:35px;border-radius:14px;box-shadow:0 8px 20px rgba(0,0,0,.18);width:580px;max-width:95%;margin-bottom:35px;resize:both;overflow:auto}.card>img{width:120px;height:120px;object-fit:cover;border-radius:50%;border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.1)}.info h1{margin:12px 0 8px;font-size:25px;color:#222}.info p{color:#555;line-height:1.5;margin-bottom:18px}.socials a{display:inline-flex;align-items:center;padding:9px 18px;margin:0 10px 8px 0;background:#222;color:#fff;text-decoration:none;border-radius:20px;font-size:13px;font-weight:500}.socials a i{margin-right:6px}.socials a:hover{background:#555}.grad1{background:linear-gradient(-45deg,#667eea,#764ba2,#6B8DD6,#8E37D7);background-size:400% 400%;animation:bgMove 15s ease infinite}.grad2{background:linear-gradient(-45deg,#ff0844,#ffb199,#ff5e62,#ff9966);background-size:400% 400%;animation:bgMove 15s ease infinite}.grad3{background:linear-gradient(-45deg,#0ba360,#3cba92,#00b09b,#96c93d);background-size:400% 400%;animation:bgMove 15s ease infinite}.grad4{background:linear-gradient(-45deg,#434343,#000,#242424,#121212);background-size:400% 400%;animation:bgMove 15s ease infinite}.lay1 .card{text-align:center}.lay1 .card>img{margin:0 auto;display:block}.lay2 .card{display:flex;align-items:center;text-align:left}.lay2 .card>img{margin-right:22px}.lay2 .info h1{margin-top:0}.lay3 .card{display:flex;flex-direction:row-reverse;align-items:center;text-align:right}.lay3 .card>img{margin-left:22px}.lay3 .info h1{margin-top:0}.projects{width:100%;max-width:680px;display:flex;flex-direction:column;gap:18px}.proj{background:rgba(255,255,255,.95);padding:25px;border-radius:10px;box-shadow:0 3px 12px rgba(0,0,0,.08);resize:both;overflow:auto}.proj img{width:100%;border-radius:7px;margin-bottom:12px}.proj h3{margin:0 0 8px;font-size:20px;color:#222}.proj p{font-size:14px;color:#555;margin-bottom:12px;line-height:1.5}.link-btn{display:inline-block;padding:9px 18px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:5px;font-size:13px}@media(max-width:600px){.lay2 .card,.lay3 .card{flex-direction:column;text-align:center}.lay2 .card>img,.lay3 .card>img{margin:0 auto 15px}}';

    let gradVal = document.getElementById('sel-grad').value;
    let layVal = document.getElementById('sel-lay').value;
    let aboutVal = document.getElementById('inp-about').value;
    let tgVal = document.getElementById('inp-tg').value;
    let vkVal = document.getElementById('inp-vk').value;
    let ghVal = document.getElementById('inp-gh').value;
    
    let avatarHtml = currentAvatarData ? `<img src="${currentAvatarData}" alt="">` : "";
    
    let tgHtml = tgVal ? `<a href="${tgVal}" target="_blank"><i class="fi-brands-telegram"></i> Telegram</a>` : "";
    let vkHtml = vkVal ? `<a href="${vkVal}" target="_blank"><i class="fi-brands-vk"></i> VK</a>` : "";
    let ghHtml = ghVal ? `<a href="${ghVal}" target="_blank"><i class="fi-brands-github"></i> GitHub</a>` : "";

    let pageHTML = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Dev Space - ${nameField}</title>
    <link rel="icon" type="image/png" href="../Misc/Dev-Space.png">
    <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css">
    <style>${finalStyles}</style>
</head>
<body>
    <div class="site ${gradVal} ${layVal}">
        <div class="card">
            ${avatarHtml}
            <div class="info">
                <h1>${nameField}</h1>
                <p>${aboutVal}</p>
                <div class="socials">
                    ${tgHtml}
                    ${vkHtml}
                    ${ghHtml}
                </div>
            </div>
        </div>
        <div class="projects">
            ${projectsWrapper.innerHTML}
        </div>
    </div>
</body>
</html>`;

    let blobData = new Blob([pageHTML], { type: "text/html" });
    let objectUrl = URL.createObjectURL(blobData);
    let linkElement = document.createElement("a");
    linkElement.href = objectUrl;
    linkElement.download = "portfolio.html";
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(objectUrl);
});
