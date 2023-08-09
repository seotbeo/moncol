const $memo = document.querySelector("#memo");

$memo.onkeyup = () => {
    redraw();
}

function redrawMemo()
{
    const memo = $memo.value.trim();
    drawMemo(memo);
}