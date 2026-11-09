// ========================================
// MUSEO DE LA VIRGEN DEL SOCAVÓN
// ========================================

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x181411);

// CÁMARA

const camera=new THREE.PerspectiveCamera(
60,
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
// ZOOM CON LA RUEDA DEL MOUSE
window.addEventListener("wheel", function(e) {
    camera.fov += e.deltaY > 0 ? 2 : -2;

    camera.fov = THREE.MathUtils.clamp(camera.fov, 30, 90);

    camera.updateProjectionMatrix();
});
const inicio=document.getElementById("inicio");

const botonNoche=document.createElement("button");

botonNoche.id="botonNoche";
botonNoche.textContent="NOCHE";
botonNoche.className="boton-noche";

document.body.appendChild(botonNoche);

let modoNoche=false;
const lamparasMuseo=[];
function cambiarModoNoche(){

    modoNoche=!modoNoche;
// ENCENDER Y APAGAR LAS LUCES
scene.traverse(function(objeto){

    // Los cinco plafones permanecen visibles de dia y de noche
    if(objeto.userData.focoCentral){
        objeto.visible=true;
    }

    if(objeto.isLight){

        // FOCO CENTRAL GRANDE: ENCENDIDO DE DIA Y APAGADO DE NOCHE
        if(objeto.userData.luzCentro){
            objeto.visible=!modoNoche;
            objeto.intensity=modoNoche ? 2.9 : 2.8;
        }

        // LUCES DE LOS PILARES
        else if(objeto.userData.luzPilar){
            objeto.visible=modoNoche;
        }

        // LUCES DEL TECHO
        else if(objeto.userData.luzTecho){
            objeto.visible=!modoNoche;
        }

        // DEMÁS LUCES
        else{
            objeto.visible=!modoNoche;
        }

        // LUZ DE LOS CUADROS
        if(objeto.userData.luzCuadro){
            objeto.intensity=modoNoche ? 5 : 0.8;
        }
    }

});

    // CAMBIAR COLOR DE LAS LAMPARAS
    lamparasMuseo.forEach(function(lampara){

        lampara.material.color.set(
            modoNoche ? 0x292929 : 0xffe5ad
        );

    });

    // FONDO DEL MUSEO
    scene.background.set(
         modoNoche ? 0x367b91 : 0x000000
    );
    // PARED: AZUL GRISÁCEO VISIBLE EN MODO NOCHE
    materialPared.color.set(
        modoNoche ? 0x526f7d : 0x17645f
    );
    materialPared.emissive.set(
        modoNoche ? 0x263943 : 0x000000
    );
    materialPared.emissiveIntensity = modoNoche ? 0.55 : 0;

    // TECHO: PLOMO SEMI OSCURO, NO NEGRO
    materialTecho.color.set(
        modoNoche ? 0x555555 : 0xd8d1c5
    );
    materialTecho.emissive.set(
        modoNoche ? 0x242424 : 0x000000
    );
    materialTecho.emissiveIntensity = modoNoche ? 0.45 : 0;

    // POSTES: PLOMO MEDIO DE NOCHE Y COLOR ORIGINAL DE DÍA
    scene.traverse(function(objeto){
        if(objeto.userData.posteMuseo && objeto.material){
            objeto.material.color.set(
                modoNoche ? 0x666666 : 0x555555
            );
            objeto.material.emissive.set(
                modoNoche ? 0x222222 : 0x000000
            );
            objeto.material.emissiveIntensity = modoNoche ? 0.35 : 0;
        }
    });

    // DISMINUIR EL BRILLO DEL PISO EN MODO NOCHE
    materialPiso.color.set(
    modoNoche ? 0x777777 : 0xffffff
);
    // CAMBIAR TEXTO DEL BOTON
    botonNoche.textContent=
        modoNoche ? "DÍA" : "NOCHE";

    botonNoche.classList.toggle("modo-dia",modoNoche);
}

// FUNCION DEL BOTON
botonNoche.addEventListener("click",function(e){

    e.preventDefault();
    e.stopPropagation();

    cambiarModoNoche();

});

inicio.addEventListener("click",function(){
controls.lock();
});

controls.addEventListener("lock",function(){
inicio.style.display="none";
});

controls.addEventListener("unlock",function(){
inicio.style.display="flex";
});

// ========================================
// CARGADOR DE IMÁGENES
// ========================================

const textureLoader=new THREE.TextureLoader();

function cargarImagen(nombre,funcion){

// IMPORTANTE:
// LAS IMÁGENES ESTÁN EN LA MISMA CARPETA
// QUE index.html Y script.js

const ruta="./"+nombre;

console.log("BUSCANDO IMAGEN:",ruta);

textureLoader.load(
ruta,

function(textura){

// THREE.JS R128
textura.encoding=THREE.sRGBEncoding;
textura.needsUpdate=true;
console.log("IMAGEN CARGADA:",ruta);
funcion(textura);

},

undefined,
function(error){
console.error("ERROR AL CARGAR:",ruta);
console.error(error);

}
);

}

// ========================================
// ========================================
// 5 FOCOS REDONDOS EN EL TECHO
// PLAFONES SIEMPRE VISIBLES / LUZ SOLO DE DIA
// ========================================

const focosTecho=[];
const lucesFocos=[];

// Posiciones: uno en el centro y cuatro alrededor
const posicionesFocos=[
    [0,0],
    [-4.2,-3.2],
    [4.2,-3.2],
    [-4.2,3.2],
    [4.2,3.2]
];

posicionesFocos.forEach(function(posicion){

    const foco=new THREE.Group();
    foco.position.set(posicion[0],6.85,posicion[1]);

    // Aro exterior gris del plafon
    const aro=new THREE.Mesh(
        new THREE.TorusGeometry(0.78,0.075,16,64),
        new THREE.MeshStandardMaterial({
            color:0xaaaaaa,
            roughness:0.5,
            metalness:0.1
        })
    );
    aro.rotation.x=Math.PI/2;
    foco.add(aro);

    // Difusor blanco visible, permanece en noche
    const difusor=new THREE.Mesh(
        new THREE.CircleGeometry(0.72,64),
        new THREE.MeshBasicMaterial({
            color:0xffffff,
            side:THREE.DoubleSide
        })
    );
    difusor.rotation.x=-Math.PI/2;
    difusor.position.y=-0.012;
    foco.add(difusor);

    // Halo suave alrededor del plafon
    const halo=new THREE.Mesh(
        new THREE.CircleGeometry(0.84,64),
        new THREE.MeshBasicMaterial({
            color:0xffffff,
            transparent:true,
            opacity:0.22,
            side:THREE.DoubleSide,
            depthWrite:false
        })
    );
    halo.rotation.x=-Math.PI/2;
    halo.position.y=-0.022;
    foco.add(halo);

    // El plafon queda visible tanto de dia como de noche
    foco.userData.focoCentral=true;
    foco.visible=true;
    scene.add(foco);
    focosTecho.push(foco);

    // Luz blanca debajo de cada foco
    const luz=new THREE.PointLight(
        0xffffff,
        2.8,      // intensidad aumentada
        18,        // alcance
        1
    );
    luz.position.set(posicion[0],6.45,posicion[1]);
    luz.userData.luzCentro=true;
    luz.visible=true;
    luz.castShadow=false;
    scene.add(luz);
    lucesFocos.push(luz);
});

// ========================================
// ========================================
// PISO
// ========================================

const radio=12;
const altura=7;

const texturaMarmol = textureLoader.load("./marmol.jpg");

texturaMarmol.wrapS = THREE.RepeatWrapping;
texturaMarmol.wrapT = THREE.RepeatWrapping;
texturaMarmol.repeat.set(5, 5);
texturaMarmol.encoding = THREE.sRGBEncoding;

const materialPiso = new THREE.MeshBasicMaterial({
    map: texturaMarmol,
    color: 0xffffff,
    side: THREE.DoubleSide
});

const piso=new THREE.Mesh(
new THREE.CircleGeometry(14,96),
materialPiso
);

piso.rotation.x=-Math.PI/2;
piso.receiveShadow=false;

scene.add(piso);

// ========================================
// PARED
// ========================================

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

// ========================================
// TECHO
// ========================================
const materialTecho = new THREE.MeshStandardMaterial({
    color:0x444444,
    roughness: 0.9,
    metalness: 0,
    side: THREE.DoubleSide
});

const techo=new THREE.Mesh(
new THREE.CircleGeometry(radio,96),
materialTecho
);

techo.rotation.x=Math.PI/2;
techo.position.y=altura;

scene.add(techo);

// ========================================
// BORDE
// ========================================

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

// ========================================
// CUADROS
// ========================================

function crearCuadro(nombre,angulo){

const ancho=3.3;
const alto=5.9;

// MARCO

const marco=new THREE.Mesh(
new THREE.BoxGeometry(
ancho+.35,
alto+.35,
.22
),
new THREE.MeshStandardMaterial({
    color:0x4b2e1f,
    roughness:0.85,
    metalness:0
})
);

marco.position.set(
Math.sin(angulo)*(radio-.20),
3.6,
Math.cos(angulo)*(radio-.20)
);

marco.rotation.y=angulo+Math.PI;

scene.add(marco);

// ========================================
// IMAGEN
// ========================================

// CORREGIDO:
// YA NO USA ./imagenes/

cargarImagen(
nombre,
function(textura){

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

console.log(
"CUADRO MOSTRADO:",
nombre
);

}
);


}

// ========================================
// 20 IMÁGENES
// ========================================

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


function crearColumna(angulo){

    const distanciaColumna=9;

    const x=Math.sin(angulo)*distanciaColumna;
    const z=Math.cos(angulo)*distanciaColumna;

 const material=new THREE.MeshStandardMaterial({
    color:0x555555,
    roughness:0.8,
    metalness:0.1
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

    columna.position.set(x,3.1,z);

    // IDENTIFICAR EL POSTE PARA CAMBIAR SU COLOR DÍA/NOCHE
    columna.userData.posteMuseo=true;

    scene.add(columna);


}

// 5 PILARES

crearColumna(0);
crearColumna(Math.PI/2);
crearColumna(Math.PI);
crearColumna(Math.PI*1.5);
crearColumna(Math.PI/4);

// ========================================
// HISTORIAS DE LOS BUSTOS
// ========================================

const bustosInteractivos=[];

const historiasBustos={

    // ====================================
    // BUSTO 1
    // ====================================
"busto.png":{
    titulo:"Personaje del Tinku",
    texto:
    "Esta representación está relacionada con el Tinku, una expresión cultural andina caracterizada por su música, vestimenta, danza y simbolismo. " +
    "En el contexto del Carnaval de Oruro, el Tinku forma parte de las expresiones folklóricas que muestran la diversidad cultural de Bolivia.",
    fuente:
    "Gobierno Autónomo Departamental de Oruro y fuentes culturales sobre el Carnaval de Oruro."
},

    // ====================================
    // BUSTO 2
    // ====================================
"ORU.PNG":{
    titulo:"El Doctorcito – Wayra Leva",
    texto:
    "Personaje de la danza de los Doctorcitos del Carnaval de Oruro. " +
    "Su máscara se caracteriza por los anteojos, la nariz prominente y el gran bigote. " +
    "Representa de forma satírica a los abogados y leguleyos.",
    fuente:
    "Fuente: UNESCO – Carnaval de Oruro."
},


    // ====================================
    // BUSTO 3
    // ====================================
"toba.png":{
    titulo:"Personaje de la Danza de los Tobas",
    texto:
    "La máscara representa un personaje de la danza de los Tobas del Carnaval de Oruro. " +
    "Su pintura facial y sus rasgos guerreros forman parte de la identidad visual de esta danza. " +
    "Entre sus personajes se encuentran el Toba, Chuncho, Cambas, Macheteros y Brujo.",
    fuente:
    "Fuente: Comité Departamental de Etnografía y Folklore de Oruro."
},

    // ====================================
    // BUSTO 4
    // ====================================

 "ne.png":{
    titulo:"La Negra María Antonieta",
    texto:
    "Personaje de la Morenada del Carnaval de Oruro. " +
    "Forma parte del relato tradicional de la danza y se caracteriza por sus movimientos y vestimenta.",
    fuente:
    "Fuente: Fraternidad Morenada Central Oruro y La Patria Bolivia."
},


    // ====================================
    // BUSTO 5
    // ====================================

    "bigo.png":{

        titulo:"Personaje de la tradición orureña",

        texto:
        "Esta representación destaca por sus rasgos marcados, adornos y elementos de vestuario. " +
        "Las máscaras y personajes del Carnaval permiten transmitir historias, creencias y tradiciones mediante la danza. " +
        "Esta riqueza artística forma parte de una celebración en la que participan miles de bailarines y músicos.",

        fuente:
        "UNESCO – Carnaval de Oruro."

    }

};

// ========================================
// BUSTOS
// ========================================

// ========================================
// CONTORNO BLANCO BRILLANTE PARA BUSTOS
// ========================================
function crearTexturaContorno(imagen){

    const canvas=document.createElement("canvas");
    canvas.width=imagen.width;
    canvas.height=imagen.height;

    const ctx=canvas.getContext("2d");

 // Limpiar el canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Brillo blanco alrededor de la imagen
ctx.shadowColor = "#ffffff";
ctx.shadowBlur = 90;

// IMPORTANTE: no desplazar la luz
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;

// Dibujar la imagen
ctx.drawImage(imagen, 0, 0);

// Crear textura
const textura = new THREE.CanvasTexture(canvas);
textura.encoding = THREE.sRGBEncoding;
textura.needsUpdate = true;

return textura;
}

// ========================================
// BUSTOS
// ========================================
function crearBustoPilar(archivo,angulo,ancho,alto){

    cargarImagen(archivo,function(textura){

        // MATERIAL ORIGINAL: IMAGEN CLARA Y SIN TRANSPARENCIA EXTRA
        const materialBusto=new THREE.MeshBasicMaterial({
            map:textura,
            transparent:true,
            alphaTest:0.02,
            opacity:1,
            side:THREE.DoubleSide,
            depthWrite:false
        });

        const geometriaBusto=new THREE.PlaneGeometry(ancho,alto);

        // CONTORNO BLANCO BRILLANTE
        const texturaContorno=crearTexturaContorno(textura.image);

        const materialContorno=new THREE.MeshBasicMaterial({
            map:texturaContorno,
            transparent:true,
            alphaTest:0.01,
            opacity:1,
            side:THREE.DoubleSide,
            depthWrite:false,
            blending:THREE.AdditiveBlending
        });

        // BUSTO ORIGINAL
        const busto=new THREE.Mesh(geometriaBusto,materialBusto);

        const distancia=8.35;
        const x=Math.sin(angulo)*distancia;
        const z=Math.cos(angulo)*distancia;

        busto.position.set(x,3.7,z);
        busto.rotation.y=angulo+Math.PI;
        busto.renderOrder=2;
        busto.castShadow=false;

        // CONTORNO: UN POCO MÁS GRANDE Y DETRÁS
        const contorno=new THREE.Mesh(
            new THREE.PlaneGeometry(ancho+0.25,alto+0.25),
            materialContorno
        );

        const distanciaContorno=8.37;
        contorno.position.set(
            Math.sin(angulo)*distanciaContorno,
            3.7,
            Math.cos(angulo)*distanciaContorno
        );

        contorno.rotation.y=angulo+Math.PI;
        contorno.renderOrder=1;

        // AGREGAR CONTORNO Y BUSTO
        scene.add(contorno);
        scene.add(busto);

        // INTERACCIÓN DEL BUSTO
        bustosInteractivos.push({
            objeto:busto,
            archivo:archivo,
            titulo:historiasBustos[archivo].titulo,
            texto:historiasBustos[archivo].texto
        });

        console.log("BUSTO MOSTRADO:",archivo);
    });
}
// ========================================
// 5 BUSTOS
// ========================================

crearBustoPilar(
"busto.png",
0,
2.2,
3.0
);

crearBustoPilar(
"ORU.PNG",
Math.PI,
2.2,
3.0
);

crearBustoPilar(
"toba.png",
Math.PI/2,
2.2,
3.0
);

crearBustoPilar(
"ne.png",
Math.PI*1.5,
2.2,
3.0
);

crearBustoPilar(
"bigo.png",
Math.PI/4,
2.3,
3.1
);

// Se eliminan las lámparas decorativas del techo: queda solo la luz central.

// ========================================
// MOVIMIENTO
// ========================================

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

// ========================================
// VELOCIDAD
// ========================================

const velocidad=0.065;

// ========================================
// DETECTAR CERCANÍA A LOS BUSTOS
// ========================================

const historiaBusto=
document.getElementById("historiaBusto");

const tituloHistoria=
document.getElementById("tituloHistoria");

const textoHistoria=
document.getElementById("textoHistoria");

function revisarCercaniaBustos(){

    let bustoCercano=null;

    let distanciaMenor=3.0;

    for(
        let i=0;
        i<bustosInteractivos.length;
        i++
    ){

        const busto=
        bustosInteractivos[i].objeto;

        const distancia=
        camera.position.distanceTo(
            busto.position
        );

        if(
            distancia<distanciaMenor
        ){

            distanciaMenor=distancia;

            bustoCercano=
            bustosInteractivos[i];

        }

    }

    if(bustoCercano){

        tituloHistoria.textContent=
        bustoCercano.titulo;

        textoHistoria.textContent=
        bustoCercano.texto;

        historiaBusto.style.display=
        "block";

    }else{

        historiaBusto.style.display=
        "none";

    }

}

// ========================================
// ANIMACIÓN
// ========================================

function animar(){

requestAnimationFrame(animar);
revisarCercaniaBustos();
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

// ALTURA

camera.position.y=1.7;

// LÍMITE

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

// ========================================
// INICIAR
// ========================================

animar();

// ========================================
// CAMBIO DE TAMAÑO
// ========================================

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
