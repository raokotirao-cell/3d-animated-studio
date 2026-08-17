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
    960 / 540,
    0.1,
    100
  );
    this.camera.position.set(
  0,
  3.2,
  8.0
);

this.camera.lookAt(
  0,
  2.0,
  0
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
    this.controls.target.set(
  0,
  2.0,
  0
);
this.controls.enableZoom = true;

this.controls.minDistance = 3;
this.controls.maxDistance = 12;

this.controls.zoomSpeed = 0.8;
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

this.zoomState = {
  position: new THREE.Vector3(
    0,
    2.8,
    5
  ),
  target: new THREE.Vector3(
    0,
    1.5,
    0
  )
};
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

    "./assets/characters/farmer/model-v6.glb",

    gltf => {

      const model =
        gltf.scene;

      // ======================================
      // AUTO FIT FARMER MODEL
      // ======================================

      const box =
        new THREE.Box3().setFromObject(model);

      const size =
        new THREE.Vector3();

      const center =
        new THREE.Vector3();

      box.getSize(size);
      box.getCenter(center);

      // Target character height
      const targetHeight = 4.2;

      if (size.y > 0) {

        const scale =
          targetHeight / size.y;

        model.scale.set(
          scale,
          scale,
          scale
        );
      }

      // Update bounding box after scaling
      model.updateMatrixWorld(true);

      const fittedBox =
        new THREE.Box3().setFromObject(model);

      const fittedCenter =
        new THREE.Vector3();

      fittedBox.getCenter(
        fittedCenter
      );

      // Center character horizontally
      model.position.x =
        -fittedCenter.x;

      model.position.z =
        -fittedCenter.z;

      // Put feet exactly on ground
      model.position.y =
        -fittedBox.min.y;

      // ======================================
      // SHADOWS
      // ======================================

      model.traverse(
        object => {

          if (object.isMesh) {

            object.castShadow =
              true;

            object.receiveShadow =
              true;
          }

        }
      );

      group.add(model);

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
// POLISHED CHARACTER BASE
// ========================================
cartoonHuman(
  name,
  costume = "casual",
  type = "human"
) {

  const group = new THREE.Group();

  group.name =
    name || "Cartoon Human";


  // ======================================
  // CHARACTER SCALE
  // ======================================

  if (type === "female") {

    group.scale.set(
      0.96,
      1.02,
      0.96
    );

  }

  else if (type === "child") {

    group.scale.set(
      0.78,
      0.82,
      0.78
    );

  }


  // ======================================
  // MATERIALS
  // ======================================

  const skinMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xffc7a3,
      roughness: 0.48,
      metalness: 0
    });


  const skinDarkMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xe5a07c,
      roughness: 0.55
    });


  const skinHighlightMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xffd8bd,
      roughness: 0.42
    });


  const hairMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x24160f,
      roughness: 0.60,
      metalness: 0
    });


  const hairHighlightMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x3b2418,
      roughness: 0.52
    });


  const eyeWhiteMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.22
    });


  const irisMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x4a2c20,
      roughness: 0.20
    });


  const blackMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x151515,
      roughness: 0.42
    });


  const mouthMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x5f101d,
      roughness: 0.42
    });


  const lipMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xb8324b,
      roughness: 0.45
    });


  const teethMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.30
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
      roughness: 0.62
    });


  // ======================================
  // HELPER
  // ======================================

  const addMesh =
    (geometry, material, position, scale = null) => {

      const mesh =
        new THREE.Mesh(
          geometry,
          material
        );

      mesh.position.set(
        position[0],
        position[1],
        position[2]
      );

      if (scale) {

        mesh.scale.set(
          scale[0],
          scale[1],
          scale[2]
        );

      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      group.add(mesh);

      return mesh;

    };


  // ======================================
  // TORSO
  // ======================================

  const torso =
    addMesh(

      new THREE.CapsuleGeometry(
        0.50,
        0.82,
        16,
        32
      ),

      clothesMaterial,

      [0, 1.34, 0],

      [1.10, 1.02, 0.78]

    );


  // ======================================
  // CHEST / SHOULDER VOLUME
  // ======================================

  addMesh(

    new THREE.SphereGeometry(
      0.52,
      32,
      20
    ),

    clothesMaterial,

    [0, 1.62, 0],

    [1.28, 0.46, 0.76]

  );


  // ======================================
  // NECK
  // ======================================

  addMesh(

    new THREE.CylinderGeometry(
      0.18,
      0.21,
      0.30,
      24
    ),

    skinMaterial,

    [0, 1.88, 0]

  );


  // ======================================
  // NECK SHADOW / COLLAR
  // ======================================

  addMesh(

    new THREE.TorusGeometry(
      0.205,
      0.035,
      10,
      32
    ),

    clothesMaterial,

    [0, 1.76, 0]

  );


  // ======================================
  // HEAD
  // ======================================

  addMesh(

    new THREE.SphereGeometry(
      0.67,
      48,
      36
    ),

    skinMaterial,

    [0, 2.39, 0],

    [0.98, 1.06, 0.94]

  );


  // ======================================
  // JAW / CHIN
  // ======================================

  addMesh(

    new THREE.SphereGeometry(
      0.43,
      32,
      24
    ),

    skinMaterial,

    [0, 2.12, 0.33],

    [1.05, 0.62, 0.72]

  );


  // ======================================
  // CHEEKS
  // ======================================

  [-1, 1].forEach(side => {

    addMesh(

      new THREE.SphereGeometry(
        0.18,
        24,
        18
      ),

      skinHighlightMaterial,

      [
        side * 0.36,
        2.22,
        0.55
      ],

      [
        1.15,
        0.82,
        0.55
      ]

    );

  });


  // ======================================
  // EARS
  // ======================================

  [-1, 1].forEach(side => {

    addMesh(

      new THREE.SphereGeometry(
        0.155,
        28,
        20
      ),

      skinMaterial,

      [
        side * 0.62,
        2.39,
        0
      ],

      [
        0.62,
        1.08,
        0.78
      ]

    );


    // Inner ear

    addMesh(

      new THREE.SphereGeometry(
        0.082,
        20,
        16
      ),

      skinDarkMaterial,

      [
        side * 0.635,
        2.39,
        0.075
      ],

      [
        0.62,
        1.10,
        0.42
      ]

    );

  });


  // ======================================
  // HAIR BACK / CAP
  // ======================================

  addMesh(

    new THREE.SphereGeometry(
      0.69,
      48,
      32
    ),

    hairMaterial,

    [0, 2.69, -0.02],

    [1.04, 0.68, 0.99]

  );


  // ======================================
  // HAIR SIDES
  // ======================================

  [-1, 1].forEach(side => {

    addMesh(

      new THREE.SphereGeometry(
        0.23,
        28,
        20
      ),

      hairMaterial,

      [
        side * 0.48,
        2.57,
        0.10
      ],

      [
        0.76,
        1.35,
        0.75
      ]

    );

  });


  // ======================================
  // HAIR CURLS / FRONT CLUMPS
  // ======================================

  const hairClumps = [

    [-0.38, 2.68, 0.43, 0.42, 0.48, 0.70],
    [-0.19, 2.73, 0.48, 0.42, 0.42, 0.72],
    [ 0.00, 2.75, 0.49, 0.44, 0.40, 0.72],
    [ 0.20, 2.73, 0.47, 0.42, 0.43, 0.72],
    [ 0.39, 2.68, 0.43, 0.42, 0.48, 0.70]

  ];


  hairClumps.forEach(h => {

    addMesh(

      new THREE.SphereGeometry(
        0.27,
        24,
        18
      ),

      hairHighlightMaterial,

      [
        h[0],
        h[1],
        h[2]
      ],

      [
        h[3],
        h[4],
        h[5]
      ]

    );

  });


  // ======================================
  // EYEBROWS
  // ======================================

  [-1, 1].forEach(side => {

    const brow =
      addMesh(

        new THREE.CapsuleGeometry(
          0.045,
          0.20,
          8,
          12
        ),

        hairMaterial,

        [
          side * 0.22,
          2.56,
          0.61
        ]

      );


    brow.rotation.z =
      side < 0
        ? 0.10
        : -0.10;


    brow.scale.set(
      1.0,
      1.0,
      0.72
    );

  });


  // ======================================
  // EYES
  // ======================================

  [-1, 1].forEach(side => {

    // Eye white

    addMesh(

      new THREE.SphereGeometry(
        0.17,
        32,
        24
      ),

      eyeWhiteMaterial,

      [
        side * 0.22,
        2.40,
        0.595
      ],

      [
        1.05,
        1.18,
        0.82
      ]

    );


    // Iris

    addMesh(

      new THREE.SphereGeometry(
        0.092,
        28,
        22
      ),

      irisMaterial,

      [
        side * 0.22,
        2.40,
        0.715
      ],

      [
        1.0,
        1.08,
        0.62
      ]

    );


    // Pupil

    addMesh(

      new THREE.SphereGeometry(
        0.047,
        20,
        16
      ),

      blackMaterial,

      [
        side * 0.22,
        2.40,
        0.765
      ]

    );


    // Main highlight

    addMesh(

      new THREE.SphereGeometry(
        0.027,
        14,
        12
      ),

      eyeWhiteMaterial,

      [
        side * 0.195,
        2.445,
        0.798
      ]

    );


    // Small highlight

    addMesh(

      new THREE.SphereGeometry(
        0.012,
        10,
        10
      ),

      eyeWhiteMaterial,

      [
        side * 0.245,
        2.375,
        0.795
      ]

    );


    // Upper eyelid

    addMesh(

      new THREE.SphereGeometry(
        0.17,
        24,
        16
      ),

      skinMaterial,

      [
        side * 0.22,
        2.49,
        0.61
      ],

      [
        1.0,
        0.28,
        0.40
      ]

    );

  });


  // ======================================
  // NOSE BRIDGE
  // ======================================

  addMesh(

    new THREE.SphereGeometry(
      0.085,
      24,
      18
    ),

    skinMaterial,

    [0, 2.285, 0.64],

    [0.72, 1.45, 0.72]

  );


  // ======================================
  // NOSE TIP
  // ======================================

  addMesh(

    new THREE.SphereGeometry(
      0.075,
      24,
      18
    ),

    skinHighlightMaterial,

    [0, 2.205, 0.705],

    [1.10, 0.82, 1.0]

  );


  // ======================================
  // NOSE WINGS
  // ======================================

  [-1, 1].forEach(side => {

    addMesh(

      new THREE.SphereGeometry(
        0.042,
        16,
        12
      ),

      skinDarkMaterial,

      [
        side * 0.055,
        2.195,
        0.69
      ],

      [
        1.25,
        0.72,
        0.75
      ]

    );

  });


  // ======================================
  // MOUTH OPENING
  // ======================================

  addMesh(

    new THREE.SphereGeometry(
      0.13,
      28,
      20
    ),

    mouthMaterial,

    [0, 2.075, 0.67],

    [1.18, 0.56, 0.46]

  );


  // ======================================
  // UPPER LIP
  // ======================================

  addMesh(

    new THREE.TorusGeometry(
      0.105,
      0.025,
      10,
      24,
      Math.PI
    ),

    lipMaterial,

    [0, 2.095, 0.705]

  );


  // ======================================
  // LOWER LIP
  // ======================================

  addMesh(

    new THREE.SphereGeometry(
      0.065,
      20,
      14
    ),

    lipMaterial,

    [0, 2.035, 0.70],

    [1.45, 0.45, 0.60]

  );


  // ======================================
  // TEETH
  // ======================================

  addMesh(

    new THREE.SphereGeometry(
      0.075,
      20,
      12
    ),

    teethMaterial,

    [0, 2.082, 0.705],

    [1.10, 0.28, 0.42]

  );


  // ======================================
  // ARMS
  // ======================================

  [-1, 1].forEach(side => {

    const arm =
      addMesh(

        new THREE.CapsuleGeometry(
          0.145,
          0.66,
          10,
          18
        ),

        clothesMaterial,

        [
          side * 0.70,
          1.38,
          0
        ]

      );


    arm.rotation.z =
      side * 0.12;

  });


  // ======================================
  // HANDS
  // ======================================

  [-1, 1].forEach(side => {

    addMesh(

      new THREE.SphereGeometry(
        0.17,
        24,
        18
      ),

      skinMaterial,

      [
        side * 0.79,
        0.98,
        0
      ],

      [
        0.95,
        1.08,
        0.82
      ]

    );


    // Thumb

    addMesh(

      new THREE.SphereGeometry(
        0.065,
        16,
        12
      ),

      skinMaterial,

      [
        side * 0.86,
        1.01,
        0.09
      ],

      [
        0.80,
        1.20,
        0.75
      ]

    );


    // Fingers

    for (
      let finger = 0;
      finger < 4;
      finger++
    ) {

      addMesh(

        new THREE.SphereGeometry(
          0.035,
          12,
          10
        ),

        skinMaterial,

        [
          side *
            (
              0.735 +
              finger * 0.035
            ),
          0.92 -
            Math.abs(
              finger - 1.5
            ) * 0.012,
          0.10
        ]

      );

    }

  });


  // ======================================
  // LEGS
  // ======================================

  [-1, 1].forEach(side => {

    addMesh(

      new THREE.CapsuleGeometry(
        0.17,
        0.70,
        10,
        18
      ),

      blackMaterial,

      [
        side * 0.21,
        0.47,
        0
      ]

    );

  });


  // ======================================
  // SHOES
  // ======================================

  [-1, 1].forEach(side => {

    addMesh(

      new THREE.SphereGeometry(
        0.24,
        28,
        18
      ),

      blackMaterial,

      [
        side * 0.21,
        0.12,
        0.14
      ],

      [
        1.38,
        0.60,
        1.72
      ]

    );


    // Sole

    addMesh(

      new THREE.BoxGeometry(
        0.34,
        0.055,
        0.46
      ),

      blackMaterial,

      [
        side * 0.21,
        0.055,
        0.16
      ]

    );

  });


  // ======================================
  // SCHOOL COSTUME
  // ======================================

  if (costume === "school") {

    const shirt =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          0.48,
          0.78,
          10,
          20
        ),
        new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          roughness: 0.62
        })
      );

    shirt.position.set(
      0,
      1.36,
      0.02
    );

    shirt.scale.set(
      1.04,
      1.0,
      0.80
    );

    group.add(shirt);


    addMesh(

      new THREE.BoxGeometry(
        0.11,
        0.46,
        0.05
      ),

      new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.50
      }),

      [0, 1.56, 0.51]

    );

  }


  // ======================================
  // POLICE COSTUME
  // ======================================

  if (costume === "police") {

    addMesh(

      new THREE.CircleGeometry(
        0.095,
        24
      ),

      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.30
      }),

      [0, 1.48, 0.54]

    );


    addMesh(

      new THREE.CylinderGeometry(
        0.48,
        0.56,
        0.14,
        32
      ),

      clothesMaterial,

      [0, 2.92, 0]

    );


    addMesh(

      new THREE.CylinderGeometry(
        0.29,
        0.34,
        0.18,
        28
      ),

      clothesMaterial,

      [0, 3.06, 0]

    );

  }


  // ======================================
  // DOCTOR COSTUME
  // ======================================

  if (costume === "doctor") {

    addMesh(

      new THREE.BoxGeometry(
        0.84,
        0.96,
        0.12
      ),

      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.60
      }),

      [0, 1.39, 0.50]

    );


    const stethoscope =
      addMesh(

        new THREE.TorusGeometry(
          0.15,
          0.018,
          8,
          24,
          Math.PI
        ),

        blackMaterial,

        [0, 1.65, 0.57]

      );

    stethoscope.rotation.x =
      Math.PI / 2;

  }


  // ======================================
  // TRADITIONAL COSTUME
  // ======================================

  if (costume === "traditional") {

    torso.material.color.set(
      0x9333ea
    );


    addMesh(

      new THREE.BoxGeometry(
        1.02,
        0.12,
        0.65
      ),

      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.45
      }),

      [0, 1.08, 0]

    );


    const sash =
      addMesh(

        new THREE.BoxGeometry(
          0.12,
          0.72,
          0.06
        ),

        new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          roughness: 0.45
        }),

        [0.30, 1.45, 0.48]

      );

    sash.rotation.z =
      -0.15;

  }


  // ======================================
  // SPORTS COSTUME
  // ======================================

  if (costume === "sports") {

    addMesh(

      new THREE.BoxGeometry(
        0.72,
        0.08,
        0.035
      ),

      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.40
      }),

      [0, 1.52, 0.53]

    );

  }


  // ======================================
  // EXPLORER
  // ======================================

  if (costume === "explorer") {

    torso.material.color.set(
      0x8b5e34
    );


    addMesh(

      new THREE.BoxGeometry(
        0.94,
        0.11,
        0.60
      ),

      blackMaterial,

      [0, 1.08, 0]

    );


    addMesh(

      new THREE.BoxGeometry(
        0.48,
        0.65,
        0.20
      ),

      new THREE.MeshStandardMaterial({
        color: 0x166534,
        roughness: 0.78
      }),

      [0, 1.45, -0.43]

    );


    addMesh(

      new THREE.CylinderGeometry(
        0.42,
        0.48,
        0.14,
        32
      ),

      new THREE.MeshStandardMaterial({
        color: 0xc08457,
        roughness: 0.78
      }),

      [0, 2.92, 0]

    );

  }


  // ======================================
  // SUPERHERO
  // ======================================

  if (costume === "superhero") {

    torso.material.color.set(
      0x2563eb
    );


    addMesh(

      new THREE.BoxGeometry(
        0.96,
        0.12,
        0.62
      ),

      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.40
      }),

      [0, 1.10, 0]

    );


    addMesh(

      new THREE.CircleGeometry(
        0.13,
        24
      ),

      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.35
      }),

      [0, 1.50, 0.55]

    );


    addMesh(

      new THREE.BoxGeometry(
        0.76,
        1.08,
        0.055
      ),

      new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.58
      }),

      [0, 1.55, -0.43]

    );

  }


  // ======================================
  // FINAL
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


        // ======================================
// WALK — ACTUAL CHARACTER MOVEMENT
// ======================================

// ======================================
// WALK — CHARACTER MOVEMENT
// ======================================

if (mode === "Walk") {

  const duration =
    Math.max(
      0.5,
      Number(this.sceneData.duration) || 10
    );

  const startZ = 0;
  const endZ = -4;

  const progress =
    Math.min(
      this.elapsed / duration,
      1
    );

  // --------------------------------------
  // Move character forward
  // --------------------------------------

  actor.position.z =
    startZ +
    (endZ - startZ) * progress;

  // --------------------------------------
  // Natural walking bounce
  // --------------------------------------

  actor.position.y =
    Math.abs(
      Math.sin(time * 8)
    ) * 0.04;

  // --------------------------------------
  // Slight body movement
  // --------------------------------------

  actor.rotation.y =
    Math.sin(time * 8) * 0.04;
walkSwing
  // --------------------------------------
  // Arm / leg movement
  // --------------------------------------
if (mode === "Walk") {

  const duration =
    Math.max(
      0.5,
      Number(this.sceneData.duration) || 10
    );

  const startZ = 0;
  const endZ = -4;

  const progress =
    Math.min(
      this.elapsed / duration,
      1
    );

  actor.position.z =
    startZ +
    (endZ - startZ) * progress;

  actor.position.y =
    Math.abs(
      Math.sin(time * 8)
    ) * 0.04;

  actor.rotation.y =
    Math.sin(time * 8) * 0.04;

}
  
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
this.zoomState.position.copy(
  this.camera.position
);

this.zoomState.target.copy(
  this.controls.target
);

    this.renderer.render(
      this.scene,
      this.camera
    );

if (
  this.onTime &&
  (
    !this._lastTimeUpdate ||
    this.elapsed - this._lastTimeUpdate >= 0.1
  )
) {

  this._lastTimeUpdate =
    this.elapsed;

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

  // ----------------------------------------
  // RESTORE LAST USER CAMERA POSITION
  // ----------------------------------------

  if (this.zoomState) {

    this.camera.position.copy(
      this.zoomState.position
    );

    this.controls.target.copy(
      this.zoomState.target
    );

  }

  // ----------------------------------------
  // UPDATE CAMERA
  // ----------------------------------------

  this.camera.lookAt(
    this.controls.target
  );

  this.camera.updateProjectionMatrix();

  this.controls.update();

}
  
}
