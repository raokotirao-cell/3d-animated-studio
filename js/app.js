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

const $ = id => document.getElementById(id);

// ========================================
// PROJECT
// ========================================

let project = loadProject();

if (!project || typeof project !== "object") {
  project = defaultProject();
}

// Make sure required arrays exist
project.scenes = Array.isArray(project.scenes)
  ? project.scenes
  : [];

project.characters = Array.isArray(project.characters)
  ? project.characters
  : [];

project.captions = Array.isArray(project.captions)
  ? project.captions
  : [];

// ========================================
// 3D ENGINE
// ========================================

let studio = null;

// ========================================
// CURRENT SCENE
// ========================================

let currentSceneIndex = 0;

// ========================================
// PROJECT REPLACEMENT
// IMPORTANT:
// Keep the SAME project object reference.
// Modules receive this object later.
// ========================================

function replaceProject(nextProject) {

  if (!nextProject || typeof nextProject !== "object") {
    return;
  }

  const fresh = {
    ...defaultProject(),
    ...nextProject
  };

  project.name =
    fresh.name || "Untitled Project";

  project.story =
    fresh.story || "";

  project.scenes =
    Array.isArray(fresh.scenes)
      ? fresh.scenes
      : [];

  project.characters =
    Array.isArray(fresh.characters)
      ? fresh.characters
      : [];

  project.backgrounds =
    Array.isArray(fresh.backgrounds)
      ? fresh.backgrounds
      : [];

  project.captions =
    Array.isArray(fresh.captions)
      ? fresh.captions
      : [];

  project.resolution =
    fresh.resolution || "1280x720";

  project.fps =
    Number(fresh.fps) || 30;

  project.status =
    fresh.status || "Ready";
}

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

function initNavigation() {

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

}

// ========================================
// SAVE
// ========================================

function save() {

  try {

    saveProject(project);

    updateStats();

  } catch (error) {

    console.error(
      "Save failed:",
      error
    );

  }

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

  const scenes =
    Array.isArray(project.scenes)
      ? project.scenes
      : [];

  const characters =
    Array.isArray(project.characters)
      ? project.characters
      : [];

  const captions =
    Array.isArray(project.captions)
      ? project.captions
      : [];

  const sceneCount =
    scenes.length;

  const characterCount =
    characters.length;

  const captionCount =
    captions.length;

  const duration =
    scenes.reduce(
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
      `
      <div class="panel">
        No scenes yet.
      </div>
      `;

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
        `${scene.duration || 0}s · ` +
        `${scene.background || "day"} · ` +
        `${scene.animation || "None"}`;

      const description =
        document.createElement("div");

      description.textContent =
        scene.description || "";

      content.appendChild(title);

      content.appendChild(
        document.createElement("br")
      );

      content.appendChild(info);

      const paragraph =
        document.createElement("p");

      paragraph.appendChild(
        description
      );

      content.appendChild(
        paragraph
      );

      const buttons =
        document.createElement("div");

      const edit =
        document.createElement("button");

      edit.type = "button";

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

      deleteButton.type = "button";

      deleteButton.textContent =
        "Delete";

      deleteButton.className =
        "danger";

      deleteButton.onclick = () => {

        if (
          !confirm(
            `Delete ${
              scene.title ||
              "this scene"
            }?`
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
// ADD NEW SCENE
// ========================================

$("addSceneBtn")?.addEventListener(
  "click",
  () => {

    const newScene = {
      title:
        `Scene ${project.scenes.length + 1}`,

      duration: 5,

      description: "",

      background: "day",

      characters: [],

      dialogue: "",

      camera: "Static",

      animation: "None"
    };

    project.scenes.push(
      newScene
    );

    currentSceneIndex =
      project.scenes.length - 1;

    save();

    refresh();

    show("editor");

    loadSelectedScene();

  }
);
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
      `
      <div class="panel">
        No characters yet.
      </div>
      `;

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

      const strong =
        document.createElement("strong");

      strong.textContent =
        character.name || "Unnamed";

      const br =
        document.createElement("br");

      const small =
        document.createElement("small");

      small.textContent =
        character.type || "human";

      text.appendChild(strong);

      text.appendChild(br);

      text.appendChild(small);

      const deleteButton =
        document.createElement("button");

      deleteButton.type = "button";

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
              (
                scene.characters || []
              ).filter(
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
      `
      <div class="panel">
        No captions yet.
      </div>
      `;

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
        `${caption.text}`;

      const deleteButton =
        document.createElement("button");

      deleteButton.type = "button";

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

  if (studio) {

    try {

      studio.loadScene(
        scene,
        project.characters
      );

    } catch (error) {

      console.error(
        "Scene loading failed:",
        error
      );

    }

  }

}

// ========================================
// SCENE SELECT
// ========================================

$("sceneSelect")?.addEventListener(
  "change",
  event => {

    currentSceneIndex =
      Number(
        event.target.value
      );

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

    if (!scene) {

      alert(
        "Create a scene first."
      );

      return;

    }

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

    loadSelectedScene();

    refresh();

  }
);

// ========================================
// BACKGROUND BUTTONS
// ========================================

document
  .querySelectorAll("[data-bg]")
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

        loadSelectedScene();

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

    // IMPORTANT:
    // Do NOT replace project object.
    Object.assign(
      project,
      defaultProject()
    );

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

    try {

      // IMPORTANT:
      // Keep same project reference.
      Object.assign(
        project,
        loadProject()
      );

      currentSceneIndex =
        0;

      refresh();

      alert(
        "Project loaded."
      );

    } catch (error) {

      console.error(
        "Load failed:",
        error
      );

      alert(
        "Project load failed."
      );

    }

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

// ========================================
// SETTINGS
// ========================================

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

    try {

      exportProjectJSON(
        project
      );

    } catch (error) {

      console.error(
        "Project export failed:",
        error
      );

      alert(
        "Project export failed."
      );

    }

  }
);

// ========================================
// VOICE
// ========================================

if ($("voiceSelect")) {

  try {

    populateVoices(
      $("voiceSelect")
    );

  } catch (error) {

    console.error(
      "Voice initialization failed:",
      error
    );

  }

}

$("speakBtn")?.addEventListener(
  "click",
  () => {

    const text =
      $("voiceText")?.value || "";

    if (!text.trim()) {

      alert(
        "Enter narration text first."
      );

      return;

    }

    speak(
      text,
      $("voiceSelect"),
      $("voiceRate")?.value || 1
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

    if ($("audioPlayer")) {

      $("audioPlayer").src =
        url;

    }

  }
);

// ========================================
// 3D INITIALIZATION
// ========================================

function init3D() {

  const container =
    $("canvasWrap");

  if (!container) {

    console.warn(
      "canvasWrap not found."
    );

    return;

  }

  try {

    studio =
      new Studio3D(
        container
      );

    studio.onTime =
  time => {

    const scene =
      project.scenes[
        currentSceneIndex
      ];

    if ($("timeLabel")) {

      $("timeLabel")
        .textContent =
        `${time.toFixed(1)}s`;

    }

    // ====================================
    // AUTO NEXT SCENE
    // ====================================

    if (
      studio.playing &&
      scene &&
      time >= Number(scene.duration || 5)
    ) {

      const nextIndex =
        currentSceneIndex + 1;

      // More scenes available
      if (
        nextIndex <
        project.scenes.length
      ) {

        currentSceneIndex =
          nextIndex;

        studio.reset();

        studio.loadScene(
          project.scenes[
            currentSceneIndex
          ],
          project.characters
        );

        studio.play();

      } else {

        // Last scene finished
        studio.pause();

        studio.reset();

      }

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

  } catch (error) {

    console.error(
      "3D initialization failed:",
      error
    );

    container.innerHTML =
      `
      <div class="panel">
        3D engine failed to load.
        Check the browser console.
      </div>
      `;

  }

}

// ========================================
// PREVIEW CONTROLS
// ========================================

$("playBtn")?.addEventListener(
  "click",
  () => {

    if (!studio) {

      alert(
        "3D preview is not ready."
      );

      return;

    }

    studio.play();

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

importInput.hidden =
  true;

document.body.appendChild(
  importInput
);

// Right click Load = Import
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

      const importedProject =
        await importProjectJSON(
          file
        );

      // IMPORTANT:
      // Keep moduleContext.project
      // pointing to same object.
      Object.assign(
        project,
        importedProject
      );

      currentSceneIndex =
        0;

      save();

      refresh();

      alert(
        "Project imported."
      );

    } catch (error) {

      console.error(
        "Import failed:",
        error
      );

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

    try {

      await exportVideo();

    } catch (error) {

      console.error(
        "Export failed:",
        error
      );

      const status =
        $("exportStatus");

      if (status) {

        status.textContent =
          "❌ Export failed.";

      }

    }

  }
);

// ========================================
// RESOLUTION
// ========================================

$("resolution")?.addEventListener(
  "change",
  event => {

    project.resolution =
      event.target.value;

    save();

  }
);

// ========================================
// FPS
// ========================================

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

  if (!studio.renderer) {

    alert(
      "3D renderer is not ready."
    );

    return;

  }

  const canvas =
    studio.renderer.domElement;

  if (!canvas.captureStream) {

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
          $("exportSeconds")?.value
        ) || 10
      )
    );

  const fps =
    Math.max(
      10,
      Math.min(
        60,
        Number(
          $("fps")?.value
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

    link.hidden =
      true;

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
    typeof MediaRecorder !==
    "undefined" &&
    MediaRecorder.isTypeSupported(
      "video/webm;codecs=vp9"
    )
  ) {

    mime =
      "video/webm;codecs=vp9";

  } else if (
    typeof MediaRecorder !==
    "undefined" &&
    MediaRecorder.isTypeSupported(
      "video/webm;codecs=vp8"
    )
  ) {

    mime =
      "video/webm;codecs=vp8";

  }

  if (
    typeof MediaRecorder ===
    "undefined"
  ) {

    studio.pause();

    if (status) {

      status.textContent =
        "WebM recording is not supported.";

    }

    return;

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

  } catch (error) {

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

  recorder.onerror =
    event => {

      console.error(
        "MediaRecorder error:",
        event
      );

    };

  recorder.onstop =
    () => {

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
          `${
            project.name ||
            "3d-animation"
          }.webm`;

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

      try {

        studio.pause();

        if (
          recorder.state !==
          "inactive"
        ) {

          recorder.stop();

        }

      } catch (error) {

        console.error(
          "Recorder stop failed:",
          error
        );

      }

    },
    seconds * 1000
  );

}

// ========================================
// MODULE CONTEXT
// IMPORTANT:
// `project` object reference never changes.
// ========================================

const moduleContext = {

  project,

  $,

  save,

  refresh,

  show

};

// ========================================
// INITIALIZE MODULES
// ========================================

try {

  initDashboard(
    moduleContext
  );

} catch (error) {

  console.error(
    "Dashboard module failed:",
    error
  );

}

try {

  initStory(
    moduleContext
  );

} catch (error) {

  console.error(
    "Story module failed:",
    error
  );

}

try {

  initCharacters(
    moduleContext
  );

} catch (error) {

  console.error(
    "Characters module failed:",
    error
  );

}

try {

  initCaptions(
    moduleContext
  );

} catch (error) {

  console.error(
    "Captions module failed:",
    error
  );

}

// ========================================
// INITIAL LOAD
// ========================================

function initApp() {

  initNavigation();

  refresh();

  init3D();

  console.log(
    "🎬 3D Animated Studio loaded."
  );

  console.log(
    "Free browser-based processing."
  );

  console.log(
    "No API keys configured."
  );

}

// ========================================
// START
// ========================================

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initApp,
    {
      once: true
    }
  );

} else {

  initApp();

}
