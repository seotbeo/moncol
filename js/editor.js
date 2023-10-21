function round_custom(a)
{
    var t = 0.985;
    if (a % 1 >= t)
    {
        return Math.ceil(a);
    }
    else
    {
        return Math.floor(a);
    }
}

function edit_resize(img) // 리사이징
{
    var canvas = document.createElement("canvas");
    var resultCanvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const resultCtx = resultCanvas.getContext("2d");

    var imgw = img.width;
    var imgh = img.height;
    var rvw = 1;
    var rvh = 1;

    canvas.width = imgw;
    canvas.height = imgh;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    if (imgw <= 64 && imgh <= 64)
    {
        resultCanvas.width = imgw;
        resultCanvas.height = imgh;
    }
    else if (imgw > imgh)
    {
        rvw = imgw / 64;
        tmp = Math.floor((64 * imgh) / imgw);
        rvh = imgh / tmp;
        
        resultCanvas.width = 64;
        resultCanvas.height = tmp;
    }
    else
    {
        rvh = imgh / 64;
        tmp = Math.floor((64 * imgw) / imgh);
        rvw = imgw / tmp;
        
        resultCanvas.width = tmp;
        resultCanvas.height = 64;
    }
    
    const resultData = new Uint8ClampedArray(resultCanvas.width * resultCanvas.height * 4);

    for (let i = 0; i < resultCanvas.width; i++)
    {
        for (let j = 0; j < resultCanvas.height; j++)
        {
            var refx = round_custom(i*rvw);
            var refy = round_custom(j*rvh);
            var index = (i + j * resultCanvas.width) * 4;
            var refindex = (refx + refy * canvas.width) * 4;

            resultData[index] = data[refindex];
            resultData[index + 1] = data[refindex + 1];
            resultData[index + 2] = data[refindex + 2];
            resultData[index + 3] = data[refindex + 3];
        }
    }

    if (resultCanvas.width >= 57 && resultCanvas.height >= 61)
    {
        for (let i = 57; i < resultCanvas.width; i++)
        {
            for (let j = 61; j < resultCanvas.height; j++)
            {
                var index = (i + j * resultCanvas.width) * 4;

                resultData[index + 3] = 0;
            }
        }
    }

    const resultImageData = new ImageData(resultData, resultCanvas.width);
    resultCtx.putImageData(resultImageData, 0, 0);

    return resultCanvas.toDataURL();
}

function edit_greyscale(img) // 흑백으로
{
    var canvas = document.createElement("canvas");
    var resultCanvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const resultCtx = resultCanvas.getContext("2d");

    var imgw = img.width;
    var imgh = img.height;

    canvas.width = imgw;
    canvas.height = imgh;
    resultCanvas.width = imgw;
    resultCanvas.height = imgh;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < resultCanvas.width; i++)
    {
        for (let j = 0; j < resultCanvas.height; j++)
        {
            var index = (i + j * resultCanvas.width) * 4;
            var avg = (data[index] + data[index + 1] + data[index + 2]) / 3;
            data[index] = avg;
            data[index + 1] = avg;
            data[index + 2]= avg;
            data[index + 3] = parseInt(data[index + 3] * 0.4);
        }
    }
    resultCtx.putImageData(imageData, 0, 0);

    return resultCanvas.toDataURL();
}