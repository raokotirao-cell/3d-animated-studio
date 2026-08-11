// ========================================
// 3D ANIMATED STUDIO
// DASHBOARD / LOCAL SCENE BUILDER
// ========================================

export function initDashboard({
  project,
  $,
  save,
  refresh,
  show
}) {

  const buildButton = $("buildSceneBtn");
  const status = $("aiStatus");

  if (!buildButton) {
    console.warn("Dashboard: buildSceneBtn not found.");
    return;
  }


  // ========================================
  // BUILD SCENE
  // ========================================

  buildButton.addEventListener("click", () => {

    const prompt =
      $("aiPrompt")?.value?.trim() || "";


    // ========================================
    // VALIDATE PROMPT
    // ========================================

    if (!prompt) {

      if (status) {
        status.textContent =
          "Enter a scene prompt first.";
      }

      $("aiPrompt")?.focus();

      return;
    }


    const text =
      prompt.toLowerCase();


    // ========================================
    // DETECT BACKGROUND
    // ========================================

    let background = "day";


    if (
      text.includes("night") ||
      text.includes("dark")
    ) {

      background = "night";

    } else if (
      text.includes("forest") ||
      text.includes("jungle")
    ) {

      background = "forest";

    } else if (
      text.includes("city") ||
      text.includes("street") ||
      text.includes("road") ||
      text.includes("roadside")
    ) {

      background = "city";

    } else if (
      text.includes("space") ||
      text.includes("galaxy")
    ) {

      background = "space";

    } else if (
      text.includes("desert")
    ) {

      background = "desert";

    }


    // ========================================
    // DETECT CHARACTER
    // ========================================

    let type = "human";


    if (
      text.includes("robot") ||
      text.includes("android")
    ) {

      type = "robot";

    } else if (
      text.includes("bird") ||
      text.includes("eagle") ||
      text.includes("parrot")
    ) {

      type = "bird";

    } else if (
      text.includes("animal") ||
      text.includes("dog") ||
      text.includes("cat") ||
      text.includes("lion") ||
      text.includes("tiger")
    ) {

      type = "animal";

    }


    // ========================================
    // DETECT ANIMATION
    // ========================================

    let animation = "None";


    if (
      text.includes("walk") ||
      text.includes("walking")
    ) {

      animation = "Walk";

    } else if (
      text.includes("jump") ||
      text.includes("jumping")
    ) {

      animation = "Jump";

    } else if (
      text.includes("wave") ||
      text.includes("waving")
    ) {

      animation = "Wave";

    } else if (
      text.includes("dance") ||
      text.includes("dancing")
    ) {

      animation = "Dance";

    } else if (
      text.includes("float") ||
      text.includes("floating")
    ) {

      animation = "Float";

    }


    // ========================================
    // CHARACTER NAME
    // ========================================

    let characterName = "Hero";


    if (type === "robot") {

      characterName = "Robot";

    } else if (type === "bird") {

      characterName = "Bird";

    } else if (type === "animal") {

      characterName = "Animal";

    }


    // ========================================
    // SAFETY: PROJECT ARRAYS
    // ========================================

    if (!Array.isArray(project.characters)) {
      project.characters = [];
    }

    if (!Array.isArray(project.scenes)) {
      project.scenes = [];
    }


    // ========================================
    // CREATE CHARACTER
    // ========================================

    const existingCharacter =
      project.characters.find(
        character =>
          character.name === characterName
      );


    if (!existingCharacter) {

      project.characters.push({

        name: characterName,

        type: type

      });

    }


    // ========================================
    // CREATE SCENE
    // ========================================

    const sceneNumber =
      project.scenes.length + 1;


    const newScene = {

      title:
        `AI Scene ${sceneNumber}`,

      duration:
        10,

      description:
        prompt,

      background:
        background,

      camera:
        "Static",

      animation:
        animation,

      characters:
        [characterName]

    };


    project.scenes.push(
      newScene
    );


    // ========================================
    // SAVE
    // ========================================

    save();


    // ========================================
    // REFRESH
    // ========================================

    refresh();


    // ========================================
    // STATUS
    // ========================================

    if (status) {

      status.textContent =
        "✅ Scene created locally — no API and no upload.";

    }


    // ========================================
    // CLEAR PROMPT
    // ========================================

    const promptInput =
      $("aiPrompt");

    if (promptInput) {

      promptInput.value = "";

    }


    // ========================================
    // OPEN SCENE EDITOR
    // ========================================

    if (typeof show === "function") {

      show("editor");

    }

  });


  console.log(
    "✅ Dashboard module initialized."
  );

}
