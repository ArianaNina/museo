// ========================================
// MUSEO DE LA VIRGEN DEL SOCAVÓN
// ========================================

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x181411);

// CÁMARA

const camera=new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(0,1.7,6);

// RENDER

const renderer=new THREE.WebGLRenderer({
antialias:true,
alpha:false
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.setPixelRatio(
Math.min(window.devicePixelRatio,2)
);

renderer.shadowMap.enabled=true;
document.body.appendChild(renderer.domElement);

// CONTROLES

const controls=new THREE.PointerLockControls(
camera,
document.body
);

const inicio=document.getElementById("inicio");

inicio.addEventListener("click",function(){
controls.lock();
});

controls.addEventListener("lock",function(){
inicio.style.display="none";
});

controls.addEventListener("unlock",function(){
inicio.style.display="flex";
});

// LUCES

const ambiente=new THREE.AmbientLight(
0xffffff,
0.9
);

scene.add(ambiente);

const luzPrincipal=new THREE.DirectionalLight(
0xfff1d6,
1.1
);

luzPrincipal.position.set(
0,
8,
5
);

luzPrincipal.castShadow=true;
scene.add(luzPrincipal);

// PISO

const radio=12;
const altura=7;

const materialPiso=new THREE.MeshStandardMaterial({
color:0x66574a,
roughness:.75
});

const piso=new THREE.Mesh(
new THREE.CircleGeometry(14,96),
materialPiso
);

piso.rotation.x=-Math.PI/2;
piso.receiveShadow=true;
scene.add(piso);

// PARED

const materialPared=new THREE.MeshStandardMaterial({
color:0x17645f,
side:THREE.DoubleSide,
roughness:.8
});

const pared=new THREE.Mesh(
new THREE.CylinderGeometry(
radio,
radio,
altura,
96,
1,
true
),
materialPared
);

pared.position.y=altura/2;
scene.add(pared);

// TECHO

const materialTecho=new THREE.MeshStandardMaterial({
color:0xd8d1c5,
side:THREE.DoubleSide
});

const techo=new THREE.Mesh(
new THREE.CircleGeometry(radio,96),
materialTecho
);

techo.rotation.x=Math.PI/2;
techo.position.y=altura;
scene.add(techo);

// BORDE DEL PISO

const borde=new THREE.Mesh(
new THREE.TorusGeometry(
radio,
.18,
12,
96
),
new THREE.MeshStandardMaterial({
color:0x3b2920
})
);

borde.rotation.x=Math.PI/2;
borde.position.y=.12;
scene.add(borde);

// CREAR CUADROS

function crearCuadro(nombre,angulo){

const ancho=3.0;
const alto=4.8;

const x=Math.sin(angulo)*(radio-.20);
const z=Math.cos(angulo)*(radio-.20);

// Marco

const marco=new THREE.Mesh(
new THREE.BoxGeometry(
ancho+.35,
alto+.35,
.22
),
new THREE.MeshStandardMaterial({
color:0x59351f,
roughness:.45
})
);

marco.position.set(
x,
3.6,
z
);

marco.rotation.y=angulo+Math.PI;
scene.add(marco);

// Imagen

const ruta="./imagenes/"+nombre;
const loader=new THREE.TextureLoader();

loader.load(
ruta,
function(textura){

textura.colorSpace=THREE.SRGBColorSpace;

const material=new THREE.MeshBasicMaterial({
map:textura,
side:THREE.DoubleSide
});

const cuadro=new THREE.Mesh(
new THREE.PlaneGeometry(
ancho,
alto
),
material
);

cuadro.position.set(
Math.sin(angulo)*(radio-.38),
3.6,
Math.cos(angulo)*(radio-.38)
);

cuadro.rotation.y=angulo+Math.PI;
scene.add(cuadro);

console.log("IMAGEN CARGADA:",ruta);

},
undefined,
function(){
console.error("ERROR AL CARGAR:",ruta);
}
);

// Luz del cuadro

const foco=new THREE.PointLight(
0xffdca0,
0.8,
6
);

foco.position.set(
Math.sin(angulo)*(radio-1),
5,
Math.cos(angulo)*(radio-1)
);

scene.add(foco);

}

// 20 IMÁGENES

const imagenes=[
"cuadro1.jpg",
"cuadro2.jpg",
"cuadro3.jpg",
"cuadro4.jpg",
"cuadro5.jpg",
"cuadro6.jpg",
"cuadro7.jpg",
"cuadro8.jpg",
"cuadro9.jpg",
"cuadro10.jpg",
"cuadro11.jpg",
"cuadro12.jpg",
"cuadro13.jpg",
"cuadro14.jpg",
"cuadro15.jpg",
"cuadro16.jpg",
"cuadro17.jpg",
"cuadro18.jpg",
"cuadro19.jpg",
"cuadro20.jpg"
];

for(let i=0;i<imagenes.length;i++){

const angulo=
(i/imagenes.length)*Math.PI*2;

crearCuadro(
imagenes[i],
angulo
);

}

// PILARES

function crearColumna(angulo){

const distanciaColumna=9;

const x=
Math.sin(angulo)*distanciaColumna;

const z=
Math.cos(angulo)*distanciaColumna;

const material=new THREE.MeshStandardMaterial({
color:0xc7b69b,
roughness:.6
});

const columna=new THREE.Mesh(
new THREE.CylinderGeometry(
.22,
.32,
6.2,
24
),
material
);

columna.position.set(
x,
3.1,
z
);

scene.add(columna);

}

// 5 PILARES

crearColumna(0);
crearColumna(Math.PI/2);
crearColumna(Math.PI);
crearColumna(Math.PI*1.5);
crearColumna(Math.PI/4);

// BUSTOS

function crearBustoPilar(
archivo,
angulo,
ancho,
alto
){

const loader=new THREE.TextureLoader();

loader.load(
"./imagenes/"+archivo,
function(textura){

textura.colorSpace=
THREE.SRGBColorSpace;

// Material transparente

const materialBusto=
new THREE.MeshStandardMaterial({
map:textura,
transparent:true,
alphaTest:0.05,
side:THREE.DoubleSide,
roughness:.45,
metalness:0.02
});

// Busto

const busto=new THREE.Mesh(
new THREE.PlaneGeometry(
ancho,
alto
),
materialBusto
);

const distancia=8.55;

const x=
Math.sin(angulo)*distancia;

const z=
Math.cos(angulo)*distancia;

busto.position.set(
x,
3.7,
z
);

busto.rotation.y=
angulo+Math.PI;

busto.castShadow=true;

scene.add(busto);

// Capa de profundidad

const profundidad=new THREE.Mesh(

new THREE.PlaneGeometry(
ancho-.08,
alto-.08
),

new THREE.MeshBasicMaterial({
map:textura,
transparent:true,
alphaTest:0.05,
opacity:.18,
side:THREE.DoubleSide
})

);

const distanciaProfundidad=8.48;

const xp=
Math.sin(angulo)*distanciaProfundidad;

const zp=
Math.cos(angulo)*distanciaProfundidad;

profundidad.position.set(
xp,
3.7,
zp
);

profundidad.rotation.y=
angulo+Math.PI;

scene.add(profundidad);

// Luz del busto

const luzBusto=new THREE.PointLight(
0xffd6a0,
1.5,
5
);

const distanciaLuz=7.8;

const xl=
Math.sin(angulo)*distanciaLuz;

const zl=
Math.cos(angulo)*distanciaLuz;

luzBusto.position.set(
xl,
4.8,
zl
);

scene.add(luzBusto);

console.log(
"BUSTO CARGADO:",
archivo
);

},
undefined,
function(){

console.error(
"NO SE PUDO CARGAR:",
"./imagenes/"+archivo
);

}
);

}

// BUSTO 1

crearBustoPilar(
"busto.png",
0,
2.2,
3.0
);

// BUSTO 2

crearBustoPilar(
"ORU.PNG",
Math.PI,
2.2,
3.0
);

// BUSTO 3

crearBustoPilar(
"toba.png",
Math.PI/2,
2.2,
3.0
);

// BUSTO 4

crearBustoPilar(
"ne.png",
Math.PI*1.5,
2.2,
3.0
);

// BUSTO 5

crearBustoPilar(
"bigo.png",
Math.PI/4,
2.3,
3.1
);

// LUCES DEL TECHO

function crearLuzTecho(angulo){

const x=Math.sin(angulo)*7;
const z=Math.cos(angulo)*7;

const luz=new THREE.PointLight(
0xffe8c2,
1.3,
9
);

luz.position.set(
x,
6.5,
z
);

scene.add(luz);

// Lámpara

const lampara=new THREE.Mesh(
new THREE.SphereGeometry(
.15,
16,
16
),
new THREE.MeshBasicMaterial({
color:0xffe5ad
})
);

lampara.position.set(
x,
6.7,
z
);

scene.add(lampara);

}

// 5 luces

crearLuzTecho(0);
crearLuzTecho(Math.PI/2);
crearLuzTecho(Math.PI);
crearLuzTecho(Math.PI*1.5);
crearLuzTecho(Math.PI/4);

// MOVIMIENTO

let adelante=false;
let atras=false;
let izquierda=false;
let derecha=false;

document.addEventListener(
"keydown",
function(e){

if(e.code==="KeyW")
adelante=true;

if(e.code==="KeyS")
atras=true;

if(e.code==="KeyA")
izquierda=true;

if(e.code==="KeyD")
derecha=true;

}
);

document.addEventListener(
"keyup",
function(e){

if(e.code==="KeyW")
adelante=false;

if(e.code==="KeyS")
atras=false;

if(e.code==="KeyA")
izquierda=false;

if(e.code==="KeyD")
derecha=false;

}
);

// VELOCIDAD

const velocidad=0.065;

// ANIMACIÓN

function animar(){

requestAnimationFrame(animar);

if(controls.isLocked){

if(adelante){
controls.moveForward(velocidad);
}

if(atras){
controls.moveForward(-velocidad);
}

if(izquierda){
controls.moveRight(-velocidad);
}

if(derecha){
controls.moveRight(velocidad);
}

// Altura

camera.position.y=1.7;

// Límite

const distancia=Math.sqrt(
camera.position.x*camera.position.x+
camera.position.z*camera.position.z
);

if(distancia>10.2){

camera.position.x=
(camera.position.x/distancia)*10.2;

camera.position.z=
(camera.position.z/distancia)*10.2;

}

}

renderer.render(
scene,
camera
);

}

// INICIAR

animar();

// CAMBIO DE TAMAÑO

window.addEventListener(
"resize",
function(){

camera.aspect=
window.innerWidth/
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

});