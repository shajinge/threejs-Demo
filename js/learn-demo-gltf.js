import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const scene = new THREE.Scene(); // 伽马校正后处理Shader
scene.background = new THREE.Color(0xf0f0f0);

let group = new THREE.Group();

// 创建GLTF加载器对象
const loader = new GLTFLoader();
// loader.load("/gltf/scren-demo/scene.gltf", function (gltf) {
loader.load("/gltf/A1.gltf", function (gltf) {
  console.log("控制台查看加载gltf文件返回的对象结构", gltf);
  console.log("gltf对象场景属性", gltf.scene);
  // 返回的场景对象gltf.scene插入到threejs场景中
  gltf.scene.scale.set(0.1, 0.1, 0.1);
  // 递归遍历所有模型节点批量修改材质
  gltf.scene.traverse(function (obj) {
    if (obj.isMesh) {
      console.log("gltf默认材质", obj.material);
      //   obj.frustumCulled = false;
      //   // 模型阴影
      //   obj.castShadow = true;
      //   // 模型自发光
        obj.material.emissive = obj.material.color;
        obj.material.emissiveMap = obj.material.map;
    }
  });
  group.add(gltf.scene);
  scene.add(group);
});
// 创建伽马校正通道
// const gammaPass = new ShaderPass(GammaCorrectionShader);
// scene.addPass(gammaPass);
// -- 画布基础搭建 ----------------------------------------------------------
// AxesHelper：辅助观察的坐标系
// three.js坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴，对于three.js的3D坐标系默认y轴朝上
// const axesHelper = new THREE.AxesHelper(150);
// scene.add(axesHelper);
// -- 光源 ----------------------------------------------------------
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);
// 实例化一个透视投影相机对象
// width和height用来设置Three.js输出的Canvas画布尺寸(像素px)
const width = window.innerWidth; //宽度
const height = window.innerHeight; //高度
// -- 相机位置 ----------------------------------------------------------
// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 3000);
// const camera = new THREE.PerspectiveCamera();
// 相机在Three.js三维坐标系中的位置
// 根据需要设置相机位置具体值
camera.position.set(4, 11, 27);
camera.lookAt(0, -4, 0); // 指向mesh对应的位置\
// -- 渲染器 ----------------------------------------------------------
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  outputColorSpace: THREE.SRGBColorSpace,
});
renderer.setSize(width, height);
// canvas上添加点击事件 ---------------------------
renderer.domElement.addEventListener("click", onMouseClick);
function onMouseClick(event) {
  //获取raycaster和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
  let intersects = getIntersects(event);
  // console.log(intersects);

  //获取选中最近的Mesh对象
  //instance坐标是对象，右边是类，判断对象是不是属于这个类的
  if (intersects.length !== 0 && intersects[0].object.type === "Mesh") {
    console.log(intersects[0].object);

    var selectObject = intersects[0].object;
    changeMaterial(selectObject);
  } else {
    console.log("未选中 Mesh!");
  }
}
//改变对象材质属性
function changeMaterial(object) {
  let material = new THREE.MeshLambertMaterial({
    color: 0xffffff * Math.random(),
    transparent: object.material.transparent ? false : true,
    opacity: 0.8,
  });
  object.material = material;
  // console.log(object.material);
}
// -------------------------------------------------------------
// camera.position.z = 5;
document.getElementById("webgl").appendChild(renderer.domElement);
// 渲染函数
function render() {
  //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
  //   stats.update();
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  // setTimeout(function () {
  renderer.render(scene, camera); //执行渲染操作
  // }, 1);
}
render();
// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener("change", function () {
  renderer.render(scene, camera); //执行渲染操作
  console.log("camera.position", camera.position);
}); //监听鼠标、键盘事件

//获取与射线相交的对象数组
function getIntersects(event) {
  event.preventDefault(); // 阻止默认的点击事件执行, https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault
  //console.log("event.clientX:" + event.clientX);
  //console.log("event.clientY:" + event.clientY);

  //声明 rayCaster 和 mouse 变量
  let rayCaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();

  //通过鼠标点击位置，计算出raycaster所需点的位置，以屏幕为中心点，范围-1到1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; //这里为什么是-号，没有就无法点中

  //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
  rayCaster.setFromCamera(mouse, camera);

  //获取与射线相交的对象数组， 其中的元素按照距离排序，越近的越靠前。
  //+true，是对其后代进行查找，这个在这里必须加，因为模型是由很多部分组成的，后代非常多。
  let intersects = rayCaster.intersectObjects(group.children, true);

  //返回选中的对象
  return intersects;
}
