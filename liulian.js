import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import TWEEN from "@tweenjs/tween.js";
var scene,
  camera,
  renderer,
  poiObjects = [],
  countI = 0;

var width = window.innerWidth;
var height = window.innerHeight;

function initThree() {
  //场景
  scene = new THREE.Scene();
  //镜头
  camera = new THREE.PerspectiveCamera(90, width / height, 0.01, 100);
  camera.position.set(0, 0, 0.01);
  //渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.getElementById("webgl").appendChild(renderer.domElement);
  //镜头控制器
  var controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableZoom = false; //禁止缩放
  setBox();

  render();
}
function setBox() {
  var materials = [];
  var texture_right,
    texture_left,
    texture_top,
    texture_bottom,
    texture_front,
    texture_back;
  //根据右左上下前后的顺序构建六个面的材质集
  if (countI % 2 === 0) {
    texture_right = new THREE.TextureLoader().load("./images/r.jpg");
    materials.push(new THREE.MeshBasicMaterial({ map: texture_right }));

    texture_left = new THREE.TextureLoader().load("./images/l.jpg");
    materials.push(new THREE.MeshBasicMaterial({ map: texture_left }));

    texture_top = new THREE.TextureLoader().load("./images/u.jpg");
    materials.push(new THREE.MeshBasicMaterial({ map: texture_top }));

    texture_bottom = new THREE.TextureLoader().load("./images/d.jpg");
    materials.push(new THREE.MeshBasicMaterial({ map: texture_bottom }));

    texture_front = new THREE.TextureLoader().load("./images/f.jpg");
    materials.push(new THREE.MeshBasicMaterial({ map: texture_front }));

    texture_back = new THREE.TextureLoader().load("./images/b.jpg");
    materials.push(new THREE.MeshBasicMaterial({ map: texture_back }));
  } else {
    texture_left = new THREE.TextureLoader().load("./images/scene_left.jpeg");
    materials.push(new THREE.MeshBasicMaterial({ map: texture_left }));

    texture_right = new THREE.TextureLoader().load("./images/scene_right.jpeg");
    materials.push(new THREE.MeshBasicMaterial({ map: texture_right }));

    texture_top = new THREE.TextureLoader().load("./images/scene_top.jpeg");
    materials.push(new THREE.MeshBasicMaterial({ map: texture_top }));

    texture_bottom = new THREE.TextureLoader().load(
      "./images/scene_bottom.jpeg"
    );
    materials.push(new THREE.MeshBasicMaterial({ map: texture_bottom }));

    texture_front = new THREE.TextureLoader().load("./images/scene_front.jpeg");
    materials.push(new THREE.MeshBasicMaterial({ map: texture_front }));

    texture_back = new THREE.TextureLoader().load("./images/scene_back.jpeg");
    materials.push(new THREE.MeshBasicMaterial({ map: texture_back }));
  }

  var box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
  scene.add(box);

  box.geometry.scale(1, 1, -1);

  var fruitPoints = [
    {
      position: {
        x: 0,
        y: 0.2,
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

  var pointTexture = new THREE.TextureLoader().load("./images/fruit.jpg");
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
    countI++;
    var clickedFruit = intersects[0];
    console.log(clickedFruit);
    new TWEEN.Tween(camera.position)
      .to(
        {
          x: clickedFruit.object.position.x,
          y: clickedFruit.object.position.y,
          z: clickedFruit.object.position.z + 0.02,
        },
        2000
      )
      .start()
      .easing(TWEEN.Easing.Quadratic.Out) //使用二次缓动函数
      .onComplete(function () {
        setBox();
        camera.position.set(0, 0, 0.01);
        camera.lookAt(0, 0, 0);
      });
  }
});

//帧同步重绘
function render() {
  TWEEN.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

window.onload = initThree;
