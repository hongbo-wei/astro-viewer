import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import * as THREE from 'three'

import { createSphereCoordinates } from '@/utils/coordinateUtils'

import { TELESCOPE_RANGES } from '../../data/telescopeRanges'

import styles from './index.module.scss'

import type { MOCData } from '../MOC';

interface CelestialSphereProps {
  className?: string
  enableRotation?: boolean // 是否允许旋转
  selectedTelescopes?: string[] // 选中的望远镜列表
  onRaycast?: (
    intersectionPoint: THREE.Vector3 | null,
    sphereCoords: any,
  ) => void // 3D射线投射回调，返回球面坐标用于RA/Dec转换
  showCoordinates?: boolean // 是否显示坐标信息
  currentCoordinates?: { ra: number; dec: number } | null // 当前坐标信息
  mocs?: MOCData[] // 新增：MOC 区域数据
}

// 望远镜颜色配置
const TELESCOPE_COLORS = {
  euclid: 0x4a90e2, // 蓝色
  desi: 0x50e3c2, // 青色
  twomass: 0xf5a623, // 橙色
  wise: 0xd0021b, // 红色
}

const CelestialSphere = forwardRef<any, CelestialSphereProps>(({
  className = '',
  selectedTelescopes,
  onRaycast,
  showCoordinates = false,
  currentCoordinates = null,
  enableRotation = true, // 默认允许旋转
  mocs = [], // 新增
}, ref) => {
  // --- MOC 区域渲染 ---
  // HEALPix 工具函数：给定 nside, ipix，返回球面四角顶点（单位球，theta/phi）
  function healpixCellVertices(nside: number, ipix: number) {
    // 这里只做简单近似，真实 HEALPix 需用 healpy/JS 实现更精确
    // 这里只取 cell 中心点，实际可用 JS healpix 库替换
    // 返回 [theta, phi] 数组（弧度）
    // 这里只做演示，实际建议用 healpix.js 或 mocpy-js
    // 这里只画点而非面，后续可扩展
    // 伪代码：返回 cell 中心点
    const npix = 12 * nside * nside;
    const f = ipix / npix;
    const theta = Math.acos(1 - 2 * f); // 0~pi
    const phi = 2 * Math.PI * f; // 0~2pi
    return [[theta, phi]];
  }

  // MOC 区域渲染
  useEffect(() => {
    if (!sceneRef.current) return;
    // 先移除旧的 MOC group
    const old = sceneRef.current.getObjectByName('mocGroup');
    if (old) sceneRef.current.remove(old);
    if (!mocs || mocs.length === 0) return;
    const group = new THREE.Group();
    group.name = 'mocGroup';
    mocs.forEach((moc) => {
      // 假设 moc.data 有 order 和 ranges 字段（mocpy 默认格式）
      const order = moc.data.order || moc.data.norder || 8;
      const ranges = moc.data.ranges || moc.data.uniq || [];
      const nside = Math.pow(2, order);
      // 展开所有 cell
      let ipixList: number[] = [];
      if (Array.isArray(ranges[0])) {
        // ranges: [[start, end], ...]
        ranges.forEach(([start, end]: [number, number]) => {
          for (let i = start; i < end; ++i) ipixList.push(i);
        });
      } else {
        // uniq: [ipix, ...]
        ipixList = ranges;
      }
      // 只画部分点，避免太多
      ipixList.slice(0, 200).forEach((ipix) => {
        const verts = healpixCellVertices(nside, ipix);
        verts.forEach(([theta, phi]) => {
          if (typeof theta === 'number' && typeof phi === 'number') {
            // 球面转笛卡尔
            const r = 1.001; // 稍大于球体，避免z-fighting
            const x = r * Math.sin(theta) * Math.cos(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(theta);
            // 生成灰度色，模拟DS9效果
            // 方案1：用ipix的hash做灰度
            const gray = 32 + (ipix * 97 % 192); // 32~223
            const color = (gray << 16) | (gray << 8) | gray;
            const geom = new THREE.SphereGeometry(0.004, 6, 6);
            const mat = new THREE.MeshBasicMaterial({
              color,
              transparent: false,
              opacity: 1.0,
              depthWrite: false,
            });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.set(x, y, z);
            group.add(mesh);
          }
        });
      });
    });
    sceneRef.current.add(group);
    // 清理函数
    return () => {
      if (sceneRef.current) sceneRef.current.remove(group);
    };
  }, [mocs]);
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<any>(null)
  const frameRef = useRef<number | null>(null)
  const celestialSphereRef = useRef<THREE.Mesh | null>(null) // 引用球体以进行射线投射
  const coverageGroupRef = useRef<THREE.Group>(new THREE.Group()) // 覆盖范围组
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(false)

  // 导出内部 cameraRef 和 celestialSphereRef，便于父组件 SelectionBox 通过 ref 获取 3D 射线投射所需对象
  useImperativeHandle(ref, () => ({
    getCamera: () => cameraRef.current,
    getSphere: () => celestialSphereRef.current,
    getMount: () => mountRef.current,
  }))

  // 创建望远镜覆盖范围几何体
  const createCoverageGeometry = (telescope: string) => {
    const range = TELESCOPE_RANGES[telescope.toLowerCase()]
    if (!range) return null

    // 将RA/Dec范围转换为球面坐标
    const raMin = (range.ra.min * Math.PI) / 180
    const raMax = (range.ra.max * Math.PI) / 180
    const decMin = (range.dec.min * Math.PI) / 180
    const decMax = (range.dec.max * Math.PI) / 180

    // 创建球面扇形几何体
    const geometry = new THREE.SphereGeometry(
      0.998, // 略小于天球半径，避免Z-fighting
      Math.max(8, Math.floor(((raMax - raMin) / Math.PI) * 32)), // 根据RA范围调整分段
      Math.max(8, Math.floor(((decMax - decMin) / Math.PI) * 16)), // 根据Dec范围调整分段
      raMin,
      raMax - raMin,
      Math.PI / 2 - decMax,
      decMax - decMin,
    )

    return geometry
  }

  // 3D射线投射函数 - 使用统一的坐标转换工具
  const performRaycast = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !celestialSphereRef.current)
      return

    const rect = mountRef.current.getBoundingClientRect()
    const mouse = new THREE.Vector2()

    // 将鼠标坐标标准化到-1到1范围
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // 创建射线投射器
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, cameraRef.current)

    // 检测与球体的交点
    const intersects = raycaster.intersectObject(celestialSphereRef.current)

    if (intersects.length > 0 && intersects[0]) {
      const intersectionPoint = intersects[0].point

      // 使用统一的坐标转换工具
      const sphereCoords = createSphereCoordinates(intersectionPoint)

      // 开发模式下的调试信息
      if (process.env.NODE_ENV === 'development') {
        // const screenCoords = sphereToScreen(
        //   sphereCoords,
        //   rect.width,
        //   rect.height,
        // )
        /*
        console.log('射线投射结果:', {
          鼠标位置: {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          },
          标准化鼠标: { x: mouse.x, y: mouse.y },
          交点: {
            x: intersectionPoint.x,
            y: intersectionPoint.y,
            z: intersectionPoint.z,
          },
          球面坐标: { x: sphereCoords.x, y: sphereCoords.y, z: sphereCoords.z },
          天文坐标: { ra: sphereCoords.ra, dec: sphereCoords.dec },
          预期屏幕坐标: screenCoords,
        })
        */
      }

      // 调用回调函数，传递标准化的球面坐标
      if (onRaycast) {
        onRaycast(intersectionPoint, sphereCoords)
      }
    } else {
      // 没有交点时传递null
      if (onRaycast) {
        onRaycast(null, null)
      }
    }
  }

  // 重置相机到初始位置的函数
  const resetCameraPosition = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(0, 0, 0.1);
    cameraRef.current.lookAt(1, 0, 0);
    if (controlsRef.current) {
      controlsRef.current.target.set(1, 0, 0);
      controlsRef.current.update();
    }
  };

  // 用 useEffect 进行副作用和清理
  useEffect(() => {
    if (!mountRef.current) return;
    const mountEl = mountRef.current;
    const containerWidth = mountEl.clientWidth;
    const containerHeight = mountEl.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerWidth / containerHeight,
      0.01,
      10
    );
    camera.position.set(0, 0, 0.1);
    camera.lookAt(1, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mountEl.appendChild(renderer.domElement);

    // Create sphere geometry
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    // 初始化材质时不带贴图
    const sphereMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
    });
    const celestialSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    celestialSphereRef.current = celestialSphere;
    scene.add(celestialSphere);

    // 异步加载银河贴图，加载完成后赋值给材质
    const loader = new THREE.TextureLoader();
    loader.load('/milkyway.jpg', (texture) => {
      sphereMaterial.map = texture;
      sphereMaterial.needsUpdate = true;
    });

    // Add some reference objects for debugging and orientation
    // Add a small bright sphere at the center as a reference point
    // const centerGeometry = new THREE.SphereGeometry(0.002, 8, 8)
    // const centerMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff4444,
    //   transparent: true,
    //   opacity: 0.3,
    // })
    // const centerSphere = new THREE.Mesh(centerGeometry, centerMaterial)
    // scene.add(centerSphere)

    // // Add coordinate axis helpers (更小的坐标轴)
    // const axisGroup = new THREE.Group()
    // // X-axis (red) - 缩小到更小的尺寸
    // const xGeometry = new THREE.CylinderGeometry(0.0005, 0.0005, 0.04, 6)
    // const xMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.4 })
    // const xAxis = new THREE.Mesh(xGeometry, xMaterial)
    // xAxis.rotation.z = Math.PI / 2
    // axisGroup.add(xAxis)
    // // Y-axis (green) - 缩小到更小的尺寸
    // const yGeometry = new THREE.CylinderGeometry(0.0005, 0.0005, 0.04, 6)
    // const yMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.4 })
    // const yAxis = new THREE.Mesh(yGeometry, yMaterial)
    // axisGroup.add(yAxis)
    // // Z-axis (blue) - 缩小到更小的尺寸
    // const zGeometry = new THREE.CylinderGeometry(0.0005, 0.0005, 0.04, 6)
    // const zMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.4 })
    // const zAxis = new THREE.Mesh(zGeometry, zMaterial)
    // zAxis.rotation.x = Math.PI / 2
    // axisGroup.add(zAxis)
    // scene.add(axisGroup)

    // Add some ambient lighting for better visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    // Add a point light to simulate a distant star
    const pointLight = new THREE.PointLight(0xffffff, 0.4)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // Import and setup OrbitControls
    const setupControls = async () => {
      const { OrbitControls } = await import(
        'three/examples/jsm/controls/OrbitControls.js'
      )

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.1 // Slightly faster damping to reduce lag
      controls.screenSpacePanning = true // 启用屏幕空间平移，允许上下左右360度自由平移
      controls.minDistance = 0 // 允许相机通过球心
      controls.maxDistance = 0.95 // Stay well within the sphere (radius = 1)
      controls.enablePan = true // 启用平移，但会通过事件监听器限制范围
      controls.enableZoom = true
      controls.enableRotate = true
      controls.rotateSpeed = 1.0 // Standard rotation speed
      controls.zoomSpeed = 1.0 // Standard zoom speed
      controls.panSpeed = 1.0 // Standard pan speed

      // Set initial target to center of sphere
      controls.target.set(1, 0, 0)
      controls.update()

      // 保存初始状态，以便reset功能正常工作
      controls.saveState()

      // 添加事件监听器来限制相机位置在球体内
      controls.addEventListener('change', () => {
        const cameraPosition = camera.position
        const distanceFromCenter = cameraPosition.length()
        if (distanceFromCenter > 0.95) {
          cameraPosition.normalize().multiplyScalar(0.95)
        }

        if (distanceFromCenter < 0.01) {
          // 如果相机太接近中心，保持最小距离
          cameraPosition.normalize().multiplyScalar(0.01)
        }
        // 同时限制target位置，防止通过平移移出球体
        const targetPosition = controls.target
        const targetDistance = targetPosition.length()
        if (targetDistance > 0.8) {
          // 限制target不要太接近球体边缘，给相机留出操作空间
          targetPosition.normalize().multiplyScalar(0.8)
        }
      })

      controlsRef.current = controls
    }

    setupControls()


    // Set loading to false after setup
    setTimeout(() => setIsLoading(false), 1000)

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      if (controlsRef.current) {
        controlsRef.current.update()
      }

      // 自动旋转已禁用，让用户通过鼠标控制旋转
      // if (enableRotationRef.current) {
      //   celestialSphere.rotation.y += 0.001
      // }

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !mountRef.current)
        return

      const newWidth = mountRef.current.clientWidth
      const newHeight = mountRef.current.clientHeight

      cameraRef.current.aspect = newWidth / newHeight
      cameraRef.current.updateProjectionMatrix()

      rendererRef.current.setSize(newWidth, newHeight)
    }

    // Add resize observer for responsive behavior
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountRef.current);

    // 清理函数
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      resizeObserver.disconnect();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      // starTexture.dispose(); // This line is removed as per the edit hint
    };
  }, []);

  // 覆盖层动态响应 selectedTelescopes 变化
  useEffect(() => {
    if (!sceneRef.current) return;
    // 清除现有的覆盖范围
    coverageGroupRef.current.clear();
    if (!selectedTelescopes || selectedTelescopes.length === 0) {
      return;
    }
    selectedTelescopes.forEach((telescope) => {
      if (telescope === 'all') return;
      const geometry = createCoverageGeometry(telescope);
      if (!geometry) return;
      const color =
        TELESCOPE_COLORS[
          telescope.toLowerCase() as keyof typeof TELESCOPE_COLORS
        ] || 0xffffff;
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = 1;
      coverageGroupRef.current.add(mesh);
    });
    sceneRef.current.add(coverageGroupRef.current);
  }, [selectedTelescopes]);

  // 响应 enableRotation 属性变化，动态控制 OrbitControls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enableRotate = !!enableRotation
      controlsRef.current.enableZoom = !!enableRotation
      controlsRef.current.enablePan = !!enableRotation
    }
  }, [enableRotation])

  return (
    <div
      ref={mountRef}
      className={`${styles.celestialSphere} ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onMouseMove={performRaycast} // 添加3D射线投射
    >
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          Loading Celestial Sphere...
        </div>
      )}

      {/* 重置视角按钮 - 移动到左上角 */}
      <button
        className={styles.resetButton}
        onClick={resetCameraPosition}
        title="Reset Camera Position"
      >
        🔄
      </button>

      {/* 坐标信息显示 - 添加到右上角 */}
      {showCoordinates && currentCoordinates && (
        <div className={styles.coordinateDisplay}>
          <div className={styles.coordinateItem}>
            RA: {currentCoordinates.ra.toFixed(3)}°
          </div>
          <div className={styles.coordinateItem}>
            Dec: {currentCoordinates.dec.toFixed(3)}°
          </div>
        </div>
      )}

      <div
        className={`${styles.controlsInfo} ${showControls ? styles.visible : styles.hidden}`}
      >
        <div>Drag to rotate</div>
        <div>Scroll to zoom</div>
        <div>Right-click + drag to pan</div>
        <div>Click 🔄 to reset view</div>
      </div>
    </div>
  )
})

export default CelestialSphere
