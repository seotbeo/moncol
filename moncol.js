var mobCount = 0;
var rows = 6;
var cols = 8;
var ui = new Array();
var mobList = new Array();
var greyCheck = false;
var loadlist_loadCheck = 0;

function Mob(target, img, imgG, grey)
{
    this.target = target;
    this.grey = grey;
    this.img = img;
    this.imgG = imgG;
}

function init() {
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
                    return;
                }
            }
        }
    });
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

    ctx.font = "17px SeoulNamsan"; //https://www.seoul.go.kr/seoul/font.do
    ctx.fillStyle = "#eeff00";
    ctx.textAlign = "right";
    ctx.letterSpacing = "1px";
    ctx.strokeStyle = "#eeff00";

    ctx.fillText(memo, 635, 34, 525);
    ctx.fillText(memo, 635, 33, 525);
}

function addMobToList(mob)
{
    if (mobCount === rows * cols) return;
    if (mob)
    {
        mobName = mob;
    }
    else
    {
        const text = document.getElementById("search");
        var mobName = text ? text.value : null
    }
    var target = db.find(e => e.name == mobName)
    if (!target)
    {
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
            redraw();
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

function delMobToList()
{
    if (mobCount === 0) return;

    mobList.pop();
    mobCount--;
    init();
}

function save()
{
    const canvas = document.getElementById("preview");
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.setAttribute("download", "monster_collection");
    link.click();
    URL.revokeObjectURL(link.href);
}

function reset()
{
    if (mobCount === 0) return;
    
    mobList.length = 0;
    mobCount = 0;
    redraw();
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

function setElite()
{
    const rowsSelect = document.getElementById('rows');
    rowsSelect.options[9].selected = true;
    setRows(12);
    readlist(elite);
}

function savelist()
{
    if (mobList.length === 0) return;

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
}

function loadlist()
{
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";
    input.click();
    input.onchange = (event) => {
        var r = new FileReader();
        r.readAsText(event.target.files[0],"UTF-8");
        r.onload = () => {
            readlist(r.result);
        }
    }
}

function readlist(list)
{
    var t = list.split('\n', cols * rows);
    len = t.length; //목록 길이
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
    if (loadArray.length === 0) return;

    reset();
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
            loadlist_loadCheck++;

            if (loadlist_loadCheck == count)
            {
                redraw();
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