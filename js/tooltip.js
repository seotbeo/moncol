function drawTooltip(name, x, y, w, h) {
    const tooltip = document.getElementById("tooltip");
    const ctx = tooltip.getContext("2d");

    ctx.font = "14px MaplestoryL";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "right";
    ctx.letterSpacing = "1px";
    ctx.strokeStyle = "#eeff00";

    const rv = ctx.measureText(name);
    const fontWidth = Math.ceil(rv.width);
    const fontHeight = Math.ceil(rv.fontBoundingBoxAscent +
        rv.fontBoundingBoxDescent);
    
    var tooltipX = Math.min(x + fontWidth + 26, w);
    var tooltipY = Math.min(y + fontHeight + 26, h);
    
    ctx.drawImage(ui[11], tooltipX - fontWidth - 26, tooltipY - 26); // 상단부
    for (let i = tooltipX - fontWidth - 13; i < tooltipX - 13; i++) {
        ctx.drawImage(ui[12], i, tooltipY - 26);
    }
    ctx.drawImage(ui[13], tooltipX - 13, tooltipY - 26);
    
    ctx.drawImage(ui[17], tooltipX - fontWidth - 26, tooltipY - 13); // 하단부
    for (let i = tooltipX - fontWidth - 13; i < tooltipX - 13; i++) {
        ctx.drawImage(ui[18], i, tooltipY - 13);
    }
    ctx.drawImage(ui[19], tooltipX - 13, tooltipY - 13);

    ctx.fillText(name, tooltipX - 13, tooltipY - 8); // 텍스트
}

function clearTooltip() {
    const tooltip = document.getElementById("tooltip");
    const ctx = tooltip.getContext("2d");
    ctx.clearRect(0, 0, tooltip.width, tooltip.height);
}