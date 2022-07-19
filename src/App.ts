import THREE, {
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Texture,
  TextureLoader,
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

    this.texture = new TextureLoader().load("images/textures/crate.gif");

    const geometry = new BoxGeometry(1, 1, 1);
    this.material = new MeshBasicMaterial({
      color: 0xffeedd,
      wireframe: false,
      map: this.texture,
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
    this.scene.add(this.mesh);

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

    this.debug
      .add(this.mesh.position, "x")
      .name("X position")
      .min(-3)
      .max(3)
      .step(0.1);
    this.debug
      .add(this.mesh.position, "y")
      .name("Y position")
      .min(-3)
      .max(3)
      .step(0.1);
    this.debug
      .add(this.mesh.position, "z")
      .name("Z position")
      .min(-3)
      .max(3)
      .step(0.1);
    this.debug.addColor(this.material, "color").name("Mesh color");
    this.debug.add(this.material, "wireframe").name("Wireframe");
    this.debug
      .add(this.debugParams, "texture", ["Color only", "Box texture"])
      .name("Texture")
      .onChange(() => {
        if (this.debugParams.texture === "Box texture") {
          console.log("Box texture");
        } else if (this.debugParams.texture === "Color only") {
          console.log("Color only");
        }
      });
  }

  private render(): void {
    if (!this.debug._closed) {
      this.debug.domElement.style.opacity = "1";
    }
    this.orbitCtrl.update();
    this.camera.lookAt(this.mesh.position);
    this.mesh.rotation.y += 0.01;
  }
}

new App();
