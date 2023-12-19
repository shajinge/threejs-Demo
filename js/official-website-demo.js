import * as THREE from "three";
// 创建3D场景对象Scene
const scene = new THREE.Scene();
// 实例化一个透视投影相机对象
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2, false);
document.body.appendChild(renderer.domElement);

//创建一个长方体几何对象Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
//创建一个材质对象Material
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
