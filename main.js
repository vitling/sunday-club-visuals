function start() {
    const canvas = document.getElementById("mainCanvas");
    const buffer = document.getElementById("buffer");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    buffer.width = canvas.width;
    buffer.height = canvas.height;

    const tau = Math.PI * 2;

    const g = canvas.getContext("2d");
    const bg = buffer.getContext("2d");

    const w = canvas.width;
    const h = canvas.height;
    const ratio = w/h;
    const sf = Math.min(w, h)/2;

    const fps = 40;

    const keyPressActions = {};

    function bindKeyPress(key, action) {
        keyPressActions[key] = action;
    }

    function unbindKeyPress(key) {
        delete(keyPressActions[key]);
    }

    window.addEventListener("keypress", function(e) {
        if (keyPressActions[e.key] != null) {
            keyPressActions[e.key]();
        }
    });

    const whilePressedActions = {};

    function whilePressed(key, action) {
        whilePressedActions[key] = action;
    }

    window.addEventListener("keydown", function (e) {
        if (whilePressedActions[e.key] != null) {
            isPressed[e.key] = true;
        }
    });

    window.addEventListener("keyup", function (e) {
        if (whilePressedActions[e.key] != null) {
            isPressed[e.key] = false;
        }
    });

    function handleKeys() {
        for (let key in whilePressedActions) {
            if (isPressed[key]) {
                whilePressedActions[key]();
            }
        }
        boomParam = boomParam * 0.9;
        timestep -= (timestep - (1/fps)) / 200;
    }

    const isPressed = {};

    let param1 = 0;
    let param2 = 0;

    whilePressed("a", function() {
        param1 -= 0.01;
        while (param1 < -1) param1 += 2;
    });
    whilePressed("d", function() {
        param1 += 0.01;
        while (param1 > 1) param1 -= 2;
    });
    whilePressed("w", function() {
        param2 -= 0.01;
        while (param2 < -1) param2 += 2;
    });
    whilePressed("s", function() {
        param2 += 0.01;
        while (param2 > 1) param2 -= 2;
    });
    whilePressed("b", function() {
        boomParam = 1;
    });

    let boomParam = 0;

    let timestep = 1/fps;
    whilePressed("x", function() { timestep += 0.1 * 1/fps });
    whilePressed("z", function() { timestep -= 0.1 * 1/fps });

    function resetTransform() {
        g.setTransform(1,0,0,1,0,0);
        g.translate(w / 2, h / 2);
    }
    resetTransform();


    function somewhereSomehow() {
        g.rotate(Math.random()*tau);
        let s = Math.random()*30;
        g.translate((Math.random()-0.5) * w, (Math.random()-0.5) * h);
        g.scale(s,s);
    }

    function cross() {
        g.beginPath();
        g.lineWidth = 0.1;

        g.moveTo(-1,-1);
        g.lineTo(1,1);

        g.moveTo(1,-1);
        g.lineTo(-1,1);

        g.stroke();
    }

    function nought() {
        g.beginPath();
        g.lineWidth = 0.1;
        g.arc(0,0,1,0,tau);
        g.stroke();
    }

    function why() {
        g.beginPath();
        g.lineWidth = 0.1;
        g.moveTo(-1,-1);
        g.lineTo(0,0);
        g.moveTo(1,-1);
        g.lineTo(0,0);
        g.lineTo(0,1);
        g.stroke();
    }

    function grid() {
        g.beginPath();
        g.lineWidth = 0.1;
        g.moveTo(-3,-1);
        g.lineTo(3,-1);
        g.moveTo(-3,1);
        g.lineTo(3,1);
        g.moveTo(-1,-3);
        g.lineTo(-1,3);
        g.moveTo(1,-3);
        g.lineTo(1,3);
        g.stroke();
    }

    let ca = [128,64,255];
    let cb = [64,192,255];

    function randByte() {
        return Math.floor(Math.random() * 255);
    }

    bindKeyPress("y", function() {
        ca = [randByte(), randByte(), randByte()];
        cb = [randByte(), randByte(), randByte()];
    });

    let colourCounter = 0;

    function pickAColourAnyColour() {
        const steps = 20;

        colourCounter++;
        let colourIndex = colourCounter % (steps+1);
        let aV = (colourIndex / steps);
        let bV = 1-aV;
        function f(x) { return x < 0 ? 0 : x > 255 ? 255 : Math.floor(x); }

        const blend = [f(ca[0] * aV + cb[0] * bV), f(ca[1] * aV + cb[1] * bV), f(ca[2] * aV + cb[2] * bV)]

        return "rgb(" + blend[0] + "," + blend[1] + "," + blend[2] + ")";
    }

    function fade(amount) {
        g.fillStyle = "rgba(0,0,0," + amount + ")";
        g.fillRect(-w/2,-h/2,w,h);
    }

    function divideAndConquer(rot, op) {
        bg.clearRect(0,0,w,h);
        bg.scale(0.5,0.5);
        for (let xx = 0; xx < 2; xx ++) {
            for (let yy = 0; yy < 2; yy++) {
                bg.drawImage(canvas, w * xx, h * yy);
                // bg.drawImage(canvas, 0, 0);
                // bg.drawImage(canvas, w, 0);
                // bg.drawImage(canvas, 0, h);
                // bg.drawImage(canvas, w, h);
            }
        }

        bg.setTransform(1,0,0,1,0,0);

        g.globalCompositeOperation = op != null ? op : "lighter";
        g.rotate(rot);
        //g.globalAlpha = 0.9;
        g.drawImage(buffer, -w/2, -h/2);

        resetTransform();
        g.globalCompositeOperation = "source-over";
    }

    function blurr(px) {
        //g.clearRect(0,0,w,h);
        g.filter = "blur(" + px + "px)";
        g.drawImage(canvas, -w/2,-h/2);
        g.filter = "none";
    }

    function rotoZoom(sf, rot, zoom, op) {
        bg.clearRect(0,0,w,h);
        bg.scale(sf, sf);

        bg.drawImage(canvas, w * (1-sf) * 0.5/ sf, h * (1-sf) * 0.5 / sf);
        bg.setTransform(1,0,0,1,0,0);
        g.globalCompositeOperation = op == null ? "difference" : op;
        g.rotate(rot);
        g.scale(zoom,zoom);
        for (let xx =-1; xx < 2; xx++) {
            for (let yy = -1; yy < 2; yy++) {
                g.drawImage(buffer, xx * w + -w/2, yy * h + -h/2);
            }
        }

        resetTransform();
        g.globalCompositeOperation = "source-over";
    }

    function atTheCursor() {
        g.translate(cursorX,cursorY);
        g.scale(100,100);
    }

    function inTheMiddle() {
        g.scale(150,150);
    }

    let counters = {};
    const wCells = 8;
    const hCells = Math.round(wCells / (w/h));

    function inAnOrderlyFashion(id) {
        if (counters[id] == null) {
            counters[id] = 0;
        }
        let counter = counters[id];
        counters[id] ++;
        let cellNo = counter % (wCells * hCells);
        let y = Math.floor(cellNo / wCells);
        let x = cellNo % wCells;
        let xCellSize = w / wCells;
        let yCellSize = h / hCells;

        g.translate(-w/2 + (x+0.5) * xCellSize, -h/2 + (y+0.5) * yCellSize);
        g.scale(xCellSize/4, yCellSize/4);

        counter++;
    }

    let textCounter = 0;
    const text = "Sunday Club ";

    function textInOrder() {
        let charIndex = textCounter % text.length;
        let char = text.charAt(charIndex);
        g.font = "2px monospace";
        g.fillStyle = pickAColourAnyColour();
        g.fillText(char, -0.5, 0.5);
        textCounter++;
    }


    function sundayClubXO(time,frame) {
        if (Math.random() < 0.1) {
           divideAndConquer(0);
           rotoZoom(1,param1 * tau,1, "source-over");
           //blurr(2);
        }
        if (Math.random() < 0.03) {
            fade(1);
        }
        fade(0.05);
        g.globalCompositeOperation = "lighter";

        if (frame % 10 == 0) {
            inAnOrderlyFashion("text");
            g.strokeStyle = pickAColourAnyColour();
            g.scale(1 + boomParam * 3, 1 + boomParam * 3);
            textInOrder();
            resetTransform();
        }

        while (Math.random() < 0.2) {
            g.strokeStyle = pickAColourAnyColour();
            inAnOrderlyFashion("xo");
            if (boomParam > 0.5) {
                grid()
            } else if (Math.random() < 0.7) {
                cross();
            } else if (Math.random() < 0.7) {
                nought();
            } else {
                cube(Math.random() * tau,math.random() * tau,Math.random() * tau,0.1);
            }
            resetTransform();
        }
        g.globalCompositeOperation = "source-over";
    }

    let cursorX = 0;
    let cursorY = 0;


    window.addEventListener("mousemove", function (e) {
        cursorX = e.clientX - (w / 2);
        cursorY = e.clientY - (h / 2);
    });



    function qq(time, frame) {
        g.strokeStyle = pickAColourAnyColour();

        for (let i = 0; i < 2 ; i ++) {
            let subframe = frame * 2 + i;
            const angle = (time + (i * 0.5/fps)) * 40 * tau / 3000;
            rotoZoom(1,  angle, 1 + param1/3);

            if (subframe % 2 == 0) {
                divideAndConquer(angle * 2);
            }

        }

        if (boomParam > 0.4) {
            fade(0.1);
            for (let x = 0; x < 10; x++) {
                somewhereSomehow()
                g.scale(4, 4);
                nought();
                resetTransform();
            }
        }

        if(boomParam > 2) {
            //somewhereSomehow();
            inTheMiddle();
            g.globalCompositeOperation = "lighter";
            nought();
            resetTransform();
            g.globalCompositeOperation = "source-over";
        }
        resetTransform();
    }

    function makeCube(n) {
        const factor = 1 / Math.cos(tau / 8);
        let edges = [];
        for (let i = 0; i < n; i++) {
            let x = factor * Math.cos((tau / 8) + i * tau / n);
            let y = factor * Math.sin((tau / 8) + i * tau / n);
            let x2 = factor * Math.cos((tau / 8) + (i+1) * tau / n);
            let y2 = factor * Math.sin((tau / 8) + (i+1) * tau / n);
            edges.push([[x,y,-1],[x,y,1]]);
            edges.push([[x,y,-1],[x2,y2,-1]]);
            edges.push([[x,y,1],[x2,y2,1]]);
        }
        return edges;
    }

    let theCube = makeCube(4);

    bindKeyPress("c", function() {
        theCube = makeCube(Math.floor(Math.random() * 6) + 2)
    });


    function cube(xrot,yrot,zrot, linewidth) {
        const dist = 3;

        function project(xyz) {
            return [
                xyz[0] / xyz[2],
                xyz[1] / xyz[2]
            ]
        }

        function translate(xyz) {
            return [
                xyz[0], xyz[1], xyz[2] + dist
            ]
        }

        function rZ(p, a) {
            return [Math.cos(a) * p[0] - Math.sin(a) * p[1], Math.sin(a) * p[0] + Math.cos(a) * p[1], p[2]];
        }

        function rY(p, a) {
            return [Math.cos(a) * p[0] - Math.sin(a) * p[2], p[1], Math.sin(a) * p[0] + Math.cos(a) * p[2]];
        }

        function rX(p, a) {
            return [p[0], Math.cos(a) * p[1] - Math.sin(a) * p[2], Math.sin(a) * p[1] + Math.cos(a) * p[2]];
        }

        function compute(p) {
            return project(
                translate(
                    rZ(rY(rX(p, xrot), yrot), zrot)
                )
            )
        }


        g.beginPath();
        for (let i = 0; i < theCube.length; i++) {
            let edge = theCube[i];
            let a = compute(edge[0]);
            let b = compute(edge[1]);
            g.moveTo(a[0], a[1]);
            g.lineTo(b[0], b[1]);
        }
        g.lineWidth = linewidth == null ? 0.01 : linewidth;
        g.stroke();
    }




    function lx(time, frame) {
        const tf = 0.8;
        fade(0.07);
        divideAndConquer(0, "lighten");
        g.translate(param1 * w / 2, param2 * h / 2);
        g.strokeStyle = pickAColourAnyColour();
        g.globalCompositeOperation = "lighter";
        g.scale(200 + boomParam * 300,200 + boomParam * 300);
        cube(tf * tau * time / 5, tf * tau * time / 6, tf * tau * time / 7);
        g.globalCompositeOperation = "source-over";
        resetTransform();
    }





    let frame = 0;

    let time = 0;

    const scenes = [lx, qq, sundayClubXO];
    let currentScene = 1;

    bindKeyPress("j", function() {
       currentScene = (currentScene + 1) % scenes.length;
    });

    let drawFrame = lx;
    function doFrame() {
        frame++;
        time += timestep;
        scenes[currentScene](time, frame);
        //drawFrame(time, frame);
        handleKeys();
        // for (var i=0; i < features.length; i++) {
        //     if (enabled[i]) features[i](time);
        // }
    }
    window.setInterval(doFrame, 1000/fps);

    cross(0.1);

}
window.addEventListener("load", start);