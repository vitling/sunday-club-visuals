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
        g.strokeStyle = "white";

        g.moveTo(-1,-1);
        g.lineTo(1,1);

        g.moveTo(1,-1);
        g.lineTo(-1,1);

        g.stroke();
    }

    function nought() {
        g.beginPath();
        g.lineWidth = 0.1;
        g.strokeStyle = "white";
        g.arc(0,0,1,0,tau);
        g.stroke();
    }

    function grid() {
        g.beginPath();
        g.lineWidth = 0.1;
        g.strokeStyle = "white";
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

    function fade(amount) {
        g.fillStyle = "rgba(0,0,0," + amount + ")";
        g.fillRect(-w/2,-h/2,w,h);
    }

    function halves() {
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

    let counter = 0;
    const wCells = 8;
    const hCells = Math.round(wCells / (w/h));

    function inAnOrderlyFashion() {
        let cellNo = counter % (wCells * hCells);
        let y = Math.floor(cellNo / wCells);
        let x = cellNo % wCells;
        let xCellSize = w / wCells;
        let yCellSize = h / hCells;

        g.translate(-w/2 + (x+0.5) * xCellSize, -h/2 + (y+0.5) * yCellSize);
        g.scale(xCellSize/4, yCellSize/4);

        counter++;
    }

    function drawFrame(time,frame) {
        if (Math.random() < 0.03) {
           halves();
        }
        if (Math.random() < 0.01) {
            fade(1);
        }
        fade(0.01);
        while (Math.random() < 0.2) {
            for (var x = 0; x < 1; x++) {
                inAnOrderlyFashion();
                if (Math.random() < 0.8) {
                    cross();
                } else if (Math.random() < 0.8) {
                    nought();
                } else {
                    grid();
                }
                resetTransform();
            }
        }
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
    var frame = 0;
    var timestep = 1/fps;
    bindKey("p", function() { timestep += 1/fps });
    bindKey("o", function() { timestep -= 1/fps });

    var time = 0;
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