import THREE, {
  AxesHelper,
  BoxGeometry,
  FontLoader,
  Mesh,
  MeshBasicMaterial,
  MeshMatcapMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  TextGeometry,
  Texture,
  TextureLoader,
  TorusGeometry,
  WebGLRenderer,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "lil-gui";

export class App {
  private camera: PerspectiveCamera;
  private scene: Scene;
  private mesh: Mesh;
  private texture: Texture;
  private material: MeshBasicMaterial;
  private renderer: WebGLRenderer;
  private orbitCtrl: OrbitControls;
  private debug: GUI;
  private tmp: any;

  private debugParams: {
    texture: "Box texture" | "Color only";
  };

  /**
   * Based off the three.js docs: https://threejs.org/examples/?q=cube#webgl_geometry_cube
   */
  constructor() {
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.scene = new Scene();

    const axisHelper = new AxesHelper(2);
    this.scene.add(axisHelper);

    this.texture = new TextureLoader().load(
      "images/textures/mat-cap-libigl.png"
    );

    const geometry = new BoxGeometry(1, 1, 1);
    this.material = new MeshBasicMaterial({ map: this.texture });

    const fontLoader = new FontLoader();
    fontLoader.load("fonts/optimer_bold.typeface.json", (font) => {
      const geometry = new TextGeometry(
        "Andry\nSafidy\nTsiory\nLyda\nBrillant",
        {
          font,
          size: 0.4,
          height: 0.1,
          bevelEnabled: true,
          curveSegments: 5,
          bevelThickness: 0.05,
          bevelOffset: 0,
          bevelSegments: 5,
          bevelSize: 0.02,
        }
      );
      geometry.center();
      const material = new MeshMatcapMaterial({ matcap: this.texture });
      this.texture.wrapS = RepeatWrapping;
      // this.debug.add(material, "wireframe");

      const text = new Mesh(geometry, material);
      this.scene.add(text);
    });

    this.debug = new GUI();
    this.debug.domElement.style.opacity = "0.4";
    this.debug.domElement.style.width = "400px";
    this.debug.domElement.style.padding = "0.5rem";
    this.debug.close();
    this.debug.domElement.addEventListener("mouseenter", () => {
      this.debug.domElement.style.opacity = "1";
    });
    this.debug.domElement.addEventListener("mouseleave", () => {
      this.debug.domElement.style.opacity = "0.4";
    });

    this.debugParams = {
      texture: "Color only",
    };

    this.mesh = new Mesh(geometry, this.material);
    this.mesh.rotation.reorder("YXZ");
    // this.scene.add(this.mesh);

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0); // the default
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.orbitCtrl = new OrbitControls(this.camera, this.renderer.domElement);

    document.body.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.onWindowResize.bind(this), false);

    this.setting();

    this.animate();
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.renderer.render(this.scene, this.camera);
  }

  private setting(): void {
    this.camera.position.z = 3;
    this.mesh.position.set(1, 0, 0);
    this.orbitCtrl.enableDamping = true;

    const geometry = new TorusGeometry(0.5, 0.3, 20, 20);
    const material = new MeshMatcapMaterial({ matcap: this.texture });

    for (let i = 0; i < 100; i++) {
      const mesh = new Mesh(geometry, material);
      mesh.position.x = (Math.random() - 0.5) * 15;
      mesh.position.y = (Math.random() - 0.5) * 15;
      mesh.position.z = (Math.random() - 0.5) * 15;
      mesh.rotation.x = Math.random() * Math.PI * 0.5;
      mesh.rotation.y = Math.random() * Math.PI * 0.5;
      this.scene.add(mesh);
    }

    for (let i = 0; i < 1000; i++) {
      const mesh = new Mesh(geometry, material);
      mesh.position.x = (Math.random() - 0.5) * 50;
      mesh.position.y = (Math.random() - 0.5) * 50;
      mesh.position.z = (Math.random() - 0.5) * 50;
      mesh.rotation.x = Math.random() * Math.PI * 0.5;
      mesh.rotation.y = Math.random() * Math.PI * 0.5;
      this.scene.add(mesh);
    }
    this.orbitCtrl.autoRotate = true;
    this.orbitCtrl.autoRotateSpeed = 0.8;
  }

  private render(): void {
    if (!this.debug._closed) {
      this.debug.domElement.style.opacity = "1";
    }
    this.orbitCtrl.update();
    // this.camera.lookAt(this.mesh.position);
  }
}

new App();
