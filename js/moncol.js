var mobCount = 0;
var rows = 6;
var cols = 8;
var ui = new Array();
var mobList = new Array();
var greyCheck = false;
var boolSelected = false;
var selectedIndex = 0;
var loadlist_loadCheck = 0;
var slotMax = 200;
var db;
var language = "kr";

class Mob {
    constructor(target, img, imgG, grey) {
        this.target = target;
        this.grey = grey;
        this.img = img;
        this.imgG = imgG;
    }
}

function init() {
    setDB("KMS");
    // UI 리소스 로딩
    const ui_src = ["resources/ui_none.png", //0
                "resources/ui_1star.png", //1
                "resources/ui_2star.png", //2
                "resources/ui_3star.png", //3
                "resources/ui_4star.png", //4
                "resources/ui_5star.png", //5
                "resources/ui_special.png", //6
                "resources/ui_event.png", //7
                "resources/ui_bg_t.png", //8
                "resources/ui_bg_c.png", //9
                "resources/ui_bg_b.png", //10
                "resources/ui_tooltip_nw.png", //11
                "resources/ui_tooltip_n.png", //12
                "resources/ui_tooltip_ne.png", //13
                "resources/ui_tooltip_w.png", //14
                "resources/ui_tooltip_c.png", //15
                "resources/ui_tooltip_e.png", //16
                "resources/ui_tooltip_sw.png", //17
                "resources/ui_tooltip_s.png", //18
                "resources/ui_tooltip_se.png", //19
                "resources/ui_selected.gif", //20
                "resources/ui_bg_tag_G.png", //21
                "resources/ui_bg_tag_J.png", //22
                "resources/ui_bg_tag_T.png"]; //23

    var loadedCount = 0;

    function uiLoaded()
    {
        loadedCount++;
        if (loadedCount === ui_src.length)
        {
            redraw();
        }
    }

    for (var i = 0; i < ui_src.length; i++)
    {
        ui[i] = new Image();
        ui[i].src = ui_src[i];
        ui[i].onload = uiLoaded;
        if (ui[i].complete)
        {
            ui[i].onload();
        }
        else
        {
            ui[i].onload = uiLoaded;
        }
    }
    
    // 캔버스 영역 클릭 이벤트
    const canvas = document.getElementById("tooltip");
    canvas.addEventListener('click', (event) => {
        var x = event.offsetX;
        var y = event.offsetY;
        var count = 0;
        
        if (y < canvas.top && y > canvas.top + canvas.height 
            && x < canvas.left && x > canvas.left + canvas.width)
        {
            return;
        }

        for (let i = 0; i < rows; i++)
        {
            for (let j = 0; j < cols; j++)
            {
                if (++count > mobCount) break;

                if (y > 54 + i * 74 && y < 124 + i * 74
                    && x > 34 + j * 74 && x < 104 + j * 74) {
                    index = j + i * cols;
                    if (boolSelected) {
                        if (selectedIndex == index) break;

                        var move = mobList[selectedIndex];
                        mobList.splice(selectedIndex, 1);
                        mobList.splice(index, 0, move);
                        deselect();
                        showAlert((language == "kr" ?
                                "이동" :
                                "Moved.")
                                + " [" + move.target.name + "]");
                    }
                    else {
                        mobList[index].grey = !(mobList[index].grey);
                        showAlert(mobList[index].target.name);
                    }
                    redraw();
                    return;
                }
            }
        }

        if (boolSelected) {
            deselect();
            showAlert(language == "kr" ?
                    "선택 해제" :
                    "Deselected.");
        }
    });
    
    // 캔버스 영역 우클릭 이벤트
    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // 캔버스 영역 우클릭 메뉴 방지
        var x = event.offsetX;
        var y = event.offsetY;
        var count = 0;
        
        if (y < canvas.top && y > canvas.top + canvas.height 
            && x < canvas.left && x > canvas.left + canvas.width)
        {
            return;
        }

        for (let i = 0; i < rows; i++)
        {
            for (let j = 0; j < cols; j++)
            {
                if (++count > mobCount) break;

                if (y > 54 + i * 74 && y < 124 + i * 74
                    && x > 34 + j * 74 && x < 104 + j * 74)
                {
                    var index = j + i * cols;
                    if (boolSelected) {
                        if (selectedIndex == index) break;

                        [mobList[selectedIndex], mobList[index]] = [mobList[index], mobList[selectedIndex]];
                        deselect();
                        redraw();                        
                        showAlert((language == "kr" ?
                                "교체" :
                                "Replaced.")
                                + " [" + mobList[index].target.name + " ↔ " + mobList[selectedIndex].target.name + "]");
                    }
                    else {
                        selectedIndex = index;
                        boolSelected = true;

                        const divCanvas = document.getElementById("mainCanvas");
                        const selectedImage = document.createElement('img');
                        selectedImage.id = "selectedImage";
                        selectedImage.src = ui[20].src;
                        selectedImage.style.position = "absolute";
                        selectedImage.style.top = 49 + i * 74 + "px";
                        selectedImage.style.left = 29 + j * 74 + "px";
                        selectedImage.style.zIndex = "4";
                        divCanvas.appendChild(selectedImage);

                        showAlert((language == "kr" ?
                                "선택" :
                                "Selected.")
                                + " [" + mobList[index].target.name + "]");
                    }
                    return;
                }
            }
        }

        if (boolSelected) {
            deselect();
            showAlert(language == "kr" ?
                    "선택 해제" :
                    "Deselected.");
        }
    });

    // 캔버스 툴팁 영역 마우스오버 이벤트
    canvas.addEventListener('mousemove', (event) => {
        var x = event.offsetX;
        var y = event.offsetY;
        var count = 0;

        if (y < canvas.top && y > canvas.top + canvas.height 
            && x < canvas.left && x > canvas.left + canvas.width)
        {
            return;
        }

        for (let i = 0; i < rows; i++)
        {
            for (let j = 0; j < cols; j++)
            {
                if (++count > mobCount) return;

                if (y > 54 + i * 74 && y < 124 + i * 74
                    && x > 34 + j * 74 && x < 104 + j * 74) {
                    clearTooltip();
                    drawTooltip(mobList[j + i * cols].target.name, x, y, canvas.width, canvas.height);
                    return;
                }
                else {
                    clearTooltip();
                }
            }
        }
    });

    // server 선택 콤보박스
    const serverSelector = document.getElementById('serv');
    var serv1 = document.createElement("option");
    serv1.value = serv1.innerHTML = "KMS"
    serverSelector.appendChild(serv1);
    var serv2 = document.createElement("option");
    serv2.value = serv2.innerHTML = "JMS"
    serverSelector.appendChild(serv2);
    var serv3 = document.createElement("option");
    serv3.value = serv3.innerHTML = "TMS"
    serverSelector.appendChild(serv3);
    var serv4 = document.createElement("option");
    serv4.value = serv4.innerHTML = "MSEA"
    serverSelector.appendChild(serv4);

    // rows 선택 콤보박스
    const rowsSelector = document.getElementById('rows');
    for (let i = 3; i <= parseInt(slotMax / cols); i++)
    {
        var option = document.createElement("option");
        option.value = i;
        option.innerHTML = (i * cols) + "칸";
        rowsSelector.appendChild(option);
    }
    rowsSelector.options[rows - 3].selected = true;
}

function redraw()
{
    const canvas = document.getElementById("preview");
    const canvasTooltip = document.getElementById("tooltip");
    const canvasSelect = document.getElementById("tooltip");
    const divCanvas = document.getElementById("mainCanvas");
    const ctx = canvas.getContext("2d");

    var count = mobCount * 1;
    var index = 0;
    var bg_c_count = parseInt(rows) - 2;
    
    //canvas.width = canvasTooltip.width = ui[8].width;
    canvas.height = canvasTooltip.height = canvasSelect.height = ui[8].height + ui[9].height * bg_c_count + ui[10].height;
    divCanvas.style.width = canvas.width + "px";
    divCanvas.style.height = canvas.height + "px";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearTooltip();

    ctx.drawImage(ui[8], 0, 0); //배경
    for (let i = 0; i < bg_c_count; i++)
    {
        ctx.drawImage(ui[9], 0, ui[8].height + ui[9].height * i);
    }
    ctx.drawImage(ui[10], 0, ui[8].height + ui[9].height * bg_c_count);

    var serv = document.getElementById("serv").value; //전체보기 서버별로 번역
    switch (serv) {
        case "GMS":
        case "MSEA":
            ctx.drawImage(ui[21], 10, 10);
            break;
        case "JMS":
            ctx.drawImage(ui[22], 10, 10);
            break;
        case "TMS":
            ctx.drawImage(ui[23], 10, 10);
            break;
        default:
            break;
    }

    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            if (count-- > 0)
            {
                drawMob(index++, j, i);
                continue;
            }
            ctx.drawImage(ui[0], 32 + j * 74, 52 + i * 74);
        }
    }
}

function drawMob(index, j, i)
{
    var target = mobList[index].target;

    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");

    var w, h, v;
    v = mobList[index].grey;
    w = mobList[index].img.width;
    h = mobList[index].img.height;
    canvas.setAttribute("image-rendering", "pixelated");
    ctx.drawImage(v === true ? mobList[index].imgG : mobList[index].img, 71 - Math.ceil(w/2) + j * 74, 91 - Math.ceil(h/2) + i * 74, w, h);
    if (target.star == 0) ctx.drawImage(ui[0], 32 + j * 74, 52 + i * 74);
    else ctx.drawImage(ui[target.star], 34 + j * 74, 54 + i * 74);
}

function addMobToList(mob)
{
    if (mobCount === slotMax)
    {
        showAlert(language == "kr" ?
                "더 이상 추가할 수 없습니다. (최대 " + slotMax + "칸)" :
                "Cannot Add More. (Max " + slotMax + "Slots)");
        return;
    }

    if (mob)
    {
        var mobName = mob;
    }
    else
    {
        const text = document.getElementById("search");
        var mobName = text ? text.value : null
    }

    var target = db.find(e => e.name == mobName)
    if (!target)
    {
        showAlert(language == "kr" ?
                "추가할 몬스터가 없습니다." :
                "No Mobs to be Added.");
        return;
    }
    
    document.querySelector("#search").value = "";
    var mob = new Array();
    var mob_src = [target.src.replace(".png", "_fix.png").replace("mob", "mob\\fix")];
    mob_src.push(mob_src[0].replace("_fix.png", "_fix_grey.png").replace("mob\\fix", "mob\\fix\\grey"));

    var loadedCount = 0;

    function mobLoaded()
    {
        loadedCount++;
        if (loadedCount === 2)
        {
            for (var i = 0; i < mob_src.length; i++)
            {
                mob[i].imageSmoothingEnabled = mob[i].oImageSmoothingEnabled = mob[i].mozImageSmoothingEnabled = mob[i].webkitImageSmoothingEnabled = false;
                mob[i].setAttribute("image-rendering", "pixelated");
            }
            
            if (boolSelected) {
                mobCount++;
                mobList.splice(selectedIndex, 0, new Mob(target, mob[0], mob[1], greyCheck));
                deselect();
            }
            else {
                mobList[mobCount++] = new Mob(target, mob[0], mob[1], greyCheck);
            }

            if (mobCount > rows * cols)
            {
                rowsAutoIncrease(mobCount);
            }
            else redraw();

            showAlert((language == "kr" ?
                    "추가되었습니다.":
                    "Added.")
                    + " [" + target.name + "]" );
        }
    }

    for (var i = 0; i < mob_src.length; i++)
    {
        mob[i] = new Image();
        mob[i].src = mob_src[i];
        mob[i].onload = mobLoaded;
        if (mob[i].complete)
        {
            mob[i].onload();
        }
        else
        {
            mob[i].onload = mobLoaded;
        }
    }
}

function addCustomMobToList() // 커스텀 몹
{
    if (mobCount === slotMax)
    {
        showAlert(language == "kr" ?
                "더 이상 추가할 수 없습니다. (최대 " + slotMax + "칸)" :
                "Cannot Add More. (Max " + slotMax + "Slots)");
        return;
    }

    const starsSelector = document.getElementById('stars');
    var star = starsSelector.value;

    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = (event) => {
        var r = new FileReader();
        var file = event.target.files[0];
        var mobName = file.name;

        if (!(file.type.split('/')[0] == "image"))
        {
            showAlert(language == "kr" ?
                    "이미지 파일이 아닙니다." :
                    "This is not Image File.");
            return;
        }

        r.readAsDataURL(file);
        r.onload = () => {
            var img = new Image();
            img.src = r.result;

            img.onload = () => {
                showAlert(language == "kr" ?
                        "몬스터 이미지를 변환 중입니다." :
                        "Converting Images to fit.");
                var img_resize = new Image();
                img_resize.src = edit_resize(img);

                img_resize.onload = () => {
                    var img_grey = new Image();
                    img_grey.src = edit_greyscale(img_resize);

                    img_grey.onload = () => {
                        if (boolSelected) {
                            mobCount++;
                            mobList.splice(selectedIndex, 0, new Mob({ID: 0, src: "", name: mobName, star: star}, img_resize, img_grey, greyCheck));
                            deselect();
                        }
                        else {
                            mobList[mobCount++] = new Mob({ID: 0, src: "", name: mobName, star: star}, img_resize, img_grey, greyCheck);
                        }

                        if (mobCount > rows * cols)
                        {
                            rowsAutoIncrease(mobCount);
                        }
                        else redraw();

                        showAlert((language == "kr" ?
                        "추가되었습니다.":
                        "Added.")
                        + " [" + mobName + "]" );
                    }
                }
            }
        }
    }
}

function delMobToList()
{
    if (mobCount === 0)
    {
        showAlert(language == "kr" ?
                "삭제할 몬스터가 없습니다." :
                "No Mobs to be Deleted.");
        return;
    }

    if (boolSelected) {
        var mob = mobList[selectedIndex];
        mobList.splice(selectedIndex, 1);
        deselect();
    }
    else {
        var mob = mobList.pop();
    }
    mobCount--;
    redraw();
    showAlert((language == "kr" ?
            "삭제되었습니다." :
            "Deleted.")
            + " [" + mob.target.name + "]" );
}

function save()
{
    const canvas = document.getElementById("preview");
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.setAttribute("download", "monster_collection");
    link.click();
    URL.revokeObjectURL(link.href);
    showAlert(language == "kr" ?
            "이미지로 저장합니다." :
            "Save to Image.");
}

function reset()
{
    showAlert(language == "kr" ?
            "초기화되었습니다." :
            "Cleared.");
    
    mobList.length = 0;
    mobCount = 0;
    setRowsSelector(6);
    setRows(6);
    if (boolSelected) deselect();
}

function checkboxGrey(event)
{
    if (event.target.checked) 
    {
        greyCheck = true;
    }
    else
    {
        greyCheck = false;
    }
}

function setRows(value)
{
    rows = value;
    var max = cols * rows;

    if (mobCount > max)
    {
        mobList.length = max;
        mobCount = max;
    }

    redraw();
}

function setRowsSelector(rows)
{
    const rowsSelector = document.getElementById('rows');
    rowsSelector.options[rows - 3].selected = true;
}

function rowsAutoIncrease(count) // calls redraw() in setRows()
{
    setRowsSelector(Math.max(3,Math.ceil(count/8)));
    setRows(Math.max(3,Math.ceil(count/8)));
}

function setElite()
{
    showAlert(language == "kr" ?
            "엘리트 몬스터를 불러옵니다." :
            "Loading Elite Monsters.");
    
    loadlist_loadCheck = 0;
    var loadArray = new Array();

    for (var i = 0; i < elite.length; i++) {
        var target = db.find(e => (e.ID == elite[i].ID) && (e.star == elite[i].star));
        if (!target) {
            target = db.find(e => ["빈칸", "空位", "空白", "Blank"].includes(e.name));
        }
        loadArray.push({target: target, grey: false});
    }
    
    mobList.length = 0;
    mobCount = 0;

    for (let i = 0; i < loadArray.length; i++) {
        loadlist_loadMob(i, loadArray[i].target, loadArray[i].grey, loadArray.length);
    }
}

function savelist()
{
    if (mobCount === 0)
    {
        showAlert(language == "kr" ?
                "내보낼 몬스터가 없습니다." :
                "No Mobs to be Exported.");
        return;
    }

    var outputStr = "";

    for (let i = 0; i < mobList.length; i++)
    {
        var str = "";
        str += String(i + 1).padStart(3, "0");
        str += " : ";
        str += mobList[i].target.name;
        str += " / ";
        if (["빈칸", "空位", "空白", "Blank"].includes(mobList[i].target.name)) str += "등록";
        else str += mobList[i].grey === true ? "미등록" : "등록";
        str += "\n";
        outputStr += str;
    }

    var d = new Date();
    var date = String(d.getFullYear()) +
        String(d.getMonth()).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0") +
        "_" +
        String(d.getHours()).padStart(2, "0") +
        String(d.getMinutes()).padStart(2, "0") +
        String(d.getSeconds()).padStart(2, "0");

    const link = document.createElement("a");
    const file = new Blob([outputStr], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.setAttribute("download", "몬스터컬렉션_" + date);
    link.click();
    URL.revokeObjectURL(link.href);
    showAlert(language == "kr" ?
            "텍스트로 리스트를 내보냅니다." :
            "List Exported to Txt.");
}

function loadlist()
{
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";
    input.click();
    input.onchange = (event) => {
        var r = new FileReader();
        var file = event.target.files[0];

        if (!(file.type == "text/plain"))
        {
            showAlert(language == "kr" ?
                    "텍스트 파일이 아닙니다." :
                    "This is not Text File.");
            return;
        }
        
        r.readAsText(file,"UTF-8");
        r.onload = () => {
            readlist(r.result);
        }
    }
}

function readlist(list)
{
    showAlert(language == "kr" ?
            "몬스터 정보를 확인하는 중입니다." :
            "Checking Mob Infos.");
    var t = list.split('\n', slotMax);
    var len = t.length; //목록 길이
    if (len == 0) return;

    loadlist_loadCheck = 0;
    var loadArray = new Array();

    for (let i = 0; i < len; i++)
    {
        var k = t[i].split(':');
        if  (k.length !== 2) //[(conut), [(name), (collect)]]
        {
            continue;
        }

        var l = k[1].split("/");
        if (l.length !== 2) //[(name), (collect)]
        {
            continue;
        }

        var target = db.find(e => e.name == l[0].trim()) //name
        if (!target)
        {
            continue;
        }
        
        var collect = l[1].trim(); //collect
        if (collect === "미등록")
        {
            var grey = true;
        }
        else if (collect === "등록")
        {
            var grey = false;
        }
        else
        {
            continue;
        }
        
        loadArray.push({target: target, grey: grey});
    }

    if (loadArray.length === 0)
    {
        showAlert(language == "kr" ?
                "올바른 파일이 아니거나, 몬스터 정보가 없습니다." :
                "This is not the right file, or there is no mob infos.");
        return;
    }

    //reset();
    mobList.length = 0;
    mobCount = 0;

    for (let i = 0; i < loadArray.length; i++)
    {
        loadlist_loadMob(i, loadArray[i].target, loadArray[i].grey, loadArray.length);
    }
}

function loadlist_loadMob(index, target, grey, count)
{
    var mob = new Array();
    var mob_src = [target.src.replace(".png", "_fix.png").replace("mob", "mob\\fix")];
    mob_src.push(mob_src[0].replace("_fix.png", "_fix_grey.png").replace("mob\\fix", "mob\\fix\\grey"));

    var loadedCount = 0;

    function mobLoaded()
    {
        loadedCount++;
        if (loadedCount == 2)
        {
            for (var j = 0; j < mob_src.length; j++)
            {
                mob[j].imageSmoothingEnabled = mob[j].oImageSmoothingEnabled = mob[j].mozImageSmoothingEnabled = mob[j].webkitImageSmoothingEnabled = false;
                mob[j].setAttribute("image-rendering", "pixelated");
            }
            mobList[index] = new Mob(target, mob[0], mob[1], grey);
            mobCount++;
            showAlert((language == "kr" ?
                    "몬스터 이미지를 불러오는 중입니다." :
                    "Loading Monster Image.")
                    + " [" + ++loadlist_loadCheck + " / " + count + "]");

            if (loadlist_loadCheck == count)
            {
                rowsAutoIncrease(count);
                showAlert(language == "kr" ?
                        "불러오기가 완료되었습니다." :
                        "All Loaded.");
            }
        }
    }

    for (var j = 0; j < mob_src.length; j++)
    {
        mob[j] = new Image();
        mob[j].src = mob_src[j];
        mob[j].onload = mobLoaded;
        if (mob[j].complete)
        {
            mob[j].onload();
        }
        else
        {
            mob[j].onload = mobLoaded;
        }
    }
}

function deselect() {
    const selectedImage = document.getElementById("selectedImage");
    selectedImage.remove();
    boolSelected = false;
}

function setServer(server) {
    reset();
    setDB(server);
    setLanguages(server);
    showAlert("Set the data to " + server);
}

function setLanguages(server) {
    const prefix = '[id^="';
    const suffix = '"]';
    const languages = {
        kr: {
            label_serv: "서버",
            label_grey: "흑백으로 추가",
            label_rows: "슬롯",
            label_stars: "별",
            button_elite: "기본 엘리트 몬스터 불러오기",
            button_localimg: "로컬 이미지를 몬스터로 추가",
            button_add: "추가",
            button_delete: "삭제",
            button_reset: "초기화",
            button_save: "이미지저장",
            button_savelist: "내보내기",
            button_loadlist: "불러오기",
            memo: "메모",
            search: "몬스터 이름을 입력하세요",
        },
        en: {
            label_serv: "Server",
            label_grey: "Not Collected",
            label_rows: "Slots",
            label_stars: "Stars",
            button_elite: "Load Elite Mobs",
            button_localimg: "Add Mob with Local Image",
            button_add: "Add",
            button_delete: "Delete",
            button_reset: "Clear",
            button_save: "Save Image",
            button_savelist: "Export",
            button_loadlist: "Import",
            memo: "Memo",
            search: "Input Monster Name",
        },
    };

    if (server != "KMS") language = "en";
    else language = "kr";

    var queryStr = "";
    const elements = Object.keys(languages["kr"]);
    for (let i = 0; i < elements.length;) {
        queryStr = queryStr + prefix + elements[i] + suffix;
        if (++i < elements.length) {
            queryStr += ", ";
        }
    }

    const textElements = document.querySelectorAll(queryStr);
    textElements.forEach((element) => {
        const textId = element.id;
        if (element.tagName.toLowerCase() == "input") {
            element.placeholder = languages[language][textId];
        }
        else element.textContent = languages[language][textId];
    });
}