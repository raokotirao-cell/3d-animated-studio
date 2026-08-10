// ========================================
// 3D ANIMATED STUDIO
// PROJECT STORAGE
// ========================================

const PROJECT_KEY = "free3dAnimatedStudioProject";


// ========================================
// DEFAULT PROJECT
// ========================================

export function defaultProject() {

  return {

    name: "Untitled 3D Project",

    story: "",

    scenes: [

      {
        title: "Scene 1",

        duration: 10,

        description: "A new 3D scene",

        background: "day",

        camera: "Static",

        animation: "None",

        characters: []
      }

    ],

    characters: [],

    captions: [],

    resolution: "1280x720",

    fps: 30

  };

}


// ========================================
// SAVE PROJECT
// ========================================

export function saveProject(project) {

  try {

    localStorage.setItem(
      PROJECT_KEY,
      JSON.stringify(project)
    );

    return true;

  } catch (error) {

    console.error(
      "Project save failed:",
      error
    );

    return false;

  }

}


// ========================================
// LOAD PROJECT
// ========================================

export function loadProject() {

  try {

    const saved =
      localStorage.getItem(PROJECT_KEY);

    if (!saved) {

      return defaultProject();

    }

    const project =
      JSON.parse(saved);

    // Safety defaults
    if (!project.name) {

      project.name =
        "Untitled 3D Project";

    }

    if (!project.story) {

      project.story = "";

    }

    if (!Array.isArray(project.scenes)) {

      project.scenes = [];

    }

    if (!Array.isArray(project.characters)) {

      project.characters = [];

    }

    if (!Array.isArray(project.captions)) {

      project.captions = [];

    }

    if (!project.resolution) {

      project.resolution =
        "1280x720";

    }

    if (!project.fps) {

      project.fps = 30;

    }

    return project;

  } catch (error) {

    console.error(
      "Project load failed:",
      error
    );

    return defaultProject();

  }

}


// ========================================
// CLEAR PROJECT
// ========================================

export function clearProject() {

  try {

    localStorage.removeItem(
      PROJECT_KEY
    );

    return true;

  } catch (error) {

    console.error(
      "Project clear failed:",
      error
    );

    return false;

  }

}


// ========================================
// EXPORT PROJECT JSON
// ========================================

export function exportProjectJSON(
  project
) {

  const json =
    JSON.stringify(
      project,
      null,
      2
    );

  const blob =
    new Blob(
      [json],
      {
        type:
          "application/json"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `${project.name || "3d-project"}.json`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  setTimeout(() => {

    URL.revokeObjectURL(url);

  }, 1000);

}


// ========================================
// IMPORT PROJECT JSON
// ========================================

export function importProjectJSON(
  file
) {

  return new Promise(
    (resolve, reject) => {

      if (!file) {

        reject(
          new Error(
            "No project file selected."
          )
        );

        return;

      }

      const reader =
        new FileReader();

      reader.onload = () => {

        try {

          const project =
            JSON.parse(
              reader.result
            );

          if (
            !project ||
            typeof project !== "object"
          ) {

            throw new Error(
              "Invalid project file."
            );

          }

          resolve(project);

        } catch (error) {

          reject(error);

        }

      };

      reader.onerror = () => {

        reject(
          new Error(
            "Unable to read project file."
          )
        );

      };

      reader.readAsText(file);

    }
  );

}
