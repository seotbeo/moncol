var mobCount = 0;
var rows = 6;
var cols = 8;
var ui = new Array();
var mobList = new Array();
var greyCheck = false;
var loadlist_loadCheck = 0;
var slotMax = 200;

function Mob(target, img, imgG, grey)
{
    this.target = target;
    this.grey = grey;
    this.img = img;
    this.imgG = imgG;
}

function init() {
    // UI 리소스 로딩
    var ui_src = ["resources/ui_none.png", //0
                "resources/ui_1star.png", //1
                "resources/ui_2star.png", //2
                "resources/ui_3star.png", //3
                "resources/ui_4star.png", //4
                "resources/ui_5star.png", //5
                "resources/ui_special.png", //6
                "resources/ui_event.png", //7
                "resources/ui_bg_t.png", //8
                "resources/ui_bg_c.png", //9
                "resources/ui_bg_b.png"]; //10:

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
    const canvas = document.getElementById("preview");
    canvas.addEventListener('click', (event) => {
        var canvasLeft = canvas.offsetLeft + canvas.clientLeft;
        var canvasTop = canvas.offsetTop + canvas.clientTop;
        var x = event.pageX - canvasLeft;
        var y = event.pageY - canvasTop;
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
                    && x > 34 + j * 74 && x < 104 + j * 74)
                {
                    mobList[j + i * cols].grey = !(mobList[j + i * cols].grey);
                    redraw();
                    showAlert(mobList[j + i * cols].target.name);
                    return;
                }
            }
        }
    });

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
    const canvas2 = document.getElementById("preview");
    const ctx = canvas.getContext("2d");

    var count = mobCount * 1;
    var index = 0;
    var bg_c_count = parseInt(rows) - 2;

    canvas.width = canvas2.width = ui[8].width;
    canvas.height = canvas2.height = ui[8].height + ui[9].height * bg_c_count + ui[10].height;
    ctx.drawImage(ui[8], 0, 0);
    for (let i = 0; i < bg_c_count; i++)
    {
        ctx.drawImage(ui[9], 0, ui[8].height + ui[9].height * i);
    }
    ctx.drawImage(ui[10], 0, ui[8].height + ui[9].height * bg_c_count);

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
    redrawMemo();
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

function drawMemo(memo)
{
    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");

    ctx.font = "17px MaplestoryL";
    ctx.fillStyle = "#eeff00";
    ctx.textAlign = "right";
    ctx.letterSpacing = "1px";
    ctx.strokeStyle = "#eeff00";

    ctx.fillText(memo, 635, 35, 525);
}

function addMobToList(mob)
{
    if (mobCount === slotMax)
    {
        showAlert("더 이상 추가할 수 없습니다. (최대 " + slotMax + "칸)");
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
        showAlert("추가할 몬스터가 없습니다.");
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
            mobList[mobCount++] = new Mob(target, mob[0], mob[1], greyCheck);
            
            if (mobCount > rows * cols)
            {
                rowsAutoIncrease(mobCount);
            }
            else redraw();

            showAlert("추가되었습니다. [" + target.name + "]");
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
        showAlert("더 이상 추가할 수 없습니다. (최대 " + slotMax + "칸)");
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
            showAlert("이미지 파일이 아닙니다.");
            return;
        }

        r.readAsDataURL(file);
        r.onload = () => {
            var img = new Image();
            img.src = r.result;

            img.onload = () => {
                showAlert("몬스터 이미지를 변환 중입니다.");
                var img_resize = new Image();
                img_resize.src = edit_resize(img);

                img_resize.onload = () => {
                    var img_grey = new Image();
                    img_grey.src = edit_greyscale(img_resize);

                    img_grey.onload = () => {
                        mobList[mobCount++] = new Mob({ID: 0, src: "", name: mobName, star: star}, img_resize, img_grey, greyCheck);

                        if (mobCount > rows * cols)
                        {
                            rowsAutoIncrease(mobCount);
                        }
                        else redraw();

                        showAlert("추가되었습니다. [" + mobName + "]");
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
        showAlert("삭제할 몬스터가 없습니다.");
        return;
    }

    var mob = mobList.pop();
    mobCount--;
    redraw();
    showAlert("삭제되었습니다. [" + mob.target.name + "]");
}

function save()
{
    const canvas = document.getElementById("preview");
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.setAttribute("download", "monster_collection");
    link.click();
    URL.revokeObjectURL(link.href);
    showAlert("이미지로 저장합니다.");
}

function reset()
{
    showAlert("초기화되었습니다.");
    setRowsSelector(6);
    setRows(6);

    if (mobCount === 0) return;
    mobList.length = 0;
    mobCount = 0;
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
    showAlert("엘리트 몬스터를 불러옵니다.");
    readlist(elite);
}

function savelist()
{
    if (mobCount === 0)
    {
        showAlert("내보낼 몬스터가 없습니다.");
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
        if (mobList[i].target.name == "빈칸") str += "등록";
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
    showAlert("텍스트로 리스트를 내보냅니다.");
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
            showAlert("텍스트 파일이 아닙니다.");
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
    showAlert("몬스터 정보를 확인하는 중입니다.");
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
        showAlert("올바른 파일이 아니거나, 몬스터 정보가 없습니다.");
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
            showAlert("몬스터 이미지를 불러오는 중입니다. [" + ++loadlist_loadCheck + " / " + count + "]");

            if (loadlist_loadCheck == count)
            {
                rowsAutoIncrease(count);
                showAlert("불러오기가 완료되었습니다.");
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