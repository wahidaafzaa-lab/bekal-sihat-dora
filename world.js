(() => {
  'use strict';

  let scene;
  let camera;
  let renderer;
  let player;
  let companion;

  let animationId = null;
  let container = null;

  const clock = new THREE.Clock();

  const state = {
    running: false
  };

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

    camera =
      new THREE.PerspectiveCamera(
        55,
        container.clientWidth /
          Math.max(
            container.clientHeight,
            1
          ),
        0.1,
        1000
      );

    camera.position.set(
      0,
      7,
      13
    );

    renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );

    renderer.setSize(
      container.clientWidth,
      Math.max(
        container.clientHeight,
        600
      )
    );

    renderer.shadowMap.enabled = true;

    container.innerHTML = '';
    container.appendChild(
      renderer.domElement
    );

    createLights();
    createGround();
    createPath();
    createTrees();
    createFlowers();
    createFoodObjects();
    createPlayer();
    createCompanion();
    createCheckpointSigns();

    window.addEventListener(
      'resize',
      resize
    );

    render();
  }

  function createLights() {
    const ambient =
      new THREE.HemisphereLight(
        0xffffff,
        0x557744,
        2
      );

    scene.add(ambient);

    const sun =
      new THREE.DirectionalLight(
        0xffffff,
        2.5
      );

    sun.position.set(
      8,
      15,
      10
    );

    sun.castShadow = true;

    scene.add(sun);
  }

  function createGround() {
    const geometry =
      new THREE.PlaneGeometry(
        35,
        70
      );

    const material =
      new THREE.MeshStandardMaterial({
        color: 0x79c267
      });

    const ground =
      new THREE.Mesh(
        geometry,
        material
      );

    ground.rotation.x =
      -Math.PI / 2;

    ground.position.z = -15;

    ground.receiveShadow = true;

    scene.add(ground);

    const riverGeometry =
      new THREE.PlaneGeometry(
        6,
        28
      );

    const riverMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x47bce8,
        transparent: true,
        opacity: 0.88
      });

    const river =
      new THREE.Mesh(
        riverGeometry,
        riverMaterial
      );

    river.rotation.x =
      -Math.PI / 2;

    river.position.set(
      10,
      0.03,
      -10
    );

    scene.add(river);
  }

  function createPath() {
    const material =
      new THREE.MeshStandardMaterial({
        color: 0xf2d49b
      });

    for (
      let i = 0;
      i < 16;
      i++
    ) {
      const geometry =
        new THREE.BoxGeometry(
          3.4,
          0.12,
          2.2
        );

      const tile =
        new THREE.Mesh(
          geometry,
          material
        );

      tile.position.set(
        Math.sin(i * 0.65) * 1.4,
        0.08,
        9 - i * 3
      );

      tile.rotation.y =
        Math.sin(i) * 0.08;

      tile.receiveShadow = true;

      scene.add(tile);
    }
  }

  function createTrees() {
    for (
      let i = 0;
      i < 24;
      i++
    ) {
      const side =
        i % 2 === 0
          ? -1
          : 1;

      const z =
        10 - i * 2.5;

      const x =
        side *
        (
          6 +
          Math.random() * 4
        );

      createTree(
        x,
        z,
        0.8 +
          Math.random() * 0.6
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
          color: 0x8b5a2b
        })
      );

    trunk.position.y = 1.5;
    trunk.castShadow = true;

    group.add(trunk);

    const leafMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x3e9c45
      });

    const crown1 =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          1.5,
          16,
          12
        ),
        leafMaterial
      );

    crown1.position.y = 3.4;

    crown1.castShadow = true;

    const crown2 =
      crown1.clone();

    crown2.scale.set(
      0.8,
      0.8,
      0.8
    );

    crown2.position.set(
      0.9,
      3.5,
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
      -0.9,
      3.45,
      0.2
    );

    group.add(
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

  function createFlowers() {
    const colours = [
      0xff6f91,
      0xffd166,
      0x9b5de5,
      0xffffff
    ];

    for (
      let i = 0;
      i < 40;
      i++
    ) {
      const flower =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.16,
            8,
            8
          ),
          new THREE.MeshStandardMaterial({
            color:
              colours[
                i % colours.length
              ]
          })
        );

      flower.position.set(
        (Math.random() - 0.5) * 24,
        0.18,
        8 - Math.random() * 50
      );

      scene.add(flower);
    }
  }

  function createFoodObjects() {
    createApple(
      -4.5,
      -3
    );

    createBanana(
      4.5,
      -10
    );

    createMilk(
      -4.5,
      -17
    );

    createCarrot(
      4.7,
      -24
    );

    createWaterBottle(
      -4.5,
      -31
    );
  }

  function createApple(x, z) {
    const group =
      new THREE.Group();

    const apple =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.7,
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
          0.06,
          0.06,
          0.4,
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

  function createBanana(x, z) {
    const banana =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          0.75,
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
      1.82,
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

  function createWaterBottle(
    x,
    z
  ) {
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
          1.25,
          1.7,
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
          0.72,
          20,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0xd9a066
        })
      );

    head.position.y = 3;

    const hair =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.79,
          20,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0x4e342e
        })
      );

    hair.scale.set(
      1,
      0.85,
      1
    );

    hair.position.set(
      0,
      3.18,
      -0.08
    );

    const shorts =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.2,
          0.7,
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
          0.95,
          1.15,
          0.45
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
      hair,
      head,
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

    const eye1 =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.09,
          10,
          10
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffffff
        })
      );

    eye1.position.set(
      -0.18,
      1.1,
      0.52
    );

    const eye2 =
      eye1.clone();

    eye2.position.x = 0.18;

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

  function createCheckpointSigns() {
    const positions = [
      0,
      -8,
      -16,
      -24,
      -32
    ];

    positions.forEach(
      (z, index) => {
        const group =
          new THREE.Group();

        const pole =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              0.08,
              0.08,
              2,
              8
            ),
            new THREE.MeshStandardMaterial({
              color: 0x795548
            })
          );

        pole.position.y = 1;

        const sign =
          new THREE.Mesh(
            new THREE.BoxGeometry(
              2,
              0.9,
              0.18
            ),
            new THREE.MeshStandardMaterial({
              color: 0xffec80
            })
          );

        sign.position.y = 2;

        group.add(
          pole,
          sign
        );

        group.position.set(
          index % 2 === 0
            ? 4
            : -4,
          0,
          z
        );

        scene.add(group);
      }
    );
  }

  function animateCharacter(
    elapsed
  ) {
    if (player) {
      player.position.y =
        Math.sin(
          elapsed * 2
        ) * 0.05;
    }

    if (companion) {
      companion.position.y =
        Math.sin(
          elapsed * 3
        ) * 0.15;

      companion.rotation.y +=
        0.004;
    }
  }

  function render() {
    if (!renderer) {
      return;
    }

    animationId =
      requestAnimationFrame(
        render
      );

    const elapsed =
      clock.getElapsedTime();

    animateCharacter(
      elapsed
    );

    renderer.render(
      scene,
      camera
    );
  }

  function resize() {
    if (
      !renderer ||
      !camera ||
      !container
    ) {
      return;
    }

    const width =
      container.clientWidth;

    const height =
      Math.max(
        container.clientHeight,
        600
      );

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

  function destroy() {
    if (animationId) {
      cancelAnimationFrame(
        animationId
      );

      animationId = null;
    }

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
    destroy
  };
})();
