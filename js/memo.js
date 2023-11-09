function drawMemo(value) {
    clearMemo();
    
    const canvas = document.getElementById("memoCanvas");
    const ctx = canvas.getContext("2d");
    const memotext = value.trim();

    ctx.font = "17px MaplestoryOTFLight";
    ctx.fillStyle = "#eeff00";
    ctx.textAlign = "right";
    ctx.letterSpacing = "1px";
    ctx.strokeStyle = "#eeff00";

    ctx.fillText(memotext, 635, 35, 525);
}

function clearMemo() {
    const canvas = document.getElementById("memoCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}