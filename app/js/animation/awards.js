class AwardsAnimation {
  AWARDS_COUNT = 8;
  constructor() {
    this.run = false;

    this.canvas = document.getElementById('awardsCanvas');

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(
      this.canvas.getBoundingClientRect().width,
      this.canvas.getBoundingClientRect().height
    );
    // this.renderer.setClearColor(0x000000, 0.3);

    const aspect =
      this.canvas.getBoundingClientRect().width /
      this.canvas.getBoundingClientRect().height;
    const d = 50;

    this.camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      0.01,
      10000
    );

    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, -1);
    this.camera.updateMatrix();

    this.clock = new THREE.Clock(true);

    this.scene = new THREE.Scene();

    // this.axesHelper = new THREE.AxesHelper(100, 100, 100);
    // this.scene.add(this.axesHelper);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(this.ambientLight);

    this.awardTexture = null;
    this.planes = [];
    const loader = new THREE.TextureLoader();
    loader.load(
      `${HOST_BASE_URL}/static/oscar.png`,
      function (texture) {
        this.init(texture);
      }.bind(this)
    );

    loader.load(
      `${HOST_BASE_URL}/static/award-1.png`,
      function (texture) {
        this.init(texture);
      }.bind(this)
    );
    loader.load(
      `${HOST_BASE_URL}/static/award-2.png`,
      function (texture) {
        this.init(texture);
      }.bind(this)
    );
    loader.load(
      `${HOST_BASE_URL}/static/award-3.png`,
      function (texture) {
        this.init(texture);
      }.bind(this)
    );
    loader.load(
      `${HOST_BASE_URL}/static/award-4.png`,
      function (texture) {
        this.init(texture);
      }.bind(this)
    );

    // this.awardTexture = THREE.ImageUtils.loadTexture(
    //   `${HOST_BASE_URL}/static/circle.png`
    // );

    // // this.plane = new THREE.Mesh(
    // //     new THREE.PlaneGeometry(
    // //         this.awardTexture.image.width,
    // //         this.awardTexture.image.height,
    // //     ),
    // //     new THREE.MeshBasicMaterial({
    // //         map: this.awardTexture.texture
    // //     })
    // // )
    // console.log('Awards texture: ', this.awardTexture);
    // console.log('Awards texture: ', this.awardTexture.image);
    // console.log('Awards texture: ', this.awardTexture.image.width);
    // console.log('Awards texture: ', this.awardTexture.image.height);
  }

  init(texture, count = 1) {
    // this.awardTexture = texture;
    const textureAspect =texture.image.width / texture.image.height;
    const PLANE_SIZE = 10;
    for (let i = 0; i < count; i++) {
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0
        // color: 0xffffff,
      });
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(PLANE_SIZE * textureAspect, PLANE_SIZE),
        material
      );
      //   plane.position.x += 30 * i
      plane.userData = {
        speed: 3 + Math.random() * 2,
        force: {
          x: 1.0 - Math.random() * 2.0,
          y: 15.0,
        },
      };
      this.planes.push(plane);
      this.scene.add(plane);
    }
    console.log(this.scene);
    // this.plane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(
    //     // this.awardTexture.image.width,
    //     // this.awardTexture.image.height
    //     PLANE_SIZE * textureAspect,
    //     PLANE_SIZE
    //   ),
    //   new THREE.MeshLambertMaterial({
    //     map: this.awardTexture,
    //     side: THREE.DoubleSide,
    //     transparent: true,
    //     opacity: 0.0,
    //     // color: 0xffffff,
    //   })
    // );
    // this.scene.add(this.plane);
    console.log('Awards texture: ', texture);
    console.log('Awards texture: ', texture.image);
    console.log('Awards texture: ', texture.image.width);
    console.log('Awards texture: ', texture.image.height);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    const dt = this.clock.getDelta();
    if (!this.run) return;
    for (const plane of this.planes) {
      const distance = plane.position.distanceTo(new THREE.Vector3(0, 0, 0));
      plane.material.opacity = Math.cos(distance / 10);
      plane.position.y += plane.userData.force.y * plane.userData.speed * dt;
      plane.position.x += plane.userData.force.x * plane.userData.speed * dt;
      plane.userData.force.y -= 10 * dt;
      plane.scale.set(
        plane.scale.x + 1.0 * dt,
        plane.scale.y + 1.0 * dt,
        plane.scale.z + 1.0 * dt,
      );
      if (distance > 40) {
        (plane.userData.force.x = 2.5 * (1.0 - Math.random() * 2.0)),
          (plane.userData.force.y = 5.0);
        plane.position.x = 0;
        plane.position.y = 0;
        plane.material.opacity = 0.0;
        plane.scale.set(1.0, 1.0, 1.0)
      }
    }
    // this.plane.position.y += 10 * dt
    // if (this.plane) {
    //   this.plane.material.opacity = Math.min(
    //     this.plane.material.opacity + 0.5 * dt,
    //     1.0
    //   );
    // }
  }

  start() {
    this.run = true;
    for (const plane of this.planes) {
      (plane.userData.force.x = 2.5 * (1.0 - Math.random() * 2.0)),
        (plane.userData.force.y = 5.0);
      plane.position.x = 0;
      plane.position.y = 0;
      plane.material.opacity = 0.0;
      plane.scale.set(1.0, 1.0, 1.0)
    }
  }

  stop() {
    this.run = false;
    for (const plane of this.planes) {
      plane.material.opacity = 0.0;
    }
  }
}

const awardAnimation = new AwardsAnimation();
function awardsAnimate() {
  requestAnimationFrame(awardsAnimate);
  awardAnimation.update();

  awardAnimation.render();
}

awardsAnimate();

// const awardsCanvas = document.getElementById('awardsCanvas');
const folder = document.getElementById('awardsFolder');

folder.onmouseover = () => {
  awardAnimation.start();
};

folder.onmouseout = () => {
  awardAnimation.stop();
};
