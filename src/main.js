import * as THREE from 'three';
import * as $C from 'js-combinatorics';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import GUI from 'lil-gui'
import '../static/style.css'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 5000 );
const gui = new GUI();

const guiObject = {

}

const SIZE = 500
const STEP = SIZE/6
camera.position.set(-SIZE,SIZE,SIZE)

// Setting up renderers
const windowMULTIPLIER = 0.9
const renderer = new THREE.WebGLRenderer( { alpha: true });
renderer.setSize( window.innerWidth*windowMULTIPLIER, window.innerHeight*windowMULTIPLIER );
document.body.appendChild( renderer.domElement );

const labelRenderer2D = new CSS2DRenderer();
labelRenderer2D.setSize( window.innerWidth*windowMULTIPLIER, window.innerHeight*windowMULTIPLIER );
labelRenderer2D.domElement.style.position = 'absolute';
labelRenderer2D.domElement.style.top = '0px';
document.body.appendChild( labelRenderer2D.domElement );

const labelRenderer3D = new CSS3DRenderer();
labelRenderer3D.setSize( window.innerWidth*windowMULTIPLIER, window.innerHeight*windowMULTIPLIER );
labelRenderer3D.domElement.style.position = 'absolute';
document.body.appendChild( labelRenderer3D.domElement );

window.addEventListener('resize', function(){
    const width = window.innerWidth*windowMULTIPLIER;
    const height = window.innerHeight*windowMULTIPLIER;
    renderer.setSize(width, height);
    labelRenderer2D.setSize(width, height)
    camera.aspect = width/height
    camera.updateProjectionMatrix;

})

const controls = new OrbitControls( camera, labelRenderer3D.domElement );
controls.update()
// Creating initial plane and axes

const plane = new THREE.GridHelper( SIZE, 3 );
plane.translateX(SIZE/2).translateZ(SIZE/2)
scene.add(plane)
const material = new THREE.MeshBasicMaterial( { color: 0x000000} );
//const cube = new THREE.Mesh( new THREE.BoxGeometry(10, 10, 10), material );
//scene.add( cube );
const worldAxes = new THREE.AxesHelper(SIZE);
scene.add(worldAxes);


// Adding Axis labels

createDivWithLabel('Food Radical', [SIZE,0,0], 'axeslabel')
createDivWithLabel('Time Radical', [0,SIZE,0], 'axeslabel')
createDivWithLabel('Fasting Radical', [0,0,SIZE], 'axeslabel')

createDivWithLabel('Food Neutral', [SIZE/2,0,0], 'axeslabel')
createDivWithLabel('Time Neutral', [0,SIZE/2,0], 'axeslabel')
createDivWithLabel('Fasting Neutral', [0,0,SIZE/2], 'axeslabel')

createDivWithLabel('Food Purist', [STEP,0,0], 'axeslabel')
createDivWithLabel('Time Purist', [0,STEP*0.7,0], 'axeslabel')
createDivWithLabel('Fasting Purist', [0,0,STEP], 'axeslabel')

// Adding elements

createSquareElement('Breakfast is a meal eaten in the morning, it has to break your fast and has to include breakfast food.', [-STEP, 0, STEP], 'element')

function animate() {
	requestAnimationFrame( animate );
    controls.update()

	renderer.render( scene, camera );
    labelRenderer2D.render( scene, camera );
    labelRenderer3D.render( scene, camera)
}

function createDivWithLabel(text, position, label) {
    const obj = new THREE.Mesh( new THREE.SphereGeometry( 1, 1, 1), new THREE.MeshBasicMaterial( { color: 0x000000} ) );
    scene.add(obj)
    const element = document.createElement('div')
    element.className = label
    element.textContent = text
    element.style.marginTop = '-1em'
    const elementLabel = new CSS2DObject( element );
    elementLabel.position.set(...position)
    obj.add(elementLabel)
}

function createSquareElement(text, position, className){
    const element = document.createElement( 'div' );
    element.className = className;
	element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
    element.textContent = text;

    const objectCSS = new CSS3DObject( element );
    console.log(objectCSS)
    //objectCSS.applyMatrix4()
	objectCSS.position.set(...position)
    objectCSS.rotation.set(0,-1.57,0)
	
	scene.add( objectCSS );
}

animate();

const h1 = document.createElement('h1')
h1.textContent = '3D Alignment Chart'
document.body.appendChild( h1 );

function textGenerator(){
    const foodPurist =  'has to include breakfast food'
    const foodNeutral = 'can contain versatile food (eg. cheese on bread)'
    const foodRadical = 'can be any food'
    const timePurist = 'has to be eaten at morning time'
    const timeNeutral = 'has to be the first meal of the day, but time does not matter'
    const timeRadical = 'can be eaten at any time'
    const fastPurist = "has to break your overnight fasting"
    const fastNeutral = "doesn't necessarily has to be overnight fasting but you have to be hungry"
    const fastRadical = "can be eaten at any state of hunger or fasting" 
    
    const foodArr = [foodPurist, foodNeutral, foodRadical]
    const timeArr = [timePurist, timeNeutral, timeRadical]
    const fastArr = [fastPurist, fastNeutral, fastRadical]

    const keysObject = [
        {food:0, text:'has to include breakfast food'},
        {food:1, text: 'can contain versatile food (eg. cheese on bread)'},
        {food:2, text: 'can be any food'},
        {time:0, text: 'has to be eaten at morning time'},
        {time:1, text: 'has to be the first meal of the day, but time does not matter'},
        {time:2, text: 'can be eaten at any time'},
        {fasting:0, text: "has to break your overnight fasting"},
        {fasting:1, text: "doesn't necessarily has to be overnight fasting but you have to be hungry"},
        {fasting:2, text: "can be eaten at any state of hunger or fasting"},     
    ]

    

    let fullArr = [...foodArr, ...timeArr, ...fastArr]
    let itGo = new $C.Combination(fullArr, 3);

    
    const result = [...itGo].filter( 
        array => countRepeatWords(array, 'time') < 2
    ).filter(
        array => countRepeatWords(array, 'food') < 2
    ).filter(
        array => countRepeatWords(array, 'fasting') < 2
    )
    
    return result
}

function countRepeatWords(array, repeatWord){
    let counter = 0;
    array.forEach( string => {
        if ( string.includes(repeatWord) ) counter++  
    })
    return counter
}

textGenerator()