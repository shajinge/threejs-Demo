import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
var scene,
  camera,
  renderer,
  poiObjects = [];

var width = window.innerWidth;
var height = window.innerHeight;

function initThree() {
  //场景
  scene = new THREE.Scene();
  //镜头
  camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 100);
  camera.position.set(0, 0, 0.01);
  //渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.getElementById("webgl").appendChild(renderer.domElement);
  //镜头控制器
  var controls = new OrbitControls(camera, renderer.domElement);

  var materials = [];
  //根据右左上下前后的顺序构建六个面的材质集
  var texture_right = new THREE.TextureLoader().load("../images/r.jpg");
  materials.push(new THREE.MeshBasicMaterial({ map: texture_right }));

  var texture_left = new THREE.TextureLoader().load("../images/l.jpg");
  materials.push(new THREE.MeshBasicMaterial({ map: texture_left }));

  var texture_top = new THREE.TextureLoader().load("../images/u.jpg");
  materials.push(new THREE.MeshBasicMaterial({ map: texture_top }));

  var texture_bottom = new THREE.TextureLoader().load("../images/d.jpg");
  materials.push(new THREE.MeshBasicMaterial({ map: texture_bottom }));

  var texture_front = new THREE.TextureLoader().load("../images/f.jpg");
  materials.push(new THREE.MeshBasicMaterial({ map: texture_front }));

  var texture_back = new THREE.TextureLoader().load("../images/b.jpg");
  materials.push(new THREE.MeshBasicMaterial({ map: texture_back }));

  var box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
  scene.add(box);

  box.geometry.scale(1, 1, -1);

  var fruitPoints = [
    {
      position: {
        x: 0,
        y: 0,
        z: -0.2,
      },
      detail: {
        title: "信息点1",
      },
    },
    {
      position: {
        x: -0.2,
        y: -0.05,
        z: 0.2,
      },
      detail: {
        title: "信息点2",
      },
    },
  ];

  var pointTexture = new THREE.TextureLoader().load("../images/fruit.jpg");
  var material = new THREE.SpriteMaterial({ map: pointTexture });

  for (var i = 0; i < fruitPoints.length; i++) {
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(0.1, 0.1, 0.1);
    sprite.position.set(
      fruitPoints[i].position.x,
      fruitPoints[i].position.y,
      fruitPoints[i].position.z
    );
    sprite.detail = fruitPoints[i].detail;
    poiObjects.push(sprite);

    scene.add(sprite);
  }

  loop();
}
document.querySelector("#webgl").addEventListener("click", function (event) {
  event.preventDefault();

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  mouse.x = (event.clientX / width) * 2 - 1;
  mouse.y = -(event.clientY / height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(poiObjects);
  if (intersects.length > 0) {
    alert("点击了热点" + intersects[0].object.detail.title);
  }
});

//帧同步重绘
function loop() {
  requestAnimationFrame(loop);
  renderer.render(scene, camera);
}

window.onload = initThree;
