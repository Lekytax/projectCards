function main() {
    clearCanvas();
    var canvas = document.getElementById('glCanvas');
    canvas.width = 5000;
    canvas.height = 3000;
    const image = new Image();
    image.src = 'cards.png'; // MUST BE SAME DOMAIN!!!
    image.onload = function () {
        var cartes = Array(4);
        for (color = 0; color < 4; color++) {
            cartes[color] = Array(13);
            for (value = 0; value < 13; value++) {
                cartes[color][value] = new Carte(color, value, 0, 0);
            }
        }

        //valeur = -1;
        // couleur = -1;
        //cartes.forEach(element => {
        //couleur++;
        //valeur = -1;
        //element.forEach(carte => {
        //valeur++;
        //render(image, 334, 440, 334 * valeur, 440 * couleur, carte);
        //});
        // });
        canvas.addEventListener("mousemove", updateCoords, false);
        function updateCoords(event) {
            x = event.pageX;
            y = event.pageY;
        }

        canvas.addEventListener("click", function (event) {
            cartes.forEach(obj => {
                obj.forEach(carte => {
                    console.log(x, y);
                    console.log(carte.posX, carte.posY);
                    if (x >= carte.posX && x <= carte.posX + 334 && y >= carte.posY && y <= carte.posY + 440);
                })


            });
        });
        function printCard(string, posInitialX, posInitialY) {
            var carteAAfficher = determinerCarte(string);
            console.log(carteAAfficher);
            var pos = 1;
            carteAAfficher.forEach(value => {

                var tableauDeValeur = numberAsStringToNumber(value);
                console.log(tableauDeValeur);
                if (value.length == 2) {
                    render(image, 334, 440, posInitialX * pos, posInitialY, cartes[tableauDeValeur[1]][tableauDeValeur[0]]);
                    cartes[tableauDeValeur[1]][tableauDeValeur[0]].posX = posInitialX * pos;
                    cartes[tableauDeValeur[1]][tableauDeValeur[0]].posY = posInitialY;
                }

                else {
                    render(image, 334, 440, posInitialX * pos, posInitialY, cartes[tableauDeValeur[1]][tableauDeValeur[0]]);
                    cartes[tableauDeValeur[1]][tableauDeValeur[0]].posX = posInitialX * pos;
                    cartes[tableauDeValeur[1]][tableauDeValeur[0]].posY = posInitialY;

                }
                pos++;

            });
        }


        function numberAsStringToNumber(number) {
            intArray = [];
            for (i = 0; i < number.length; i++) {
                if (number.length == 2) {
                    // convert number to a string, then extract the first digit
                    var string = number.charAt(i);

                    // convert the first digit back to an integer
                    intArray.push(Number(string));
                }
                if (number.length == 3) {
                    // convert number to a string, then extract the first digit
                    var string = number.charAt(i) + number.charAt(i + 1);

                    // convert the first digit back to an integer
                    intArray.push(Number(string));
                    i++

                }

            }

            return intArray;

        }

        printCard("As 6s Ks 2c Tc Ad 7d Qd 6h Kh", 334, 1);
    };



}

function determinerCarte(chaineDeCaractere) {
    var tableauValue = [];
    var carteValue = "";
    twoChar = 0;
    for (i = 0; i < chaineDeCaractere.length; i++) {
        twoChar++;
        switch (chaineDeCaractere[i]) {
            case 'A':
                carteValue += "0";
                break;
            case 'K':
                carteValue += "12";
                break;
            case 'Q':
                carteValue += "11";
                break;
            case 'V':
                carteValue += "10"
                break;
            case 'T':
                carteValue += "9"
                break;
            case ' ':
                carteValue = "";
                twoChar = 0;
                break;
            case 's':
                carteValue += "0";
                break;
            case 'c':
                carteValue += "1"
                break;
            case 'd':
                carteValue += "2"
                break;
            case 'h':
                carteValue += "3"
                break;
            default:
                carteValue += chaineDeCaractere[i] - 1;
                break;
        }
        if (twoChar == 2) {
            tableauValue.push(carteValue);
            twoChar = 0;

        }

    }
    return tableauValue;

}


class Carte {
    constructor(color, value) {
        this.color = color;
        this.value = value;
        this.posX = 0;
        this.posY = 0;
    }

}


function clearCanvas() {
    var canvas = document.getElementById("glCanvas");
    var gl = canvas.getContext("experimental-webgl");
    if (!gl) {
        console.log("Cela ne marche pas");
        return;
    }
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}


function render(image, width, height, x, y, carte) {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById("glCanvas");
    var gl = canvas.getContext("experimental-webgl");
    if (!gl) {
        console.log("Cela ne marche pas");
        return;
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // Create a buffer to put three 2d clip space points in
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set a rectangle the same size as the image.
    setRectangle(gl, x, y, width, height);

    // provide texture coordinates for the rectangle.
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        334 * carte.value / 4342, 440 * carte.color / 1760, //Point en haut a gauche (Triangle gauche)
        334 * (carte.value + 1) / 4342, 440 * carte.color / 1760, // Point en haut a droite (Triangle gauche)
        334 * carte.value / 4342, 440 * (carte.color + 1) / 1760, //Point en bas a gauche (Triangle gauche)
        334 * carte.value / 4342, 440 * (carte.color + 1) / 1760, //Point en bas a gauche (Triangle droit)
        334 * (carte.value + 1) / 4342, 440 * carte.color / 1760, //Point en haut a droite (Triangle droit)
        334 * (carte.value + 1) / 4342, 440 * (carte.color + 1) / 1760, //Point en bas a droite (Triangle droit)
    ]), gl.STATIC_DRAW);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);



    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texcoordLocation);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texcoordLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}

function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}








