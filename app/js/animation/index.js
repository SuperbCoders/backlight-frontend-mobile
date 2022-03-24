const HOST_BASE_URL = 'js/animation/';


class Animation {
   BLUR_MAX_SPEED = 50;
   TOGGLE_BACKGROUND_ANGLE_SPEED = Math.PI / 1.0;
   BUFFER_PLANE_SIZE = 200;

  __getFovByAspect(a){
    if (a > 1.0){
      if (a <= 1.5){
        return 90 - 18 * a
      }
      if (a <= 2.0){
        return 65 - 30 * (a - 1.5)
      }
      if (a <= 2.5){
        return 50 - 20 * (a - 2.0)
      }
      if (a > 2.5){
        return 40 - 20 * (a - 2.5)
      }
    }
    else{
      if (a > 0.9){
        return 80
      }
      if (a > 0.8){
        return 87.5
      }
      if (a > 0.7){
        return 95
      }
      if (a > 0.5){
        return 105
      }

      if (a > 0.4){
        return 115
      }

      return 125
    }
  }

  constructor() {
    // Отображение
    this.canvas = document.getElementById('mainCanvas');
    this.canvas.width = this.canvas.getBoundingClientRect().width
    this.canvas.height = this.canvas.getBoundingClientRect().height
    this.renderedScene = new THREE.Scene();
    const d = 70;
    const aspect =
      this.canvas.getBoundingClientRect().width /
      this.canvas.getBoundingClientRect().height;
    const ra = 1.0 / aspect
    this.rttCamera = new THREE.PerspectiveCamera(
      this.__getFovByAspect(aspect),
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.rttCamera.position.set(0, 0, 100);
    this.rttCamera.lookAt(0, 0, -1);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.renderer.setSize(
      this.canvas.getBoundingClientRect().width,
      this.canvas.getBoundingClientRect().height
    );


    this.bufferTexture = new THREE.WebGLRenderTarget(
      this.canvas.getBoundingClientRect().width * 2,
      this.canvas.getBoundingClientRect().height  * 2,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        antialias: true,
      }
    );

    
    this.bufferPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(this.BUFFER_PLANE_SIZE, this.BUFFER_PLANE_SIZE / aspect),
      new THREE.MeshBasicMaterial({
        map: this.bufferTexture.texture,
      })
      
    );
    

    

    // Сцена
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.objects = new THREE.Group();
    this.scene.add(this.objects);

    this.models = new THREE.Group();
    this.objects.add(this.models);

    this.gModel = null;
    this.gModelSpeed = new THREE.Vector3(0, 0, 0);
    this.bluredCircle = null;

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

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionalLight.position.set(0, 0, 100);
    this.models.add(this.directionalLight);

    this.clock = new THREE.Clock(true);
    //// Основная модель лампы

    const loader = new THREE.GLTFLoader();
    loader.crossOrigin = 'same-origin';
    loader.load(
      `${HOST_BASE_URL}/static/g.gltf`,
      function (gltf) {
        gltf.scene.traverse(function (child) {
          if (child.isMesh) {
            const m = child;
            m.receiveShadow = true;
            m.castShadow = true;
          }
          if (child.isLight) {
            const l = child;
            l.castShadow = true;
            l.shadow.bias = -0.003;
            l.shadow.mapSize.width = 2048;
            l.shadow.mapSize.height = 2048;
          }
        });
        this.gModel = gltf.scene;
        this.models.add(this.gModel);
        this.gModel.scale.set(0.8, 0.8, 0.8);
        this.gModel.rotation.x = -Math.PI * 0.05;
        this.gModel.rotation.y = Math.PI * 0.15;

        this.gModelMaterial = new THREE.MeshPhongMaterial({
          color: 0xdddddd,
          specular: 0x00bb00,
          shininess: 30,
          flatShading: true,
        });
      }.bind(this)
    );

    //// Зеленое пятно на фоне

    this.blur = {};
    this.blur.texture = THREE.ImageUtils.loadTexture(
      `${HOST_BASE_URL}/static/circle.png`
    );
    this.blur.material = new THREE.MeshLambertMaterial({
      map: this.blur.texture,
      transparent: true,
      color: 0xaaffaa,
    });
    this.blur.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(150, 150),
      this.blur.material
    );

    // Анимация переворота

    

    this.toggle = {
      isStarted: false,
      angle: 0,
      frontSide: true,
      zStart: 0,
    };


    
    

    

    


    
    



    

    

    

    

    

    this.group = new THREE.Group();
    this.renderedScene.add(this.group);
    const BUFFER_PLANE_OFFSET = 0;

    this.bufferPlane.position.z = BUFFER_PLANE_OFFSET;
    this.group.add(this.bufferPlane);

    this.backgroundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(
        this.BUFFER_PLANE_SIZE * 8,
        (this.BUFFER_PLANE_SIZE * 8) / aspect
      ),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      })
    
    );
    new THREE.TextureLoader().load(
      `${HOST_BASE_URL}/static/bl-bg.png`,
      function (texture) {
        this.backgroundPlane.material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        });
        console.log('Background texture: ', this.backgroundPlane.material);
      }.bind(this)
    );

    this.backgroundPlane.position.z = -this.BUFFER_PLANE_SIZE * 2 + 1;
    this.renderedScene.add(this.backgroundPlane);

    this.backgroundBlack = new THREE.Mesh(
      new THREE.PlaneGeometry(this.BUFFER_PLANE_SIZE, this.BUFFER_PLANE_SIZE / aspect),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
      })
    );
    this.backgroundBlack.rotation.y = Math.PI;
    this.backgroundBlack.position.z = BUFFER_PLANE_OFFSET - 0.01;
    this.group.add(this.backgroundBlack);
    this.blur.plane.material.side = THREE.DoubleSide;
    this.blur.plane.position.z = -500;

    this.models.add(this.blur.plane);

    this.blur.speedX = this.BLUR_MAX_SPEED;
    this.blur.speedY = this.BLUR_MAX_SPEED;
    this.blur.angle = Math.PI / 4.0;

    this.stars = [];

    loader.load(
      `${HOST_BASE_URL}/static/Vector5.gltf`,
      function (gltf) {
        const starModel = gltf.scene;
        this.models.add(starModel);
        starModel.scale.set(45, 45, 45);
        // starModel.scale.set(0.3, 0.3, 0.3);
        starModel.rotation.x = -Math.PI * 0.1;
        starModel.rotation.y = -Math.PI * 0.05;
        // starModel.position.set(0, 0, 0);
        starModel.position.set(70, -40, -50);
        this.stars.push(starModel);
      }.bind(this)
    );

    loader.load(
      `${HOST_BASE_URL}/static/Vector4.gltf`,
      function (gltf) {
        const starModel = gltf.scene;
        this.models.add(starModel);
        starModel.scale.set(25, 25, 25);
        starModel.rotation.x = -Math.PI * 0.2;
        starModel.rotation.y = -Math.PI * 0.15;
        starModel.position.set(100, 30, -150);
        this.stars.push(starModel);
      }.bind(this)
    );

    loader.load(
      `${HOST_BASE_URL}/static/Vector3.gltf`,
      function (gltf) {
        const starModel = gltf.scene;
        this.models.add(starModel);
        starModel.scale.set(45, 45, 45);
        starModel.rotation.x = -Math.PI * 0.1;
        starModel.rotation.y = -Math.PI * 3.15;
        starModel.position.set(-100, 20, -150);
        this.stars.push(starModel);
      }.bind(this)
    );

    loader.load(
      `${HOST_BASE_URL}/static/Vector2.gltf`,
      function (gltf) {
        const starModel = gltf.scene;
        this.models.add(starModel);
        starModel.scale.set(35, 35, 35);
        starModel.rotation.x = -Math.PI * 0.2;
        starModel.rotation.y = -Math.PI * 0.1;
        starModel.position.set(30, 50, -150);
        this.stars.push(starModel);
      }.bind(this)
    );

    loader.load(
      `${HOST_BASE_URL}/static/Vector1.gltf`,
      function (gltf) {
        const starModel = gltf.scene;
        this.models.add(starModel);
        starModel.scale.set(25, 25, 25);
        starModel.rotation.x = -Math.PI * 0.2;
        starModel.rotation.y = -Math.PI * 0.1;
        starModel.position.set(-50, -40, -150);
        // starModel.position.set(0, 0, 0);
        this.stars.push(starModel);
      }.bind(this)
    );
  }

  toggleBackground() {
    if (this.toggle.isStarted) return;
    this.toggle.isStarted = true;
    this.toggle.angle = 0.0;
    this.toggle.frontSide = !this.toggle.frontSide;
    this.toggle.zStart = this.group.position.z
  }

  render() {
    this.renderer.setRenderTarget(this.bufferTexture);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.renderedScene, this.rttCamera);
  }

  update() {
    const SPEED_MULTIPLIER = 0.8;
    const dt = this.clock.getDelta();

    if (this.toggle.isStarted) {
      const deltaAngle = this.TOGGLE_BACKGROUND_ANGLE_SPEED * dt;
      this.toggle.angle += deltaAngle;
      this.group.rotation.y += deltaAngle;
      this.group.position.z = this.toggle.zStart - 100 * Math.sin(this.toggle.angle)
     
      if (this.toggle.angle > Math.PI) {
        this.toggle.angle = Math.PI;
        this.toggle.isStarted = false;
        if (this.toggle.frontSide) {
          this.group.rotation.y = 0;
        } else {
          this.group.rotation.y = Math.PI;
        }
      }
    }

    if (this.gModel) {
      this.gModel.rotation.x +=
        0.0005 * SPEED_MULTIPLIER * Math.sin(this.clock.getElapsedTime());
      this.gModel.rotation.y +=
        0.005 * SPEED_MULTIPLIER * Math.cos(this.clock.getElapsedTime() / 2.0);

      this.gModel.position.x +=
        0.05 * SPEED_MULTIPLIER * Math.sin(this.clock.getElapsedTime());
      this.gModel.position.y +=
        0.05 * SPEED_MULTIPLIER * Math.cos(this.clock.getElapsedTime());
    }

    for (const [index, star] of this.stars.entries()) {
      const STAR_SPEED_MULTIPLIER = 1.5;
      star.rotation.x +=
        0.0001 *
        STAR_SPEED_MULTIPLIER *
        Math.sin(this.clock.getElapsedTime() + index);
      star.rotation.y +=
        0.0001 *
        STAR_SPEED_MULTIPLIER *
        Math.cos(this.clock.getElapsedTime() + index);
      star.position.x +=
        0.02 *
        STAR_SPEED_MULTIPLIER *
        Math.cos(this.clock.getElapsedTime() + index);
      star.position.y +=
        0.02 *
        STAR_SPEED_MULTIPLIER *
        Math.cos(this.clock.getElapsedTime() + index);
    }

    if (this.blur) {
      // Move
      this.blur.plane.position.x += this.blur.speedX * dt;
      this.blur.plane.position.y += this.blur.speedY * dt;
      // Пытаться уменьшить если у границ
      if (
        this.blur.plane.position.x > 150 ||
        this.blur.plane.position.x < -150
      ) {
        this.blur.speedX *= -2;
      }

      this.blur.speedX = Math.max(
        Math.min(this.blur.speedX, this.BLUR_MAX_SPEED),
        -this.BLUR_MAX_SPEED
      );

      // Пытаться уменьшить если у границ
      if (
        this.blur.plane.position.y > 100 ||
        this.blur.plane.position.y < -100
      ) {
        this.blur.speedY *= -2;
      }

      this.blur.speedY = Math.max(
        Math.min(this.blur.speedY, this.BLUR_MAX_SPEED),
        -this.BLUR_MAX_SPEED
      );

      // Поворот
      const newSpeedX =
        this.blur.speedX * Math.cos(this.blur.angle * dt) -
        this.blur.speedY * Math.sin(this.blur.angle * dt);
      const newSpeedY =
        this.blur.speedX * Math.sin(this.blur.angle * dt) +
        this.blur.speedY * Math.cos(this.blur.angle * dt);
      this.blur.speedX = newSpeedX;
      this.blur.speedY = newSpeedY;
      if (this.gModel) {
        this.gModel.position.x += this.gModelSpeed.x * dt;
        this.gModel.position.y += this.gModelSpeed.y * dt;
        this.gModel.position.z += this.gModelSpeed.z * dt;
      }

      // GModelSpeed reduce
      const G_MODAL_SPPED_REDUCED_COEF = 3;
      this.gModelSpeed.x /= 1.0 + (G_MODAL_SPPED_REDUCED_COEF - 1.0) * dt;
      this.gModelSpeed.y /= 1.0 + (G_MODAL_SPPED_REDUCED_COEF - 1.0) * dt;
      this.gModelSpeed.z /= 1.0 + (G_MODAL_SPPED_REDUCED_COEF - 1.0) * dt;

      // Движение к центру
      if (this.gModel) {
        const dx = this.gModel.position.x;
        const dy = this.gModel.position.y;
        const dz = this.gModel.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const G_MODAL_SPEED_GO_BACK_COEF = 0.75;
        this.gModel.position.x +=
          -this.gModel.position.x * G_MODAL_SPEED_GO_BACK_COEF * dt;
        this.gModel.position.y +=
          -this.gModel.position.y * G_MODAL_SPEED_GO_BACK_COEF * dt;
        this.gModel.position.z +=
          -this.gModel.position.z * G_MODAL_SPEED_GO_BACK_COEF * dt;
      }
    }
  }
}

const animation = new Animation();
const oldMouseCoord = new THREE.Vector2(0, 0);
const oldGModelPosition = new THREE.Vector3(0, 0, 0);
let dragGModel = false;
let goBack = false;
let firstMove = true;

function animate() {
  requestAnimationFrame(animate);
  animation.update();

  animation.render();
}

function canvasMouseMove(event) {
  const mouse = new THREE.Vector2(0, 0);
  mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.offsetY / window.innerHeight) * 2 + 1;
  if (dragGModel) {
    if (Math.abs(mouse.x) > 0.8 || Math.abs(mouse.y) > 0.1) {
      goBack = true;
    }
  }

  const deltaMouse = new THREE.Vector2(
    event.offsetX - oldMouseCoord.x,
    event.offsetY - oldMouseCoord.y
  );

  if (!firstMove && !goBack && animation.gModel) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, animation.camera);
    const intersects = raycaster.intersectObjects([animation.gModel], true);
    for (const intersect of intersects) {
      animation.gModelSpeed.x += deltaMouse.x * 0.3;
      animation.gModelSpeed.y -= deltaMouse.y * 0.3;
    }
  }

  oldMouseCoord.x = event.offsetX;
  oldMouseCoord.y = event.offsetY;

  firstMove = false;
}
window.onmousemove = canvasMouseMove;

animate();

const toggleButton = document.getElementById('toggle-background');
toggleButton.onclick = () => {
  animation.toggleBackground();
};
