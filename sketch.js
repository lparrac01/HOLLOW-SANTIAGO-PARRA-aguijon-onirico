let caballerito;
let video;
let faceMesh;
let predictions = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceMesh = ml5.faceMesh(video, { maxFaces: 1 }, modelReady);
  caballerito = new hollow(width / 2, height / 2, 100);
}

function modelReady() {
  console.log('FaceMesh model ready');
}

function draw() {
  background(100, 149, 237);
  faceMesh.detect(video, gotResults);
  if (predictions.length > 0) {
    let face = predictions[0];
    let x = map(face.box.xMin, 0, video.width, 0, width);
    let y = map(face.box.yMin, 0, video.height, 0, height);
    let w = map(face.box.width, 0, video.width, 0, width);
    let h = map(face.box.height, 0, video.height, 0, height);
    caballerito.x = x + w / 2;
    caballerito.y = y + h / 2;
    caballerito.size = map(w, 50, 200, 50, 200);
    
    // Para expresiones: calcular sonrisa
    let leftMouth = face.keypoints[61];
    let rightMouth = face.keypoints[291];
    let mouthWidth = dist(leftMouth.x, leftMouth.y, rightMouth.x, rightMouth.y);
    if (mouthWidth > 50) { // umbral para sonrisa
      caballerito.smiling = true;
    } else {
      caballerito.smiling = false;
    }
  }
  caballerito.show();
}

function gotResults(err, results) {
  if (err) {
    console.error(err);
    return;
  }
  predictions = results;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class hollow {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.smiling = false;
  }

 show() {
   push();
   translate(this.x, this.y);
   scale(this.size / 100);
   
   let t = frameCount * 0.01;
   
   // Cuerpo
  fill(15, 15, 30);
  noStroke();
  ellipse(0, 70, 80, 110);

  // Manto / cloak base
  fill(10, 10, 25);
  noStroke();
  beginShape();
  vertex(-55, 40);
  bezierVertex(-90, 60, -110, 130, -80, 180);
  bezierVertex(-60, 200, -30, 190, 0, 185);
  bezierVertex(30, 190, 60, 200, 80, 180);
  bezierVertex(110, 130, 90, 60, 55, 40);
  endShape(CLOSE);

  // Ondas del manto (azul)
  let wave = sin(t * 1.5) * 8;
  
  // Ala izquierda del manto
  stroke(20, 60, 200);
  strokeWeight(3);
  noFill();
  beginShape();
  vertex(-30, 50);
  bezierVertex(-60 + wave, 70, -100 + wave * 0.5, 100, -110 + wave, 130);
  bezierVertex(-115 + wave, 155, -100, 175, -80, 180);
  endShape();
  
  beginShape();
  vertex(-20, 55);
  bezierVertex(-50 + wave, 80, -85 + wave * 0.5, 115, -95 + wave, 145);
  bezierVertex(-100 + wave, 165, -88, 178, -70, 182);
  endShape();

  // Ala derecha del manto
  beginShape();
  vertex(30, 50);
  bezierVertex(60 - wave, 70, 100 - wave * 0.5, 100, 110 - wave, 130);
  bezierVertex(115 - wave, 155, 100, 175, 80, 180);
  endShape();
  
  beginShape();
  vertex(20, 55);
  bezierVertex(50 - wave, 80, 85 - wave * 0.5, 115, 95 - wave, 145);
  bezierVertex(100 - wave, 165, 88, 178, 70, 182);
  endShape();

  // Brillos azules en el manto
  stroke(80, 120, 255, 180);
  strokeWeight(1.5);
  beginShape();
  vertex(-25, 52);
  bezierVertex(-55 + wave, 75, -88 + wave * 0.5, 108, -98 + wave, 138);
  endShape();
  beginShape();
  vertex(25, 52);
  bezierVertex(55 - wave, 75, 88 - wave * 0.5, 108, 98 - wave, 138);
  endShape();

  // Llama izquierda superior
  noStroke();
  fill(20, 50, 180, 200);
  beginShape();
  vertex(-55, 40);
  bezierVertex(-80 + wave, 10, -95 + wave * 0.8, -10, -70 + wave * 0.5, 20);
  bezierVertex(-65 + wave * 0.3, 30, -60, 35, -55, 40);
  endShape(CLOSE);

  fill(50, 90, 220, 150);
  beginShape();
  vertex(-55, 40);
  bezierVertex(-75 + wave, 5, -85 + wave, -20, -60 + wave * 0.6, 10);
  bezierVertex(-58 + wave * 0.3, 25, -57, 33, -55, 40);
  endShape(CLOSE);

  // Llama derecha superior
  fill(20, 50, 180, 200);
  beginShape();
  vertex(55, 40);
  bezierVertex(80 - wave, 10, 95 - wave * 0.8, -10, 70 - wave * 0.5, 20);
  bezierVertex(65 - wave * 0.3, 30, 60, 35, 55, 40);
  endShape(CLOSE);

  fill(50, 90, 220, 150);
  beginShape();
  vertex(55, 40);
  bezierVertex(75 - wave, 5, 85 - wave, -20, 60 - wave * 0.6, 10);
  bezierVertex(58 - wave * 0.3, 25, 57, 33, 55, 40);
  endShape(CLOSE);

  // Cuello / base del manto
  fill(15, 15, 30);
  noStroke();
  rect(-22, 28, 44, 22, 4);

  // Máscara (cabeza)
  fill(235, 235, 245);
  noStroke();
  ellipse(0, -30, 115, 130);

  // Cuernos
  strokeWeight(12);
  stroke(235, 235, 245);
  noFill();
  // Cuerno izquierdo
  beginShape();
  vertex(-28, -80);
  bezierVertex(-38, -115, -42, -140, -28, -155);
  endShape();
  // Cuerno derecho
  beginShape();
  vertex(28, -80);
  bezierVertex(38, -115, 42, -140, 28, -155);
  endShape();

  // Punta de cuernos
  strokeWeight(8);
  line(-28, -155, -22, -162);
  line(28, -155, 22, -162);

  // Ojos (huecos negros)
  if (this.smiling) fill(255, 0, 0); else fill(0);
  noStroke();
  ellipse(-25, -32, 38, 44);
  ellipse(25, -32, 38, 44);

  // Brillo sutil en máscara
  fill(255, 255, 255, 30);
  ellipse(-10, -50, 40, 30);

  // Aguija (nail / sword)
  let swordAngle = -PI / 5 + sin(t * 0.8) * 0.05;
  push();
  translate(38, 90);
  rotate(swordAngle);
  
  // Empuñadura
  fill(80, 80, 100);
  noStroke();
  rect(-6, -10, 12, 28, 2);
  
  // Guarda
  fill(130, 130, 160);
  rect(-14, -12, 28, 7, 2);
  
  // Hoja
  stroke(200, 210, 255);
  strokeWeight(3);
  fill(210, 220, 255);
  beginShape();
  vertex(-3, -14);
  vertex(3, -14);
  vertex(1, -110);
  vertex(0, -125);
  vertex(-1, -110);
  endShape(CLOSE);
  
  // Brillo de la hoja
  stroke(255, 255, 255, 180);
  strokeWeight(1);
  line(0, -14, 0, -120);
  }
  
}
