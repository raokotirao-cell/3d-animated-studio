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
// ========================================
// BACKGROUND TEXTURE CACHE
// ========================================

this.backgroundTextures = {};

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

  actor(type, name, costume) {

  // ========================================
  // CARTOON HUMAN
  // ========================================

  if (
    type === "human" ||
    type === "female" ||
    type === "child"
  ) {

    return this.cartoonHuman(
      name,
      costume || "casual",
      type
    );

  }
    const group =
      new THREE.Group();
// ========================================
// CHARACTER VARIANT
// ========================================

let scaleX = 1;
let scaleY = 1;
let scaleZ = 1;

if (type === "female") {
  scaleX = 0.92;
  scaleY = 1.02;
  scaleZ = 0.92;
}

if (type === "child") {
  scaleX = 0.78;
  scaleY = 0.78;
  scaleZ = 0.78;
}
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
      // ====================================
// CHARACTER BODY VARIATION
// ====================================

if (type === "female") {

  body.scale.set(
    0.9,
    1.05,
    0.9
  );

}

else if (type === "child") {

  body.scale.set(
    0.72,
    0.72,
    0.72
  );

}

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
      // ====================================
// HEAD VARIATION
// ====================================

if (type === "female") {

  head.scale.set(
    0.95,
    1.02,
    0.95
  );

}

else if (type === "child") {

  head.scale.set(
    1.15,
    1.15,
    1.15
  );

}

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
// ====================================
// COSTUME
// ====================================

if (
  type === "human" ||
  type === "female" ||
  type === "child"
) {

  let costumeColor =
    0x2563eb;

  if (costume === "school") {

    costumeColor =
      0x1e3a8a;

  }

  else if (costume === "police") {

    costumeColor =
      0x172554;

  }

  else if (costume === "doctor") {

    costumeColor =
      0xf8fafc;

  }

  else if (costume === "traditional") {

    costumeColor =
      0x9333ea;

  }

  else if (costume === "sports") {

    costumeColor =
      0xdc2626;

  }

  else if (costume === "casual") {

    costumeColor =
      0x2563eb;

  }


  const costumeMaterial =
    new THREE.MeshStandardMaterial({
      color: costumeColor
    });


  // Shirt / Dress layer

  const costumeBody =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.46,
        0.75,
        8,
        16
      ),
      costumeMaterial
    );

  costumeBody.position.y =
    1.35;

  group.add(
    costumeBody
  );


  // School / Police cap

  if (
    costume === "school" ||
    costume === "police"
  ) {

    const cap =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.46,
          0.46,
          0.12,
          16
        ),
        costumeMaterial
      );

    cap.position.y =
      2.78;

    group.add(
      cap
    );

  }


  // Doctor coat front

  if (costume === "doctor") {

    const coat =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.65,
          0.9,
          0.08
        ),
        costumeMaterial
      );

    coat.position.set(
      0,
      1.4,
      0.43
    );

    group.add(
      coat
    );

  }

}
    group.scale.set(
  scaleX,
  scaleY,
  scaleZ
);
return group;

  }

// ========================================
// 3D CARTOON HUMAN
// ========================================

cartoonHuman(
  name,
  costume = "casual",
  type = "human"
) {

  const group = new THREE.Group();

  group.name = name || "Cartoon Human";
  // ======================================
// CHARACTER PROPORTIONS
// ======================================

if (type === "female") {

  group.scale.set(
    0.92,
    1.04,
    0.92
  );

}

else if (type === "child") {

  group.scale.set(
    0.78,
    0.78,
    0.78
  );

}

  // ======================================
  // MATERIALS
  // ======================================

  const skinMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xffc7a3,
      roughness: 0.75
    });

  const hairMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x3b2418,
      roughness: 0.8
    });

  const blackMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x111111
    });

  let clothesColor = 0x2563eb;

  if (costume === "school") {
    clothesColor = 0x1e3a8a;
  }

  if (costume === "police") {
    clothesColor = 0x172554;
  }

  if (costume === "doctor") {
    clothesColor = 0xffffff;
  }

  if (costume === "traditional") {
    clothesColor = 0x9333ea;
  }

  if (costume === "sports") {
    clothesColor = 0xdc2626;
  }

  const clothesMaterial =
    new THREE.MeshStandardMaterial({
      color: clothesColor,
      roughness: 0.7
    });

  // ======================================
  // BODY
  // ======================================

  const body =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.52,
        0.9,
        8,
        16
      ),
      clothesMaterial
    );

  body.position.y = 1.35;

  group.add(body);

  // ======================================
  // HEAD
  // ======================================

  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.62,
        24,
        20
      ),
      skinMaterial
    );

  head.position.y = 2.35;

  group.add(head);

  // ======================================
  // HAIR
  // ======================================

  const hair =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.64,
        24,
        16
      ),
      hairMaterial
    );

  hair.scale.set(
    1,
    0.55,
    1
  );

  hair.position.y = 2.72;

  group.add(hair);

  // ======================================
  // EYES
  // ======================================

  [-0.22, 0.22].forEach(x => {

    const eyeWhite =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.13,
          16,
          12
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffffff
        })
      );

    eyeWhite.position.set(
      x,
      2.38,
      0.55
    );

    group.add(eyeWhite);

    const pupil =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.06,
          12,
          8
        ),
        blackMaterial
      );

    pupil.position.set(
      x,
      2.38,
      0.66
    );

    group.add(pupil);

  });

  // ======================================
  // NOSE
  // ======================================

  const nose =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.08,
        12,
        8
      ),
      skinMaterial
    );

  nose.position.set(
    0,
    2.25,
    0.62
  );

  group.add(nose);

  // ======================================
  // MOUTH
  // ======================================

  const mouth =
    new THREE.Mesh(
      new THREE.TorusGeometry(
        0.12,
        0.025,
        8,
        16,
        Math.PI
      ),
      new THREE.MeshStandardMaterial({
        color: 0x7f1d1d
      })
    );

  mouth.rotation.x =
    Math.PI;

  mouth.position.set(
    0,
    2.08,
    0.61
  );

  group.add(mouth);

  // ======================================
  // ARMS
  // ======================================

  [-1, 1].forEach(side => {

    const arm =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          0.13,
          0.65,
          6,
          10
        ),
        clothesMaterial
      );

    arm.position.set(
      side * 0.68,
      1.42,
      0
    );

    arm.rotation.z =
      side * 0.18;

    group.add(arm);

  });

  // ======================================
  // HANDS
  // ======================================

  [-1, 1].forEach(side => {

    const hand =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.15,
          16,
          12
        ),
        skinMaterial
      );

    hand.position.set(
      side * 0.76,
      0.98,
      0
    );

    group.add(hand);

  });

  // ======================================
  // LEGS
  // ======================================

  [-1, 1].forEach(side => {

    const leg =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          0.15,
          0.65,
          6,
          10
        ),
        blackMaterial
      );

    leg.position.set(
      side * 0.2,
      0.48,
      0
    );

    group.add(leg);

  });

  // ======================================
  // SHOES
  // ======================================

  [-1, 1].forEach(side => {

    const shoe =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.22,
          16,
          10
        ),
        blackMaterial
      );

    shoe.scale.set(
      1.3,
      0.55,
      1.6
    );

    shoe.position.set(
      side * 0.2,
      0.12,
      0.12
    );

    group.add(shoe);

  });

  // ======================================
  // POLICE COSTUME
  // ======================================

  if (costume === "police") {

    const cap =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.48,
          0.55,
          0.16,
          24
        ),
        clothesMaterial
      );

    cap.position.y = 2.92;

    group.add(cap);

    const badge =
      new THREE.Mesh(
        new THREE.CircleGeometry(
          0.10,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15
        })
      );

    badge.position.set(
      0,
      1.45,
      0.53
    );

    group.add(badge);
  }

  // ======================================
  // DOCTOR COSTUME
  // ======================================

  if (costume === "doctor") {

    const coat =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.82,
          0.95,
          0.12
        ),
        clothesMaterial
      );

    coat.position.set(
      0,
      1.4,
      0.5
    );

    group.add(coat);

  }

  // ======================================
  // SCHOOL COSTUME
  // ======================================

  if (costume === "school") {

    const tie =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.10,
          0.42,
          0.04
        ),
        new THREE.MeshStandardMaterial({
          color: 0xdc2626
        })
      );

    tie.position.set(
      0,
      1.65,
      0.53
    );

    group.add(tie);

  }

  // ======================================
  // TRADITIONAL COSTUME
  // ======================================

  if (costume === "traditional") {

    body.scale.x = 1.08;

    const belt =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.05,
          0.12,
          0.65
        ),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15
        })
      );

    belt.position.y = 1.08;

    group.add(belt);

  }

  // ======================================
  // SPORTS COSTUME
  // ======================================

  if (costume === "sports") {

    const number =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          0.28,
          0.35
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffffff
        })
      );

    number.position.set(
      0,
      1.42,
      0.54
    );

    group.add(number);

  }

  return group;
}


// ========================================
// BACKGROUND
// REAL IMAGE + COLOR FALLBACK
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

  // ======================================
  // COLOR FALLBACK
  // ======================================

  this.scene.background =
    new THREE.Color(
      colors[background] ??
      colors.day
    );

  // ======================================
  // GROUND FALLBACK
  // ======================================

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

  if (this.ground?.material) {

    this.ground.material.color.set(
      groundColor
    );

  }

  // ======================================
  // REAL BACKGROUND IMAGE
  // ======================================

  const images = {

    day:
      "./assets/backgrounds/day.jpg",

    night:
      "./assets/backgrounds/night.jpg",

    forest:
      "./assets/backgrounds/forest.jpg",

    city:
      "./assets/backgrounds/city.jpg",

    space:
      "./assets/backgrounds/space.jpg",

    desert:
      "./assets/backgrounds/desert.jpg"

  };

  const imagePath =
    images[background];

  if (!imagePath) {
    return;
  }

  const loader =
    new THREE.TextureLoader();

  loader.load(

    imagePath,

    texture => {

      this.scene.background =
        texture;

    },

    undefined,

    error => {

      console.warn(
        "Background image failed to load:",
        imagePath,
        error
      );

      // Keep color fallback.
    }

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

  // Clear previous scene
  this.clear();

  // Set background
  this.setBackground(
    data.background
  );
// ======================================
// MULTIPLE CHARACTERS PER SCENE
// ======================================

const names =
Array.isArray(data.characters)
  ? data.characters
  : [];
  // No character assigned
  if (!names.length) {

    this.elapsed = 0;

    return;
  }
// ======================================
// FIND AND CREATE ALL SELECTED CHARACTERS
// ======================================

names.forEach(
  (name, index) => {

    const character =
      characters.find(
        c => c.name === name
      );

    if (!character) {

      console.warn(
        "Character not found:",
        name
      );

      return;

    }

    // ==================================
    // CREATE CHARACTER
    // ==================================
const actor =
  this.actor(
    character.type,
    character.name,
    character.costume
  );
    

    // ==================================
    // POSITION CHARACTERS
    // ==================================

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
// ========================================
// RESET SCENE TIME
// ========================================

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

  const duration =
    Math.max(
      0.5,
      Number(
        this.sceneData?.duration
      ) || 10
    );

  this.elapsed += delta;

  if (this.elapsed >= duration) {

    this.elapsed = duration;

    this.animate(delta);

    this.playing = false;

  } else {

    this.animate(delta);

  }

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
