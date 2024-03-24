let func;

let img;
let trainingData;

let nn = new NN([1,10,10, 1], 0.05);

let canvasContainer = document.getElementById('sketch-holder');
let aSlider = document.getElementById('a');
let bSlider = document.getElementById('b');
let cSlider = document.getElementById('c');
let dSlider = document.getElementById('d');
function create(number,a,b,c,d) {
    func = (x) => a*x*x*x + b*x*x + c*x;
    let data = [];
    let randomness = 0;
    for(let i = 0; i < number; i++) {
        let x = 2-Math.random()*4;
        let y = func(x);
        y+=(1-Math.random()*2)*randomness;
        data.push({
            input: [x],
            target: [y]
        });
    }
    return data;
}


function createTrainingData(number) {
    let a = 1-Math.random()*2;
    aSlider.value = a;
    let b = 1-Math.random()*2;
    bSlider.value = b;
    let c = 1-Math.random()*2;
    cSlider.value = c;
    let d = 1-Math.random()*2;
    dSlider.value = d;
    return create(number,a,b,c,d);
}

async function train() {
    for(let i = 0; i < 1000; i++) {
        let data = random(trainingData);
        nn.train(data.input,data.target);
    }
    await new Promise(resolve => setTimeout(resolve, 10));
    await Promise.all([train()]);
}

async function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent(canvasContainer);
    trainingData = createTrainingData(20);
    img = createGraphics(width, height);
    for (let i = 0; i < trainingData.length; i++) {
        let x = map(trainingData[i].input[0], -2, 2, 0, width);
        let y = map(trainingData[i].target[0], -2, 2, height, 0);
        img.stroke(0);
        img.strokeWeight(4);
        img.point(x, y);
    }
    await train();
}

function score() {
    let perfectPercentage = 0;
    let total = 0;
    for(let i = 0; i < trainingData.length; i++) {
        let x = trainingData[i].input[0];
        let y = trainingData[i].target[0];
        let guess = nn.feedforward([x])[0];
        let error = Math.abs(y - guess);
        total += error;
        if(error < 0.1) {
            perfectPercentage++;
        }
    }
    total = total / trainingData.length;
    return (1-total)*100;
}

function draw() {
    background(255);
    noFill();
    stroke(0);
    strokeWeight(1);
    nn.learning_rate*=0.999;
    beginShape();
    for(let i = -2; i < 2; i=i+0.01) {
        let x = i
        let y = nn.feedforward([x])[0];
        y = map(y, -2, 2, height, 0);
        x = map(x, -2, 2, 0, width);
        vertex(x, y);
    }
    endShape();
    image(img, 0, 0);
    //console.log(score());
}

// function mousePressed() {
//     trainingData = createTrainingData(100);
//     img.clear();
//     for(let i = 0; i < trainingData.length; i++) {
//         let x = map(trainingData[i].input[0], -2, 2, 0, width);
//         let y = map(trainingData[i].target[0], -2,2, height, 0);
//         img.stroke(0);
//         img.strokeWeight(4);
//         img.point(x, y);
//     }
// }
function reCreateTrainingData(number) {
    let a = aSlider.value;
    let b = bSlider.value;
    let c = cSlider.value;
    let d = dSlider.value;

    let data =  create(number,a,b,c,d);
    console.log(data);
    img.clear();
    for(let i = 0; i < trainingData.length; i++) {
        let x = map(trainingData[i].input[0], -2, 2, 0, width);
        let y = map(trainingData[i].target[0], -2,2, height, 0);
        img.stroke(0);
        img.strokeWeight(4);
        img.point(x, y);
    }
    return data;

}

function retrain() {
    console.log(trainingData)
    let data = reCreateTrainingData(20);
    for(let i = 0; i< trainingData.length; i++) {
        trainingData[i].input[0] = data[i].input[0];
        trainingData[i].target[0] = data[i].target[0];
    }
    console.log(trainingData);
}

aSlider.oninput = retrain
bSlider.oninput = retrain
cSlider.oninput = retrain
dSlider.oninput = retrain