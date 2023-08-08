const $memo = document.querySelector("#memo");

$memo.onkeyup = () => {
    const memo = $memo.value.trim();
    drawMemo(memo);
}