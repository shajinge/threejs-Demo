// 现在浏览器支持ES6语法，自然包括import方式引入js文件
import * as THREE from "three";
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//引入性能监视器stats.js
// import Stats from "three/addons/libs/stats.module.js";
// 创建3D场景对象Scene
const scene = new THREE.Scene();
//创建一个长方体几何对象Geometry
const geometry = new THREE.BoxGeometry(1, 0.7, 5);
//创建一个材质对象Material

const greenhouseMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff, //0xff0000设置材质颜色为红色
  transparent: true, //开启透明
  shininess: 20, //高光部分的亮度，默认30
  specular: 0x444444, //高光部分的颜色
  opacity: 0.6, //设置透明度
  //   side: THREE.DoubleSide,
});

// 大棚底座
// 两个参数分别为几何体geometry、材质material
const mesh = new THREE.Mesh(geometry, greenhouseMaterial); //网格模型对象Mesh
mesh.position.set(1, -1, -2);
// scene.add(mesh);
// 大棚顶部
// CylinderGeometry：圆柱
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5);
// 两个参数分别为几何体geometry、材质material
const cylinderMesh = new THREE.Mesh(cylinderGeometry, greenhouseMaterial); //网格模型对象Mesh
cylinderMesh.position.set(1, -0.65, -2);
cylinderMesh.rotateX(Math.PI / 2);
// scene.add(cylinderMesh);
const group = new THREE.Group();
group.add(cylinderMesh);
group.add(mesh);
group.name = "一号大棚";
scene.add(group);

//类型化数组创建顶点数据
//创建一个空的几何体对象
const bufferGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  // 0, 0, 0, //顶点1坐标
  // 80, 0, 0, //顶点2坐标
  // 80, 80, 0, //顶点3坐标
  // 0, 0, 0, //顶点4坐标   和顶点1位置相同
  // 80, 80, 0, //顶点5坐标  和顶点3位置相同
  // 0, 80, 0, //顶点6坐标
  0,
  0,
  0, //顶点1坐标
  80,
  0,
  0, //顶点2坐标
  80,
  80,
  0, //顶点3坐标
  0,
  80,
  0, //顶点4坐标
]);
// Uint16Array类型数组创建顶点索引数据
const indexes = new Uint16Array([
  // 下面索引值对应顶点位置数据中的顶点坐标
  0, 1, 2, 0, 2, 3,
]);
bufferGeometry.index = new THREE.BufferAttribute(indexes, 1); //1个为一组
// 创建属性缓冲区对象
//3个为一组，表示一个顶点的xyz坐标
const attribue = new THREE.BufferAttribute(vertices, 3);
bufferGeometry.attributes.position = attribue;
// 点渲染模式
const material = new THREE.PointsMaterial({
  color: 0xffff00,
  size: 10.0, //点对象像素尺寸
});
const points = new THREE.Points(bufferGeometry, material); //点模型对象
scene.add(points);

// 线材质对象
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xff0000, //线条颜色
});
// 创建线模型对象
// const line = new THREE.Line(geometry, lineMaterial);
// const line = new THREE.LineLoop(geometry, lineMaterial);
const line = new THREE.LineSegments(cylinderGeometry, lineMaterial);
scene.add(line);

// 纹理贴图
const planeGeometry = new THREE.BoxGeometry(2, 2, 2);
//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load("./../images/image.png");
const meshLambertMaterial = new THREE.MeshLambertMaterial({
  // 设置纹理贴图：Texture对象作为材质map属性的属性值
  map: texture, //map表示材质的颜色贴图属性
});
const w = new THREE.Mesh(planeGeometry, meshLambertMaterial);
w.position.set(2, 2, 5);
scene.add(w);

// //new THREE.Vector3()实例化一个三维向量对象
// const v3 = new THREE.Vector3(0,0,0);
// console.log('v3', v3);
// v3.set(10,0,0);//set方法设置向量的值
// console.log('v3', v3);

//环境光:没有特定方向，整体改变场景的光照明暗
// const ambient = new THREE.AmbientLight(0xffffff, 0.8);
// scene.add(ambient);
// 点光源：两个参数分别表示光源颜色和光照强度
// 参数1：0xffffff是纯白光,表示光源颜色
// 参数2：1.0,表示光照强度，可以根据需要调整
// const pointLight = new THREE.PointLight(0xffffff, 1.0);
// //点光源位置
// pointLight.position.set(200, 30, 50); // 点光源放在x轴上
// scene.add(pointLight); // 点光源添加到场景中
// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
directionalLight.position.set(200, 500, 300);
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
directionalLight.target = mesh;
scene.add(directionalLight);

// 实例化一个透视投影相机对象
// width和height用来设置Three.js输出的Canvas画布尺寸(像素px)
const width = window.innerWidth; //宽度
const height = window.innerHeight; //高度
// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
// const camera = new THREE.PerspectiveCamera();
// 相机在Three.js三维坐标系中的位置
// 根据需要设置相机位置具体值
camera.position.set(26, 12, 21);
camera.lookAt(-0.5, 0, 0); // 指向mesh对应的位置
// camera.position.z = 5;

// // 随机创建大量的模型,测试渲染性能
// const num = 1000; //控制长方体模型数量
// for (let i = 0; i < num; i++) {
//     const geometry = new THREE.BoxGeometry(5, 5, 5);
//     const material = new THREE.MeshLambertMaterial({
//         color: 0x00ffff
//     });
//     const mesh = new THREE.Mesh(geometry, material);
//     // 随机生成长方体xyz坐标
//     const x = (Math.random() - 0.5) * 200
//     const y = (Math.random() - 0.5) * 200
//     const z = (Math.random() - 0.5) * 200
//     mesh.position.set(x, y, z)
//     scene.add(mesh); // 模型对象插入场景中
// }

// --- 辅助 start -----------------------------------------------------------------------
// DirectionalLightHelper：可视化平行光
const dirLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  5,
  0xff0000
);
scene.add(dirLightHelper);
// AxesHelper：辅助观察的坐标系
// three.js坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴，对于three.js的3D坐标系默认y轴朝上
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);
// --- 辅助 end -----------------------------------------------------------------------

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
// document.body.appendChild(renderer.domElement);
document.getElementById("webgl").appendChild(renderer.domElement);
// //创建stats对象
// const stats = new Stats();
// //stats.domElement:web页面上输出计算结果,一个div元素，
// document.body.appendChild(stats.domElement);
// 渲染函数
function render() {
  //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
  //   stats.update();
  renderer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}
render();
// function animate() {
//   requestAnimationFrame(animate);

//   mesh.rotation.x += 0.01;
//   mesh.rotation.y += 0.01;

// renderer.render(scene, camera);
// }
// window.onresize = function () {
//   // 重置渲染器输出画布canvas尺寸
//   renderer.setSize(width, height);
//   // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
// //   camera.aspect = width / height;
//   // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
//   // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
//   // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
//   camera.updateProjectionMatrix();
// };
// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener("change", function () {
  renderer.render(scene, camera); //执行渲染操作

  console.log("camera.position", camera.position);
}); //监听鼠标、键盘事件

// animate();
