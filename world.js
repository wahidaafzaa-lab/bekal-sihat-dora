(() => {
  'use strict';

  let scene;
  let camera;
  let renderer;
  let container;

  let player;
  let companion;

  let animationId = null;

  const clock = new THREE.Clock();

  const keys = {};

  const state = {
    running: false,
    jumping: false,
    jumpVelocity: 0,
    currentCheckpoint: 0,
    nearCheckpoint: false
  };

  const checkpoints = [];

  const PLAYER_SPEED = 5.5;
  const JUMP_FORCE = 7.5;
  const GRAVITY = 18;

  const checkpointPositions = [
    new THREE.Vector3(0, 0, 2),
    new THREE.Vector3(-5, 0, -8),
    new THREE.Vector3(5, 0, -18),
    new THREE.Vector3(-4, 0, -28),
    new THREE.Vector3(4, 0, -38)
  ];

  function init(containerElement) {
    container = containerElement;

    if (!container) {
      throw new Error(
        'Bekas dunia 3D tidak ditemui.'
      );
    }

    scene = new THREE.Scene();
    scene.background =
      new THREE.Color(0x9edfff);

    scene.fog =
      new THREE.Fog(
        0x9edfff,
        40,
        95
      );

    camera =
      new THREE.PerspectiveCamera(
        60,
        getWidth() / getHeight(),
        0.1,
        500
      );

    renderer =
      new THREE.WebGLRenderer({
        antialias: true
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );

    renderer.setSize(
      getWidth(),
      getHeight()
    );

    renderer.shadowMap.enabled = true;

    container.innerHTML = '';
    container.appendChild(
      renderer.domElement
    );

    createLights();
    createGround();
    createPath();
    createRiver();
    createTrees();
    createDecorations();
    createFoodObjects();
    createPlayer();
    createCompanion();
    createCheckpoints();

    bindControls();

    resize();

    state.running = true;

    animate();
  }

  function getWidth() {
    return Math.max(
      container.clientWidth,
      320
    );
  }

  function getHeight() {
    return Math.max(
      container.clientHeight,
      600
    );
  }

  function createLights() {
    const hemi =
      new THREE.HemisphereLight(
        0xffffff,
        0x5a7744,
        2.2
      );

    scene.add(hemi);

    const sun =
      new THREE.DirectionalLight(
        0xffffff,
        2.8
      );

    sun.position.set(
      12,
      20,
      10
    );

    sun.castShadow = true;

    scene.add(sun);
  }

  function createGround() {
    const geometry =
      new THREE.PlaneGeometry(
        70,
        110
      );

    const material =
      new THREE.MeshStandardMaterial({
        color: 0x72c463
      });

    const ground =
      new THREE.Mesh(
        geometry,
        material
      );

    ground.rotation.x =
      -Math.PI / 2;

    ground.position.z = -20;

    ground.receiveShadow = true;

    scene.add(ground);
  }

  function createPath() {
    const material =
      new THREE.MeshStandardMaterial({
        color: 0xf6d7a5
      });

    for (
      let i = 0;
      i < 25;
      i++
    ) {
      const tile =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            4,
            0.12,
            2.4
          ),
          material
        );

      tile.position.set(
        Math.sin(i * 0.6) * 1.8,
        0.06,
        8 - i * 2.2
      );

      tile.rotation.y =
        Math.sin(i) * 0.09;

      tile.receiveShadow = true;

      scene.add(tile);
    }
  }

  function createRiver() {
    const geometry =
      new THREE.PlaneGeometry(
        7,
        45
      );

    const material =
      new THREE.MeshStandardMaterial({
        color: 0x55c8ee,
        transparent: true,
        opacity: 0.86
      });

    const river =
      new THREE.Mesh(
        geometry,
        material
      );

    river.rotation.x =
      -Math.PI / 2;

    river.position.set(
      13,
      0.03,
      -20
    );

    scene.add(river);
  }

  function createTrees() {
    for (
      let i = 0;
      i < 34;
      i++
    ) {
      const side =
        i % 2 === 0
          ? -1
          : 1;

      const z =
        10 - i * 2.3;

      const x =
        side *
        (
          8 +
          Math.random() * 6
        );

      createTree(
        x,
        z,
        0.9 +
        Math.random() * 0.5
      );
    }
  }

  function createTree(
    x,
    z,
    scale
  ) {
    const group =
      new THREE.Group();

    const trunk =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.35,
          0.5,
          3,
          10
        ),
        new THREE.MeshStandardMaterial({
          color: 0x86552d
        })
      );

    trunk.position.y = 1.5;
    trunk.castShadow = true;

    const leafMat =
      new THREE.MeshStandardMaterial({
        color: 0x3fa74f
      });

    const crown1 =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          1.5,
          16,
          12
        ),
        leafMat
      );

    crown1.position.y = 3.5;

    const crown2 =
      crown1.clone();

    crown2.scale.set(
      0.8,
      0.8,
      0.8
    );

    crown2.position.set(
      1,
      3.6,
      0
    );

    const crown3 =
      crown1.clone();

    crown3.scale.set(
      0.75,
      0.75,
      0.75
    );

    crown3.position.set(
      -1,
      3.45,
      0.3
    );

    group.add(
      trunk,
      crown1,
      crown2,
      crown3
    );

    group.scale.setScalar(
      scale
    );

    group.position.set(
      x,
      0,
      z
    );

    scene.add(group);
  }

  function createDecorations() {
    const colors = [
      0xff6f91,
      0xffd166,
      0x9b5de5,
      0xffffff
    ];

    for (
      let i = 0;
      i < 55;
      i++
    ) {
      const flower =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.15,
            8,
            8
          ),
          new THREE.MeshStandardMaterial({
            color:
              colors[
                i % colors.length
              ]
          })
        );

      flower.position.set(
        (Math.random() - 0.5) * 28,
        0.18,
        10 - Math.random() * 55
      );

      scene.add(flower);
    }
  }

  function createFoodObjects() {
    createApple(-5, -4);
    createMilk(5, -12);
    createBanana(-5, -20);
    createCarrot(5, -29);
    createWaterBottle(-5, -38);
  }

  function createApple(x, z) {
    const group =
      new THREE.Group();

    const apple =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.75,
          20,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0xe53935
        })
      );

    apple.scale.y = 0.9;
    apple.position.y = 0.8;

    const stem =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.07,
          0.07,
          0.35,
          8
        ),
        new THREE.MeshStandardMaterial({
          color: 0x6d4c41
        })
      );

    stem.position.y = 1.55;

    group.add(
      apple,
      stem
    );

    group.position.set(
      x,
      0,
      z
    );

    scene.add(group);
  }

  function createMilk(x, z) {
    const group =
      new THREE.Group();

    const carton =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.1,
          1.7,
          0.9
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffffff
        })
      );

    carton.position.y = 0.9;

    const cap =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.17,
          0.17,
          0.15,
          12
        ),
        new THREE.MeshStandardMaterial({
          color: 0x42a5f5
        })
      );

    cap.position.set(
      0.25,
      1.8,
      0
    );

    group.add(
      carton,
      cap
    );

    group.position.set(
      x,
      0,
      z
    );

    scene.add(group);
  }

  function createBanana(x, z) {
    const banana =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          0.8,
          0.2,
          10,
          24,
          Math.PI * 1.25
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffd54f
        })
      );

    banana.rotation.z =
      Math.PI * 0.15;

    banana.position.set(
      x,
      1,
      z
    );

    scene.add(banana);
  }

  function createCarrot(x, z) {
    const group =
      new THREE.Group();

    const carrot =
      new THREE.Mesh(
        new THREE.ConeGeometry(
          0.5,
          1.8,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0xff7a00
        })
      );

    carrot.rotation.z =
      Math.PI;

    carrot.position.y = 1;

    const leaves =
      new THREE.Mesh(
        new THREE.ConeGeometry(
          0.55,
          0.8,
          10
        ),
        new THREE.MeshStandardMaterial({
          color: 0x43a047
        })
      );

    leaves.position.y = 2;

    group.add(
      carrot,
      leaves
    );

    group.position.set(
      x,
      0,
      z
    );

    scene.add(group);
  }

  function createWaterBottle(x, z) {
    const group =
      new THREE.Group();

    const bottle =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.42,
          0.48,
          1.8,
          18
        ),
        new THREE.MeshStandardMaterial({
          color: 0xa9e8ff,
          transparent: true,
          opacity: 0.8
        })
      );

    bottle.position.y = 1;

    const cap =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.3,
          0.3,
          0.25,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0x1976d2
        })
      );

    cap.position.y = 2;

    group.add(
      bottle,
      cap
    );

    group.position.set(
      x,
      0,
      z
    );

    scene.add(group);
  }

  function createPlayer() {
    player =
      new THREE.Group();

    const body =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.2,
          1.6,
          0.8
        ),
        new THREE.MeshStandardMaterial({
          color: 0xf06292
        })
      );

    body.position.y = 1.7;

    const head =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.7,
          20,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0xd8a06a
        })
      );

    head.position.y = 3;

    const hair =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.78,
          20,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0x4e342e
        })
      );

    hair.position.set(
      0,
      3.15,
      -0.08
    );

    hair.scale.set(
      1,
      0.9,
      1
    );

    const shorts =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.15,
          0.65,
          0.8
        ),
        new THREE.MeshStandardMaterial({
          color: 0xff8a34
        })
      );

    shorts.position.y = 0.75;

    const backpack =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.9,
          1.1,
          0.4
        ),
        new THREE.MeshStandardMaterial({
          color: 0x9c5ce5
        })
      );

    backpack.position.set(
      0,
      1.8,
      0.6
    );

    player.add(
      body,
      head,
      hair,
      shorts,
      backpack
    );

    player.position.set(
      0,
      0,
      8
    );

    scene.add(player);
  }

  function createCompanion() {
    companion =
      new THREE.Group();

    const body =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.6,
          18,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0x42a5f5
        })
      );

    body.position.y = 1;

    const eyeMat =
      new THREE.MeshStandardMaterial({
        color: 0xffffff
      });

    const eye1 =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.09,
          10,
          10
        ),
        eyeMat
      );

    eye1.position.set(
      -0.18,
      1.1,
      0.52
    );

    const eye2 =
      eye1.clone();

    eye2.position.x =
      0.18;

    companion.add(
      body,
      eye1,
      eye2
    );

    companion.position.set(
      2,
      0,
      7
    );

    scene.add(companion);
  }

  function createCheckpoints() {
    checkpoints.length = 0;

    checkpointPositions.forEach(
      (position, index) => {

        const group =
          new THREE.Group();

        const base =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              1.3,
              1.3,
              0.25,
              24
            ),
            new THREE.MeshStandardMaterial({
              color: 0xffd54f,
              emissive: 0x553300
            })
          );

        base.position.y = 0.12;

        const ring =
          new THREE.Mesh(
            new THREE.TorusGeometry(
              1.1,
              0.12,
              12,
              32
            ),
            new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: 0x444444
            })
          );

        ring.rotation.x =
          Math.PI / 2;

        ring.position.y = 0.45;

        group.add(
          base,
          ring
        );

        group.position.copy(
          position
        );

        group.userData = {
          index,
          base,
          ring,
          active: false
        };

        checkpoints.push(
          group
        );

        scene.add(
          group
        );

      }
    );

    setActiveCheckpoint(
      0
    );
  }

  function setActiveCheckpoint(index) {
    state.currentCheckpoint =
      index;

    checkpoints.forEach(
      (checkpoint, i) => {

        const active =
          i === index;

        checkpoint.userData.active =
          active;

        checkpoint.userData.base.material.emissive.setHex(
          active
            ? 0xff8c00
            : 0x222222
        );

        checkpoint.userData.ring.material.emissive.setHex(
          active
            ? 0xffffff
            : 0x222222
        );

      }
    );
  }

  function bindControls() {
    window.addEventListener(
      'keydown',
      onKeyDown
    );

    window.addEventListener(
      'keyup',
      onKeyUp
    );

    window.addEventListener(
      'resize',
      resize
    );
  }

  function onKeyDown(event) {
    keys[
      event.code
    ] = true;

    if (
      event.code === 'Space' &&
      !state.jumping
    ) {
      state.jumping = true;
      state.jumpVelocity = JUMP_FORCE;
    }
  }

  function onKeyUp(event) {
    keys[
      event.code
    ] = false;
  }

  function updateMovement(delta) {
    if (
      !state.running ||
      !player
    ) {
      return;
    }

    const direction =
      new THREE.Vector3();

    if (
      keys.KeyW ||
      keys.ArrowUp
    ) {
      direction.z -= 1;
    }

    if (
      keys.KeyS ||
      keys.ArrowDown
    ) {
      direction.z += 1;
    }

    if (
      keys.KeyA ||
      keys.ArrowLeft
    ) {
      direction.x -= 1;
    }

    if (
      keys.KeyD ||
      keys.ArrowRight
    ) {
      direction.x += 1;
    }

    if (
      direction.lengthSq() > 0
    ) {
      direction.normalize();

      player.position.x +=
        direction.x *
        PLAYER_SPEED *
        delta;

      player.position.z +=
        direction.z *
        PLAYER_SPEED *
        delta;

      player.rotation.y =
        Math.atan2(
          direction.x,
          direction.z
        );
    }

    player.position.x =
      THREE.MathUtils.clamp(
        player.position.x,
        -13,
        13
      );

    player.position.z =
      THREE.MathUtils.clamp(
        player.position.z,
        -45,
        10
      );

    if (
      state.jumping
    ) {
      player.position.y +=
        state.jumpVelocity *
        delta;

      state.jumpVelocity -=
        GRAVITY *
        delta;

      if (
        player.position.y <= 0
      ) {
        player.position.y = 0;
        state.jumping = false;
        state.jumpVelocity = 0;
      }
    }
  }

  function updateCompanion(delta) {
    if (
      !companion ||
      !player
    ) {
      return;
    }

    const target =
      new THREE.Vector3(
        player.position.x + 1.7,
        0,
        player.position.z + 1.5
      );

    companion.position.lerp(
      target,
      Math.min(
        delta * 3,
        1
      )
    );

    companion.position.y =
      0.15 +
      Math.sin(
        performance.now() * 0.004
      ) * 0.15;
  }

  function updateCamera(delta) {
    if (!player) {
      return;
    }

    const desired =
      new THREE.Vector3(
        player.position.x,
        player.position.y + 6,
        player.position.z + 10
      );

    camera.position.lerp(
      desired,
      Math.min(
        delta * 4,
        1
      )
    );

    const lookTarget =
      new THREE.Vector3(
        player.position.x,
        player.position.y + 1.8,
        player.position.z - 2
      );

    camera.lookAt(
      lookTarget
    );
  }

  function updateCheckpoints(delta) {
    checkpoints.forEach(
      (checkpoint, index) => {

        checkpoint.rotation.y +=
          delta *
          (
            checkpoint.userData.active
              ? 1.2
              : 0.35
          );

        checkpoint.position.y =
          Math.sin(
            performance.now() * 0.002 +
            index
          ) * 0.08;

      }
    );

    checkCheckpointDistance();
  }

  function checkCheckpointDistance() {
    if (
      !player ||
      !checkpoints.length
    ) {
      return;
    }

    const checkpoint =
      checkpoints[
        state.currentCheckpoint
      ];

    if (!checkpoint) {
      return;
    }

    const distance =
      player.position.distanceTo(
        checkpoint.position
      );

    const near =
      distance < 3;

    if (
      near !==
      state.nearCheckpoint
    ) {
      state.nearCheckpoint =
        near;

      window.dispatchEvent(
        new CustomEvent(
          'bekal-checkpoint-near',
          {
            detail: {
              near,
              index:
                state.currentCheckpoint
            }
          }
        )
      );
    }
  }

  function animate() {
    animationId =
      requestAnimationFrame(
        animate
      );

    const delta =
      Math.min(
        clock.getDelta(),
        0.05
      );

    updateMovement(delta);
    updateCompanion(delta);
    updateCamera(delta);
    updateCheckpoints(delta);

    renderer.render(
      scene,
      camera
    );
  }

  function resize() {
    if (
      !camera ||
      !renderer ||
      !container
    ) {
      return;
    }

    const width =
      getWidth();

    const height =
      getHeight();

    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
      width,
      height
    );
  }

  function start() {
    state.running = true;
  }

  function stop() {
    state.running = false;
  }

  function teleportToCheckpoint(index) {
    const target =
      checkpointPositions[index];

    if (
      !target ||
      !player
    ) {
      return;
    }

    player.position.set(
      target.x,
      0,
      target.z + 4
    );

    setActiveCheckpoint(
      index
    );
  }

  function getPlayerPosition() {
    if (!player) {
      return null;
    }

    return {
      x: player.position.x,
      y: player.position.y,
      z: player.position.z
    };
  }

  function destroy() {
    if (animationId) {
      cancelAnimationFrame(
        animationId
      );
    }

    window.removeEventListener(
      'keydown',
      onKeyDown
    );

    window.removeEventListener(
      'keyup',
      onKeyUp
    );

    window.removeEventListener(
      'resize',
      resize
    );

    if (renderer) {
      renderer.dispose();
    }

    if (container) {
      container.innerHTML = '';
    }
  }

  window.BekalWorld = {
    init,
    start,
    stop,
    resize,
    destroy,
    setActiveCheckpoint,
    teleportToCheckpoint,
    getPlayerPosition
  };

})();
