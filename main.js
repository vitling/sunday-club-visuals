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

    function resetTransform() {
        g.setTransform(1,0,0,1,0,0);
        g.translate(w / 2, h / 2);
    }

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

    let colourCounter = 0;

    function pickAColourAnyColour() {
        const a = [128,64,255];
        const b = [64,192,255];
        const steps = 20;

        colourCounter++;
        let colourIndex = colourCounter % (steps+1);
        let aV = (colourIndex / steps);
        let bV = 1-aV;
        function f(x) { return x < 0 ? 0 : x > 255 ? 255 : Math.floor(x); }

        const blend = [f(a[0] * aV + b[0] * bV), f(a[1] * aV + b[1] * bV), f(a[2] * aV + b[2] * bV)]

        return "rgb(" + blend[0] + "," + blend[1] + "," + blend[2] + ")";
    }

    function fade(amount) {
        g.fillStyle = "rgba(0,0,0," + amount + ")";
        g.fillRect(-w/2,-h/2,w,h);
    }

    function divideAndConquer(rot) {
        bg.clearRect(0,0,w,h);
        bg.scale(0.5,0.5);
        bg.drawImage(canvas, 0,0);
        bg.drawImage(canvas, w,0);
        bg.drawImage(canvas, 0,h);
        bg.drawImage(canvas, w,h);
        bg.setTransform(1,0,0,1,0,0);

        g.globalCompositeOperation = "screen";
        //g.globalAlpha = 0.9;
        g.drawImage(buffer, -w/2,-h/2);
        g.globalCompositeOperation = "source-over";
    }

    function blurr() {
        //g.clearRect(0,0,w,h);
        g.filter = "blur(10px)";
        g.drawImage(canvas, -w/2,-h/2);
        g.filter = "";
    }
    
    function rotoZoom(sf, rot) {
        bg.clearRect(0,0,w,h);
        bg.scale(sf, sf);

        bg.drawImage(canvas, w * (1-sf) * 0.5/ sf, h * (1-sf) * 0.5 / sf);
        bg.setTransform(1,0,0,1,0,0);
        g.globalCompositeOperation = "difference";
        g.rotate(rot);
        g.drawImage(buffer, -w/2, -h/2);
        //resetTransform();
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
           divideAndConquer();
        }
        if (Math.random() < 0.03) {
            fade(1);
        }
        fade(0.05);
        g.globalCompositeOperation = "lighter";

        if (frame % 10 == 0) {
            inAnOrderlyFashion("text");
            g.strokeStyle = pickAColourAnyColour();
            textInOrder();
            resetTransform();
        }

        while (Math.random() < 0.2) {
            g.strokeStyle = pickAColourAnyColour();
            inAnOrderlyFashion("xo");
            if (Math.random() < 0.7) {
                cross();
            } else if (Math.random() < 0.7) {
                nought();
            } else {
                grid();
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
        if (frame % 1 == 0) {
            rotoZoom(1.00,  tau / 3000);
            //fade(0.01);
        }
        if (Math.random() < 0.01) {
            //fade(1);
        }
        if (frame % 2 == 0) {
            divideAndConquer();
        }

        if(frame % 3000 < 10) {
            //somewhereSomehow();
            inTheMiddle();
            //textInOrder();
            nought();
            resetTransform();
            somewhereSomehow();
            //why();
            resetTransform();
        }
    }

    function lx(time, frame) {
        inAnOrderlyFashion("q");

        //blurr();
        if (frame % 2 == 0) {
            rotoZoom(1.1, 0);
        }
        g.scale(Math.random() *2+1, Math.random() * 2+1);
        g.globalCompositeOperation = "lighter";
        textInOrder();
        g.globalCompositeOperation = "source-over";
        resetTransform();
    }

    var keyActions = {};

    function bindKey(key, action) {
        keyActions[key] = action;
    }

    function unbindKey(key, action) {
        delete(keyActions[key]);
    }
    window.addEventListener("keypress", function(e) {
        if (keyActions[e.key] != null) {
            keyActions[e.key]();
        }
    });

    const fps = 40;
    let frame = 0;
    let timestep = 1/fps;
    bindKey("p", function() { timestep += 1/fps });
    bindKey("o", function() { timestep -= 1/fps });

    let time = 0;

    let drawFrame = qq;
    function doFrame() {
        frame++;
        time += timestep;
        drawFrame(time, frame);
        // for (var i=0; i < features.length; i++) {
        //     if (enabled[i]) features[i](time);
        // }
    }
    window.setInterval(doFrame, 1000/fps);

    cross(0.1);

}
window.addEventListener("load", start);