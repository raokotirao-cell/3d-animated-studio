// ========================================
// 3D ANIMATED STUDIO
// THREE.JS 3D ENGINE
// ========================================

import * as THREE from
  "https://unpkg.com/three@0.178.0/build/three.module.js";

import { OrbitControls } from
  "https://unpkg.com/three@0.178.0/examples/jsm/controls/OrbitControls.js";


export class Studio3D {

  constructor(container) {

    this.container = container;

    // -------------------------------
    // Scene
    // -------------------------------

    this.scene =
      new THREE.Scene();

    this.scene.background =
      new THREE.Color(0x87ceeb);


    // -------------------------------
    // Camera
    // -------------------------------

    this.camera =
      new THREE.PerspectiveCamera(
        45,
        16 / 9,
        0.1,
        100
      );

    this.camera.position.set(
      7,
      5,
      9
    );


    // -------------------------------
    // Renderer
    // -------------------------------

    this.renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
      });

    this.renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );

    this.renderer.setSize(
      960,
      540,
      false
    );


    container.innerHTML = "";

    container.appendChild(
      this.renderer.domElement
    );


    // -------------------------------
    // Controls
    // -------------------------------

    this.controls =
      new OrbitControls(
        this.camera,
        this.renderer.domElement
      );

    this.controls.enableDamping =
      true;


    // -------------------------------
    // Lights
    // -------------------------------

    const hemisphere =
      new THREE.HemisphereLight(
        0xffffff,
        0x334455,
        2.2
      );

    this.scene.add(
      hemisphere
    );


    const sunlight =
      new THREE.DirectionalLight(
        0xffffff,
        2
      );

    sunlight.position.set(
      5,
      10,
      4
    );

    this.scene.add(
      sunlight
    );


    // -------------------------------
    // World
    // -------------------------------

    this.world =
      new THREE.Group();

    this.scene.add(
      this.world
    );


    // -------------------------------
    // Characters
    // -------------------------------

    this.actorGroup =
      new THREE.Group();

    this.world.add(
      this.actorGroup
    );


    this.actors = [];


    // -------------------------------
    // Ground
    // -------------------------------

    this.ground =
      new THREE.Mesh(

        new THREE.PlaneGeometry(
          40,
          40
        ),

        new THREE.MeshStandardMaterial({
          color: 0x4d7c0f
        })

      );

    this.ground.rotation.x =
      -Math.PI / 2;

    this.world.add(
      this.ground
    );


    // -------------------------------
    // Animation state
    // -------------------------------

    this.clock =
      new THREE.Clock();

    this.elapsed = 0;

    this.playing = false;

    this.sceneData = null;


    // -------------------------------
    // Resize
    // -------------------------------

    window.addEventListener(
      "resize",
      () => this.resize()
    );


    this.resize();


    // -------------------------------
    // Render loop
    // -------------------------------

    this.loop();

  }


  // ========================================
  // RESIZE
  // ========================================

  resize() {

    const width =
      Math.max(
        320,
        this.container.clientWidth ||
        960
      );

    const height =
      Math.round(
        width * 9 / 16
      );


    this.renderer.setSize(
      width,
      height,
      false
    );


    this.camera.aspect =
      width / height;

    this.camera.updateProjectionMatrix();

  }


  // ========================================
  // CLEAR CHARACTERS
  // ========================================

  clear() {

    while (
      this.actorGroup.children.length
    ) {

      this.actorGroup.remove(
        this.actorGroup.children[0]
      );

    }

    this.actors = [];

  }


  // ========================================
  // CREATE CHARACTER
  // ========================================

  actor(type, name) {

    const group =
      new THREE.Group();

    group.name =
      name || "Character";


    let color;


    if (type === "robot") {

      color = 0x9ca3af;

    }

    else if (type === "animal") {

      color = 0xa16207;

    }

    else if (type === "bird") {

      color = 0x2563eb;

    }

    else {

      color = 0xf59e0b;

    }


    const material =
      new THREE.MeshStandardMaterial({
        color
      });


    // ====================================
    // BIRD
    // ====================================

    if (type === "bird") {

      const body =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.55,
            16,
            12
          ),
          material
        );

      group.add(body);


      const wingMaterial =
        new THREE.MeshStandardMaterial({
          color: 0x1d4ed8
        });


      [-1, 1].forEach(side => {

        const wing =
          new THREE.Mesh(
            new THREE.SphereGeometry(
              0.35,
              12,
              8
            ),
            wingMaterial
          );

        wing.scale.set(
          1.5,
          0.25,
          0.7
        );

        wing.position.set(
          side * 0.55,
          0.1,
          0
        );

        group.add(wing);

      });


      const beak =
        new THREE.Mesh(
          new THREE.ConeGeometry(
            0.15,
            0.4,
            8
          ),
          new THREE.MeshStandardMaterial({
            color: 0xfbbf24
          })
        );


      beak.rotation.z =
        -Math.PI / 2;

      beak.position.set(
        0,
        -0.02,
        0.6
      );

      group.add(beak);

    }


    // ====================================
    // ANIMAL
    // ====================================

    else if (type === "animal") {

      const body =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.75,
            16,
            12
          ),
          material
        );

      body.scale.set(
        1.25,
        0.8,
        1
      );

      body.position.y =
        0.9;

      group.add(body);


      for (
        const x of [-0.45, 0.45]
      ) {

        for (
          const z of [-0.3, 0.3]
        ) {

          const leg =
            new THREE.Mesh(
              new THREE.CylinderGeometry(
                0.13,
                0.16,
                0.7,
                10
              ),
              material
            );

          leg.position.set(
            x,
            0.35,
            z
          );

          group.add(leg);

        }

      }


      const head =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.48,
            16,
            12
          ),
          material
        );

      head.position.set(
        0,
        1.55,
        0.55
      );

      group.add(head);

    }


    // ====================================
    // HUMAN / ROBOT
    // ====================================

    else {

      const body =
        new THREE.Mesh(
          new THREE.CapsuleGeometry(
            0.42,
            1,
            8,
            16
          ),
          material
        );

      body.position.y =
        1.35;

      group.add(body);


      const head =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.42,
            16,
            12
          ),
          material
        );

      head.position.y =
        2.35;

      group.add(head);


      // Legs

      for (
        const x of [-0.18, 0.18]
      ) {

        const leg =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              0.12,
              0.15,
              0.8,
              10
            ),
            material
          );

        leg.position.set(
          x,
          0.45,
          0
        );

        group.add(leg);

      }


      // Arms

      for (
        const x of [-0.6, 0.6]
      ) {

        const arm =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              0.1,
              0.12,
              0.9,
              10
            ),
            material
          );

        arm.position.set(
          x,
          1.45,
          0
        );

        arm.rotation.z =
          x > 0
            ? -0.2
            : 0.2;

        group.add(arm);

      }


      // Robot variation

      if (type === "robot") {

        head.scale.set(
          1.1,
          0.9,
          1
        );

        body.material.color.set(
          0x64748b
        );

      }

    }


    return group;

  }


  // ========================================
  // BACKGROUND
  // ========================================

  setBackground(background) {

    const colors = {

      day: 0x87ceeb,

      night: 0x101a3a,

      forest: 0x3b6b45,

      city: 0x8b95a5,

      space: 0x05020d,

      desert: 0xe8c27a

    };


    this.scene.background =
      new THREE.Color(
        colors[background] ??
        colors.day
      );


    let groundColor =
      0x4d7c0f;


    if (background === "desert") {

      groundColor =
        0xc2a15a;

    }

    else if (background === "space") {

      groundColor =
        0x17122b;

    }

    else if (background === "night") {

      groundColor =
        0x18223b;

    }

    else if (background === "city") {

      groundColor =
        0x555b63;

    }

    else if (background === "forest") {

      groundColor =
        0x28543a;

    }


    this.ground.material.color.set(
      groundColor
    );

  }


  // ========================================
  // LOAD SCENE
  // ========================================

  loadScene(
    data,
    characters
  ) {

    if (!data) {
      return;
    }


    this.sceneData =
      data;


    this.clear();


    this.setBackground(
      data.background
    );


    const names =
      data.characters &&
      data.characters.length
        ? data.characters
        : characters
            .map(c => c.name)
            .slice(0, 3);


    names.forEach(
      (name, index) => {

        const character =
          characters.find(
            c => c.name === name
          ) ||
          characters[
            index %
            Math.max(
              characters.length,
              1
            )
          ] ||
          {
            name: "Hero",
            type: "human"
          };


        const actor =
          this.actor(
            character.type,
            character.name
          );


        actor.position.x =
          (
            index -
            (names.length - 1) / 2
          ) * 2;


        this.actorGroup.add(
          actor
        );


        this.actors.push(
          actor
        );

      }
    );


    this.elapsed = 0;

  }


  // ========================================
  // ANIMATION
  // ========================================

  animate(delta) {

    if (!this.sceneData) {
      return;
    }


    const mode =
      this.sceneData.animation ||
      "None";


    this.actors.forEach(
      (actor, index) => {

        const time =
          this.elapsed +
          index * 0.4;


        // WALK

        if (mode === "Walk") {

          actor.position.z =
            Math.sin(time * 2) *
            0.5;

          actor.rotation.y =
            Math.sin(time) *
            0.15;

        }


        // JUMP

        if (mode === "Jump") {

          actor.position.y =
            Math.abs(
              Math.sin(time * 2)
            ) * 1.2;

        }


        // WAVE

        if (mode === "Wave") {

          if (actor.children[3]) {

            actor.children[3]
              .rotation.z =
              Math.sin(time * 4) *
              0.8;

          }

        }


        // FLOAT

        if (mode === "Float") {

          actor.position.y =
            Math.sin(time * 2) *
            0.35;

        }


        // DANCE

        if (mode === "Dance") {

          actor.rotation.y =
            Math.sin(time * 4) *
            0.4;

        }

      }
    );


    // ====================================
    // CAMERA
    // ====================================

    const camera =
      this.sceneData.camera;


    if (camera === "Pan") {

      this.camera.position.x =
        Math.sin(
          this.elapsed * 0.25
        ) * 8;

    }


    if (camera === "Zoom") {

      this.camera.position.z =
        9 -
        Math.min(
          4,
          this.elapsed * 0.3
        );

    }


    if (camera === "Orbit") {

      this.camera.position.x =
        Math.cos(
          this.elapsed * 0.25
        ) * 9;

      this.camera.position.z =
        Math.sin(
          this.elapsed * 0.25
        ) * 9;

      this.camera.lookAt(
        0,
        1,
        0
      );

    }


    this.camera.updateProjectionMatrix();

  }


  // ========================================
  // RENDER LOOP
  // ========================================

  loop() {

    requestAnimationFrame(
      () => this.loop()
    );


    const delta =
      this.clock.getDelta();


    if (this.playing) {

      this.elapsed += delta;

      this.animate(
        delta
      );

    }


    this.controls.update();


    this.renderer.render(
      this.scene,
      this.camera
    );


    if (this.onTime) {

      this.onTime(
        this.elapsed
      );

    }

  }


  // ========================================
  // PLAY
  // ========================================

  play() {

    this.playing = true;

  }


  // ========================================
  // PAUSE
  // ========================================

  pause() {

    this.playing = false;

  }


  // ========================================
  // RESET
  // ========================================

  reset() {

    this.playing = false;

    this.elapsed = 0;

    this.camera.position.set(
      7,
      5,
      9
    );

    this.camera.lookAt(
      0,
      1,
      0
    );

  }

}
