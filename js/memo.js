const $memo = document.querySelector("#memo");

$memo.onkeyup = () => {
    redraw();
}

function redrawMemo()
{
    const memo = $memo.value.trim();
    drawMemo(memo);
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