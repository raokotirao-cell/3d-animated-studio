// ========================================
// 3D ANIMATED STUDIO
// MAIN APP CONTROLLER
// ========================================

import {
  loadProject,
  saveProject,
  clearProject,
  exportProjectJSON,
  importProjectJSON,
  defaultProject
} from "./store.js";

import { Studio3D } from "./scene3d.js";

import {
  populateVoices,
  speak,
  stopSpeak
} from "./voice.js";

import { initDashboard } from "./modules/dashboard.js";
import { initStory } from "./modules/story.js";
import { initCharacters } from "./modules/characters.js";
import { initCaptions } from "./modules/captions.js";


// ========================================
// SHORT DOM HELPER
// ========================================

const $ = id =>
  document.getElementById(id);


// ========================================
// PROJECT
// ========================================

let project = loadProject();


// ========================================
// 3D ENGINE
// ========================================

let studio = null;


// ========================================
// CURRENT SCENE
// ========================================

let currentSceneIndex = 0;


// ========================================
// NAVIGATION
// ========================================

function show(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.toggle(
        "active",
        page.id === pageId
      );

    });


  document
    .querySelectorAll(".nav")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.page === pageId
      );

    });


  if (pageId === "preview") {

    setTimeout(() => {

      studio?.resize();

    }, 50);

  }

}


// ========================================
// NAV BUTTONS
// ========================================

document
  .querySelectorAll(".nav")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        show(
          button.dataset.page
        );

      }
    );

  });


// ========================================
// SAVE
// ========================================

function save() {

  saveProject(project);

  updateStats();

}


// ========================================
// REFRESH ALL UI
// ========================================

function refresh() {

  updateStats();

  renderScenes();

  renderCharacters();

  renderCaptions();

  updateSceneEditor();

  updateSettings();

  updateStory();

}


// ========================================
// DASHBOARD STATS
// ========================================

function updateStats() {

  const sceneCount =
    project.scenes.length;


  const characterCount =
    project.characters.length;


  const captionCount =
    project.captions.length;


  const duration =
    project.scenes.reduce(
      (total, scene) =>
        total +
        Number(scene.duration || 0),
      0
    );


  if ($("sceneCount")) {

    $("sceneCount").textContent =
      sceneCount;

  }


  if ($("characterCount")) {

    $("characterCount").textContent =
      characterCount;

  }


  if ($("captionCount")) {

    $("captionCount").textContent =
      captionCount;

  }


  if ($("durationCount")) {

    $("durationCount").textContent =
      `${duration}s`;

  }

}


// ========================================
// STORY UI
// ========================================

function updateStory() {

  if ($("storyText")) {

    $("storyText").value =
      project.story || "";

  }

}


// ========================================
// RENDER SCENES
// ========================================

function renderScenes() {

  const list =
    $("sceneList");

  if (!list) return;


  list.innerHTML = "";


  if (!project.scenes.length) {

    list.innerHTML =
      `<div class="panel">
        No scenes yet.
      </div>`;

    return;

  }


  project.scenes.forEach(
    (scene, index) => {

      const card =
        document.createElement("div");

      card.className =
        "scene-card";


      const content =
        document.createElement("div");


      const title =
        document.createElement("b");


      title.textContent =
        scene.title ||
        `Scene ${index + 1}`;


      const info =
        document.createElement("small");


      info.textContent =
        `${scene.duration}s · ` +
        `${scene.background} · ` +
        `${scene.animation}`;


      const description =
        document.createElement("div");


      description.textContent =
        scene.description || "";


      content.appendChild(title);

      content.appendChild(
        document.createElement("br")
      );

      content.appendChild(info);

      content.appendChild(
        document.createElement("p")
      );

      content.lastChild
        .appendChild(description);


      const buttons =
        document.createElement("div");


      const edit =
        document.createElement("button");


      edit.textContent =
        "Edit";


      edit.onclick = () => {

        currentSceneIndex =
          index;

        updateSceneEditor();

        show("editor");

      };


      const deleteButton =
        document.createElement("button");


      deleteButton.textContent =
        "Delete";


      deleteButton.className =
        "danger";


      deleteButton.onclick = () => {

        if (
          !confirm(
            `Delete ${scene.title || "this scene"}?`
          )
        ) {

          return;

        }


        project.scenes.splice(
          index,
          1
        );


        if (
          currentSceneIndex >=
          project.scenes.length
        ) {

          currentSceneIndex =
            Math.max(
              0,
              project.scenes.length - 1
            );

        }


        save();

        refresh();

      };


      buttons.appendChild(edit);

      buttons.appendChild(
        deleteButton
      );


      card.appendChild(content);

      card.appendChild(buttons);


      list.appendChild(card);

    }
  );

}


// ========================================
// RENDER CHARACTERS
// ========================================

function renderCharacters() {

  const list =
    $("characterList");

  if (!list) return;


  list.innerHTML = "";


  if (!project.characters.length) {

    list.innerHTML =
      `<div class="panel">
        No characters yet.
      </div>`;

    return;

  }


  project.characters.forEach(
    (character, index) => {

      const item =
        document.createElement("div");

      item.className =
        "item";


      const text =
        document.createElement("div");


      text.innerHTML =
        `<strong></strong>
         <br>
         <small></small>`;


      text.querySelector(
        "strong"
      ).textContent =
        character.name;


      text.querySelector(
        "small"
      ).textContent =
        character.type;


      const deleteButton =
        document.createElement("button");


      deleteButton.textContent =
        "Delete";


      deleteButton.className =
        "danger";


      deleteButton.onclick = () => {

        project.characters.splice(
          index,
          1
        );


        project.scenes.forEach(
          scene => {

            scene.characters =
              (scene.characters || [])
                .filter(
                  name =>
                    name !==
                    character.name
                );

          }
        );


        save();

        refresh();

      };


      item.appendChild(text);

      item.appendChild(
        deleteButton
      );


      list.appendChild(item);

    }
  );

}


// ========================================
// RENDER CAPTIONS
// ========================================

function renderCaptions() {

  const list =
    $("captionList");

  if (!list) return;


  list.innerHTML = "";


  if (!project.captions.length) {

    list.innerHTML =
      `<div class="panel">
        No captions yet.
      </div>`;

    return;

  }


  project.captions.forEach(
    (caption, index) => {

      const item =
        document.createElement("div");

      item.className =
        "item";


      const text =
        document.createElement("div");


      text.textContent =
        `${caption.start}s → ` +
        `${caption.end}s: ` +
        caption.text;


      const deleteButton =
        document.createElement("button");


      deleteButton.textContent =
        "Delete";


      deleteButton.className =
        "danger";


      deleteButton.onclick = () => {

        project.captions.splice(
          index,
          1
        );


        save();

        refresh();

      };


      item.appendChild(text);

      item.appendChild(
        deleteButton
      );


      list.appendChild(item);

    }
  );

}


// ========================================
// SCENE EDITOR
// ========================================

function updateSceneEditor() {

  const select =
    $("sceneSelect");

  if (!select) return;


  select.innerHTML = "";


  project.scenes.forEach(
    (scene, index) => {

      const option =
        document.createElement("option");


      option.value =
        index;


      option.textContent =
        scene.title ||
        `Scene ${index + 1}`;


      select.appendChild(
        option
      );

    }
  );


  if (!project.scenes.length) {

    return;

  }


  if (
    currentSceneIndex >=
    project.scenes.length
  ) {

    currentSceneIndex =
      project.scenes.length - 1;

  }


  select.value =
    currentSceneIndex;


  loadSelectedScene();

}


// ========================================
// LOAD SELECTED SCENE
// ========================================

function loadSelectedScene() {

  const scene =
    project.scenes[
      currentSceneIndex
    ];


  if (!scene) return;


  if ($("sceneDuration")) {

    $("sceneDuration").value =
      scene.duration || 10;

  }


  if ($("cameraMode")) {

    $("cameraMode").value =
      scene.camera || "Static";

  }


  if ($("animationMode")) {

    $("animationMode").value =
      scene.animation || "None";

  }


  if ($("sceneDescription")) {

    $("sceneDescription").value =
      scene.description || "";

  }


  studio?.loadScene(
    scene,
    project.characters
  );

}


// ========================================
// SCENE SELECT
// ========================================

$("sceneSelect")?.addEventListener(
  "change",
  event => {

    currentSceneIndex =
      Number(event.target.value);

    loadSelectedScene();

  }
);


// ========================================
// APPLY SCENE
// ========================================

$("applySceneBtn")?.addEventListener(
  "click",
  () => {

    const scene =
      project.scenes[
        currentSceneIndex
      ];


    if (!scene) return;


    scene.duration =
      Math.max(
        1,
        Number(
          $("sceneDuration").value
        ) || 10
      );


    scene.camera =
      $("cameraMode").value;


    scene.animation =
      $("animationMode").value;


    scene.description =
      $("sceneDescription").value;


    save();

    refresh();

  }
);


// ========================================
// BACKGROUND BUTTONS
// ========================================

document
  .querySelectorAll(
    "[data-bg]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const scene =
          project.scenes[
            currentSceneIndex
          ];


        if (!scene) {

          alert(
            "Create or select a scene first."
          );

          return;

        }


        scene.background =
          button.dataset.bg;


        save();

        refresh();

      }
    );

  });


// ========================================
// NEW PROJECT
// ========================================

$("newProjectBtn")?.addEventListener(
  "click",
  () => {

    if (
      !confirm(
        "Create a new project?"
      )
    ) {

      return;

    }


    project =
      defaultProject();


    currentSceneIndex =
      0;


    save();

    refresh();

    show("dashboard");

  }
);


// ========================================
// SAVE BUTTON
// ========================================

$("saveBtn")?.addEventListener(
  "click",
  () => {

    save();

    alert(
      "Project saved locally."
    );

  }
);


// ========================================
// LOAD BUTTON
// ========================================

$("loadBtn")?.addEventListener(
  "click",
  () => {

    project =
      loadProject();


    currentSceneIndex =
      0;


    refresh();

    alert(
      "Project loaded."
    );

  }
);


// ========================================
// PROJECT NAME
// ========================================

$("projectName")?.addEventListener(
  "input",
  event => {

    project.name =
      event.target.value;

    save();

  }
);


function updateSettings() {

  if ($("projectName")) {

    $("projectName").value =
      project.name || "";

  }


  if ($("resolution")) {

    $("resolution").value =
      project.resolution ||
      "1280x720";

  }


  if ($("fps")) {

    $("fps").value =
      project.fps || 30;

  }

}


// ========================================
// EXPORT PROJECT JSON
// ========================================

$("exportBtn")?.addEventListener(
  "click",
  () => {

    exportProjectJSON(
      project
    );

  }
);


// ========================================
// VOICE
// ========================================

if ($("voiceSelect")) {

  populateVoices(
    $("voiceSelect")
  );

}


$("speakBtn")?.addEventListener(
  "click",
  () => {

    speak(
      $("voiceText").value,
      $("voiceSelect"),
      $("voiceRate").value
    );

  }
);


$("stopSpeakBtn")?.addEventListener(
  "click",
  () => {

    stopSpeak();

  }
);


// ========================================
// LOCAL AUDIO
// ========================================

$("audioFile")?.addEventListener(
  "change",
  event => {

    const file =
      event.target.files?.[0];


    if (!file) return;


    const url =
      URL.createObjectURL(
        file
      );


    $("audioPlayer").src =
      url;

  }
);


// ========================================
// 3D INITIALIZATION
// ========================================

function init3D() {

  const container =
    $("canvasWrap");


  if (!container) {

    return;

  }


  try {

    studio =
      new Studio3D(
        container
      );


    studio.onTime =
      time => {

        if ($("timeLabel")) {

          $("timeLabel")
            .textContent =
            `${time.toFixed(1)}s`;

        }

      };


    const scene =
      project.scenes[
        currentSceneIndex
      ];


    if (scene) {

      studio.loadScene(
        scene,
        project.characters
      );

    }

  }

  catch (error) {

    console.error(
      "3D initialization failed:",
      error
    );


    container.innerHTML =
      `<div class="panel">
        3D engine failed to load.
        Check the browser console.
      </div>`;

  }

}


// ========================================
// PREVIEW CONTROLS
// ========================================

$("playBtn")?.addEventListener(
  "click",
  () => {

    studio?.play();

  }
);


$("pauseBtn")?.addEventListener(
  "click",
  () => {

    studio?.pause();

  }
);


$("resetBtn")?.addEventListener(
  "click",
  () => {

    studio?.reset();

    if ($("timeLabel")) {

      $("timeLabel")
        .textContent =
        "0.0s";

    }

  }
);


// ========================================
// IMPORT PROJECT
// ========================================

const importInput =
  document.createElement(
    "input"
  );

importInput.type =
  "file";

importInput.accept =
  ".json,application/json";

importInput.hidden = true;

document.body.appendChild(
  importInput
);


$("loadBtn")?.addEventListener(
  "contextmenu",
  event => {

    event.preventDefault();

    importInput.click();

  }
);


importInput.addEventListener(
  "change",
  async event => {

    const file =
      event.target.files?.[0];


    if (!file) return;


    try {

      project =
        await importProjectJSON(
          file
        );


      save();

      refresh();


      alert(
        "Project imported."
      );

    }

    catch (error) {

      alert(
        "Import failed: " +
        error.message
      );

    }


    importInput.value =
      "";

  }
);


// ========================================
// EXPORT VIDEO
// ========================================

$("startExportBtn")?.addEventListener(
  "click",
  async () => {

    await exportVideo();

  }
);


$("resolution")?.addEventListener(
  "change",
  event => {

    project.resolution =
      event.target.value;

    save();

  }
);


$("fps")?.addEventListener(
  "change",
  event => {

    project.fps =
      Math.max(
        10,
        Math.min(
          60,
          Number(
            event.target.value
          ) || 30
        )
      );

    save();

  }
);


// ========================================
// WEBM EXPORT
// ========================================

async function exportVideo() {

  if (!studio) {

    alert(
      "3D preview is not ready."
    );

    return;

  }


  const canvas =
    studio.renderer.domElement;


  if (
    !canvas.captureStream
  ) {

    alert(
      "This browser does not support canvas recording."
    );

    return;

  }


  const seconds =
    Math.max(
      0.5,
      Math.min(
        300,
        Number(
          $("exportSeconds").value
        ) || 10
      )
    );


  const fps =
    Math.max(
      10,
      Math.min(
        60,
        Number(
          $("fps").value
        ) || 30
      )
    );


  const status =
    $("exportStatus");


  const link =
    $("downloadLink");


  if (status) {

    status.textContent =
      "Preparing WebM export...";

  }


  if (link) {

    link.hidden = true;

  }


  studio.reset();

  studio.play();


  const stream =
    canvas.captureStream(
      fps
    );


  let mime =
    "video/webm";


  if (
    MediaRecorder.isTypeSupported(
      "video/webm;codecs=vp9"
    )
  ) {

    mime =
      "video/webm;codecs=vp9";

  }

  else if (
    MediaRecorder.isTypeSupported(
      "video/webm;codecs=vp8"
    )
  ) {

    mime =
      "video/webm;codecs=vp8";

  }


  let recorder;


  try {

    recorder =
      new MediaRecorder(
        stream,
        {
          mimeType: mime
        }
      );

  }

  catch (error) {

    console.error(
      error
    );

    studio.pause();

    if (status) {

      status.textContent =
        "WebM recording is not supported.";

    }

    return;

  }


  const chunks = [];


  recorder.ondataavailable =
    event => {

      if (
        event.data &&
        event.data.size
      ) {

        chunks.push(
          event.data
        );

      }

    };


  recorder.onstop = () => {

    const blob =
      new Blob(
        chunks,
        {
          type:
            "video/webm"
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    if (link) {

      link.href =
        url;

      link.download =
        `${project.name || "3d-animation"}.webm`;

      link.textContent =
        "⬇️ Download WebM";

      link.hidden =
        false;

    }


    if (status) {

      status.textContent =
        "✅ WebM export complete.";

    }

  };


  recorder.start(
    250
  );


  setTimeout(
    () => {

      studio.pause();

      recorder.stop();

    },
    seconds * 1000
  );

}


// ========================================
// MODULES
// ========================================

const moduleContext = {

  project,

  $,

  save,

  refresh,

  show

};


// Initialize modules

initDashboard(
  moduleContext
);

initStory(
  moduleContext
);

initCharacters(
  moduleContext
);

initCaptions(
  moduleContext
);


// ========================================
// INITIAL LOAD
// ========================================

refresh();


// Initialize 3D after DOM is ready

init3D();


// ========================================
// CONSOLE MESSAGE
// ========================================

console.log(
  "🎬 3D Animated Studio loaded."
);

console.log(
  "Free browser-based processing."
);

console.log(
  "No API keys configured."
);
