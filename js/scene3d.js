// ========================================
// 3D ANIMATED STUDIO
// THREE.JS 3D ENGINE
// ========================================

import * as THREE from
  "https://unpkg.com/three@0.178.0/build/three.module.js";

import { OrbitControls } from
  "https://unpkg.com/three@0.178.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from
"https://unpkg.com/three@0.178.0/examples/jsm/loaders/GLTFLoader.js";

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

this.gltfLoader = new GLTFLoader();
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
  // FARMER GLB CHARACTER
  // ========================================

  if (costume === "farmer") {

    const group =
      new THREE.Group();

    group.name =
      name || "Farmer";

    this.gltfLoader.load(

      "./assets/characters/farmer/model.glb",

      gltf => {

        const model =
          gltf.scene;

        model.scale.set(
          1,
          1,
          1
        );

        model.position.set(
          0,
          0,
          0
        );

        group.add(
          model
        );

      },

      undefined,

      error => {

        console.error(
          "Farmer model failed to load:",
          error
        );

      }

    );

    return group;
  }


  // ========================================
  // EXISTING ACTOR CODE
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
// FINAL POLISHED CHARACTER
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
      0.94,
      1.02,
      0.94
    );

  }
  else if (type === "child") {

    group.scale.set(
      0.80,
      0.82,
      0.80
    );

  }

  // ======================================
  // MATERIALS
  // ======================================

  const skinMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xffc7a3,
      roughness: 0.62,
      metalness: 0
    });

  const skinDarkMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xe9a47f,
      roughness: 0.68
    });

  const hairMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x3a2418,
      roughness: 0.72
    });

  const eyeWhiteMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.28
    });

  const irisMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x4a2c20,
      roughness: 0.25
    });

  const blackMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x171717,
      roughness: 0.5
    });

  const mouthMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x8b1e2d,
      roughness: 0.5
    });

  // ======================================
  // CLOTHING COLOR
  // ======================================

  let clothesColor = 0x2563eb;

  if (costume === "school") {
    clothesColor = 0x1e3a8a;
  }
  else if (costume === "police") {
    clothesColor = 0x172554;
  }
  else if (costume === "doctor") {
    clothesColor = 0xf8fafc;
  }
  else if (costume === "traditional") {
    clothesColor = 0x9333ea;
  }
  else if (costume === "sports") {
    clothesColor = 0xdc2626;
  }
  else if (costume === "farmer") {
    clothesColor = 0x4f8a3c;
  }
  else if (costume === "explorer") {
    clothesColor = 0x8b5e34;
  }
  else if (costume === "superhero") {
    clothesColor = 0x2563eb;
  }

  const clothesMaterial =
    new THREE.MeshStandardMaterial({
      color: clothesColor,
      roughness: 0.72
    });

  // ======================================
  // BODY
  // ======================================

  const body =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.52,
        0.82,
        12,
        24
      ),
      clothesMaterial
    );

  body.scale.set(
    1.06,
    1.0,
    0.74
  );

  body.position.set(
    0,
    1.35,
    0
  );

  group.add(body);

  // ======================================
  // SHOULDERS
  // ======================================

  const shoulders =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.55,
        24,
        16
      ),
      clothesMaterial
    );

  shoulders.scale.set(
    1.28,
    0.42,
    0.68
  );

  shoulders.position.set(
    0,
    1.62,
    0
  );

  group.add(shoulders);

  // ======================================
  // NECK
  // ======================================

  const neck =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.19,
        0.22,
        0.30,
        20
      ),
      skinMaterial
    );

  neck.position.set(
    0,
    1.88,
    0
  );

  group.add(neck);

  // ======================================
  // HEAD
  // ======================================

  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.65,
        40,
        28
      ),
      skinMaterial
    );

  head.scale.set(
    0.96,
    1.04,
    0.94
  );

  head.position.set(
    0,
    2.38,
    0
  );

  group.add(head);

  // ======================================
  // EARS
  // ======================================

  [-1, 1].forEach(side => {

    const ear =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.14,
          20,
          14
        ),
        skinMaterial
      );

    ear.scale.set(
      0.62,
      1.0,
      0.78
    );

    ear.position.set(
      side * 0.61,
      2.38,
      0
    );

    group.add(ear);

  });

  // ======================================
  // INNER EARS
  // ======================================

  [-1, 1].forEach(side => {

    const innerEar =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.065,
          14,
          10
        ),
        skinDarkMaterial
      );

    innerEar.scale.set(
      0.65,
      1.0,
      0.5
    );

    innerEar.position.set(
      side * 0.625,
      2.38,
      0.075
    );

    group.add(innerEar);

  });

  // ======================================
  // HAIR CAP
  // ======================================

  const hair =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.67,
        40,
        24
      ),
      hairMaterial
    );

  hair.scale.set(
    1.03,
    0.66,
    0.98
  );

  hair.position.set(
    0,
    2.73,
    -0.02
  );

  group.add(hair);

  // ======================================
  // HAIR SIDES
  // ======================================

  [-1, 1].forEach(side => {

    const sideHair =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.22,
          20,
          14
        ),
        hairMaterial
      );

    sideHair.scale.set(
      0.72,
      1.25,
      0.72
    );

    sideHair.position.set(
      side * 0.49,
      2.61,
      0.05
    );

    group.add(sideHair);

  });

  // ======================================
  // FRONT HAIR
  // ======================================

  const fringe =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.30,
        24,
        16
      ),
      hairMaterial
    );

  fringe.scale.set(
    1.75,
    0.55,
    0.70
  );

  fringe.position.set(
    0,
    2.64,
    0.48
  );

  group.add(fringe);

  // ======================================
  // EYEBROWS
  // ======================================

  [-1, 1].forEach(side => {

    const eyebrow =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          0.035,
          0.18,
          4,
          8
        ),
        hairMaterial
      );

    eyebrow.position.set(
      side * 0.22,
      2.55,
      0.605
    );

    eyebrow.rotation.z =
      side < 0 ? 0.10 : -0.10;

    group.add(eyebrow);

  });

  // ======================================
  // EYES
  // ======================================

  [-1, 1].forEach(side => {

    // Eye white
    const eyeWhite =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.145,
          24,
          18
        ),
        eyeWhiteMaterial
      );

    eyeWhite.scale.set(
      0.95,
      1.12,
      0.82
    );

    eyeWhite.position.set(
      side * 0.22,
      2.40,
      0.585
    );

    group.add(eyeWhite);

    // Iris
    const iris =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.078,
          20,
          16
        ),
        irisMaterial
      );

    iris.position.set(
      side * 0.22,
      2.40,
      0.695
    );

    group.add(iris);

    // Pupil
    const pupil =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.040,
          16,
          12
        ),
        blackMaterial
      );

    pupil.position.set(
      side * 0.22,
      2.40,
      0.755
    );

    group.add(pupil);

    // Highlight
    const highlight =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.020,
          10,
          10
        ),
        eyeWhiteMaterial
      );

    highlight.position.set(
      side * 0.195,
      2.435,
      0.785
    );

    group.add(highlight);

  });

  // ======================================
  // NOSE
  // ======================================

  const nose =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.095,
        20,
        16
      ),
      skinMaterial
    );

  nose.scale.set(
    0.86,
    1.15,
    0.82
  );

  nose.position.set(
    0,
    2.245,
    0.665
  );

  group.add(nose);

  // ======================================
  // NOSE TIP
  // ======================================

  const noseTip =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.055,
        16,
        12
      ),
      skinMaterial
    );

  noseTip.position.set(
    0,
    2.205,
    0.705
  );

  group.add(noseTip);

  // ======================================
  // MOUTH
  // ======================================

  const mouth =
    new THREE.Mesh(
      new THREE.TorusGeometry(
        0.135,
        0.028,
        12,
        28,
        Math.PI
      ),
      mouthMaterial
    );

  mouth.rotation.x =
    Math.PI;

  mouth.position.set(
    0,
    2.07,
    0.655
  );

  group.add(mouth);

  // ======================================
  // LOWER LIP
  // ======================================

  const lowerLip =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.055,
        16,
        10
      ),
      mouthMaterial
    );

  lowerLip.scale.set(
    1.5,
    0.42,
    0.50
  );

  lowerLip.position.set(
    0,
    2.035,
    0.665
  );

  group.add(lowerLip);

  // ======================================
  // ARMS
  // ======================================

  [-1, 1].forEach(side => {

    const arm =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          0.135,
          0.66,
          8,
          14
        ),
        clothesMaterial
      );

    arm.position.set(
      side * 0.69,
      1.39,
      0
    );

    arm.rotation.z =
      side * 0.12;

    group.add(arm);

  });

  // ======================================
  // HANDS
  // ======================================

  [-1, 1].forEach(side => {

    const hand =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.165,
          20,
          16
        ),
        skinMaterial
      );

    hand.scale.set(
      0.92,
      1.08,
      0.92
    );

    hand.position.set(
      side * 0.78,
      0.99,
      0
    );

    group.add(hand);

    // Thumb
    const thumb =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.055,
          12,
          10
        ),
        skinMaterial
      );

    thumb.position.set(
      side * 0.86,
      1.02,
      0.08
    );

    group.add(thumb);

  });

  // ======================================
  // LEGS
  // ======================================

  [-1, 1].forEach(side => {

    const leg =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          0.155,
          0.70,
          8,
          14
        ),
        blackMaterial
      );

    leg.position.set(
      side * 0.20,
      0.47,
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
          0.235,
          24,
          16
        ),
        blackMaterial
      );

    shoe.scale.set(
      1.35,
      0.58,
      1.65
    );

    shoe.position.set(
      side * 0.20,
      0.12,
      0.13
    );

    group.add(shoe);

    // Shoe sole
    const sole =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.28,
          0.045,
          0.42
        ),
        blackMaterial
      );

    sole.position.set(
      side * 0.20,
      0.055,
      0.15
    );

    group.add(sole);

  });

  // ======================================
  // SCHOOL COSTUME
  // ======================================

  if (costume === "school") {

    const shirt =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          0.48,
          0.76,
          8,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          roughness: 0.72
        })
      );

    shirt.position.set(
      0,
      1.37,
      0
    );

    group.add(shirt);

    const tie =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.105,
          0.44,
          0.045
        ),
        new THREE.MeshStandardMaterial({
          color: 0xdc2626,
          roughness: 0.55
        })
      );

    tie.position.set(
      0,
      1.57,
      0.52
    );

    group.add(tie);

  }

  // ======================================
  // POLICE COSTUME
  // ======================================

  if (costume === "police") {

    const badge =
      new THREE.Mesh(
        new THREE.CircleGeometry(
          0.095,
          20
        ),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          roughness: 0.35
        })
      );

    badge.position.set(
      0,
      1.48,
      0.54
    );

    group.add(badge);

    const cap =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.46,
          0.54,
          0.14,
          28
        ),
        clothesMaterial
      );

    cap.position.set(
      0,
      2.92,
      0
    );

    group.add(cap);

    const capTop =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.29,
          0.34,
          0.18,
          24
        ),
        clothesMaterial
      );

    capTop.position.set(
      0,
      3.06,
      0
    );

    group.add(capTop);

  }

  // ======================================
  // DOCTOR COSTUME
  // ======================================

  if (costume === "doctor") {

    const coat =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.84,
          0.96,
          0.12
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.68
        })
      );

    coat.position.set(
      0,
      1.39,
      0.50
    );

    group.add(coat);

    const stethoscope =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          0.15,
          0.018,
          8,
          20,
          Math.PI
        ),
        blackMaterial
      );

    stethoscope.rotation.x =
      Math.PI / 2;

    stethoscope.position.set(
      0,
      1.65,
      0.57
    );

    group.add(stethoscope);

  }

  // ======================================
  // TRADITIONAL COSTUME
  // ======================================

  if (costume === "traditional") {

    body.material.color.set(
      0x9333ea
    );

    const belt =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.02,
          0.12,
          0.65
        ),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          roughness: 0.48
        })
      );

    belt.position.set(
      0,
      1.08,
      0
    );

    group.add(belt);

    const sash =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.12,
          0.72,
          0.06
        ),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          roughness: 0.5
        })
      );

    sash.position.set(
      0.30,
      1.45,
      0.48
    );

    sash.rotation.z =
      -0.15;

    group.add(sash);

  }

  // ======================================
  // SPORTS COSTUME
  // ======================================

  if (costume === "sports") {

    const stripe =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.72,
          0.08,
          0.035
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.45
        })
      );

    stripe.position.set(
      0,
      1.52,
      0.53
    );

    group.add(stripe);

    const number =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          0.24,
          0.30
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.45
        })
      );

    number.position.set(
      0,
      1.37,
      0.54
    );

    group.add(number);

  }

  // ======================================
  // FARMER COSTUME
  // ======================================

  if (costume === "farmer") {

    body.material.color.set(
      0x4f8a3c
    );

    const waistCloth =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.88,
          0.34,
          0.58
        ),
        new THREE.MeshStandardMaterial({
          color: 0xf5f0d0,
          roughness: 0.82
        })
      );

    waistCloth.position.set(
      0,
      1.03,
      0
    );

    group.add(waistCloth);

    const scarf =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.12,
          0.64,
          0.06
        ),
        new THREE.MeshStandardMaterial({
          color: 0xdc2626,
          roughness: 0.65
        })
      );

    scarf.position.set(
      0.34,
      1.77,
      0.44
    );

    scarf.rotation.z =
      -0.08;

    group.add(scarf);

    const hat =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.44,
          0.52,
          0.14,
          28
        ),
        new THREE.MeshStandardMaterial({
          color: 0xd6b36a,
          roughness: 0.88
        })
      );

    hat.position.set(
      0,
      2.93,
      0
    );

    group.add(hat);

    const hatTop =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.28,
          0.34,
          0.20,
          24
        ),
        new THREE.MeshStandardMaterial({
          color: 0xd6b36a,
          roughness: 0.88
        })
      );

    hatTop.position.set(
      0,
      3.08,
      0
    );

    group.add(hatTop);

  }

  // ======================================
  // EXPLORER COSTUME
  // ======================================

  if (costume === "explorer") {

    body.material.color.set(
      0x8b5e34
    );

    const belt =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.94,
          0.11,
          0.60
        ),
        new THREE.MeshStandardMaterial({
          color: 0x3f2a18,
          roughness: 0.82
        })
      );

    belt.position.set(
      0,
      1.08,
      0
    );

    group.add(belt);

    const backpack =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.48,
          0.65,
          0.20
        ),
        new THREE.MeshStandardMaterial({
          color: 0x166534,
          roughness: 0.82
        })
      );

    backpack.position.set(
      0,
      1.45,
      -0.43
    );

    group.add(backpack);

    const explorerHat =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.42,
          0.48,
          0.14,
          28
        ),
        new THREE.MeshStandardMaterial({
          color: 0xc08457,
          roughness: 0.85
        })
      );

    explorerHat.position.set(
      0,
      2.92,
      0
    );

    group.add(explorerHat);

  }

  // ======================================
  // SUPERHERO COSTUME
  // ======================================

  if (costume === "superhero") {

    body.material.color.set(
      0x2563eb
    );

    const heroBelt =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.96,
          0.12,
          0.62
        ),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          roughness: 0.45
        })
      );

    heroBelt.position.set(
      0,
      1.10,
      0
    );

    group.add(heroBelt);

    const emblem =
      new THREE.Mesh(
        new THREE.CircleGeometry(
          0.13,
          24
        ),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          roughness: 0.40
        })
      );

    emblem.position.set(
      0,
      1.50,
      0.55
    );

    group.add(emblem);

    const cape =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.76,
          1.08,
          0.055
        ),
        new THREE.MeshStandardMaterial({
          color: 0xdc2626,
          roughness: 0.65
        })
      );

    cape.position.set(
      0,
      1.55,
      -0.43
    );

    group.add(cape);

  }

  // ======================================
  // FINAL CHARACTER
  // ======================================

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
