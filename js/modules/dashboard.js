// ========================================
// 3D ANIMATED STUDIO
// DASHBOARD / LOCAL SCENE BUILDER
// NO API KEY
// NO PAID PROCESSING
// ========================================


export function initDashboard({
  project,
  $,
  save,
  refresh,
  show
}) {

  const buildButton =
    $("buildSceneBtn");


  if (!buildButton) {

    console.warn(
      "buildSceneBtn not found."
    );

    return;

  }


  buildButton.onclick = () => {

    const prompt =
      $("aiPrompt")
        ?.value
        ?.trim();


    // -------------------------------
    // Empty prompt
    // -------------------------------

    if (!prompt) {

      $("aiStatus").textContent =
        "Enter a scene prompt first.";

      return;

    }


    const text =
      prompt.toLowerCase();


    // -------------------------------
    // Detect background
    // -------------------------------

    let background =
      "day";


    if (
      text.includes("night") ||
      text.includes("dark")
    ) {

      background = "night";

    }

    else if (
      text.includes("forest") ||
      text.includes("jungle")
    ) {

      background = "forest";

    }

    else if (
      text.includes("city") ||
      text.includes("street")
    ) {

      background = "city";

    }

    else if (
      text.includes("space") ||
      text.includes("galaxy")
    ) {

      background = "space";

    }

    else if (
      text.includes("desert")
    ) {

      background = "desert";

    }


    // -------------------------------
    // Detect character type
    // -------------------------------

    let type =
      "human";


    if (
      text.includes("robot") ||
      text.includes("android")
    ) {

      type = "robot";

    }

    else if (
      text.includes("bird") ||
      text.includes("eagle") ||
      text.includes("parrot")
    ) {

      type = "bird";

    }

    else if (
      text.includes("animal") ||
      text.includes("dog") ||
      text.includes("cat") ||
      text.includes("lion") ||
      text.includes("tiger")
    ) {

      type = "animal";

    }


    // -------------------------------
    // Detect animation
    // -------------------------------

    let animation =
      "None";


    if (
      text.includes("walk") ||
      text.includes("walking")
    ) {

      animation = "Walk";

    }

    else if (
      text.includes("jump") ||
      text.includes("jumping")
    ) {

      animation = "Jump";

    }

    else if (
      text.includes("wave") ||
      text.includes("waving")
    ) {

      animation = "Wave";

    }

    else if (
      text.includes("dance") ||
      text.includes("dancing")
    ) {

      animation = "Dance";

    }

    else if (
      text.includes("float") ||
      text.includes("floating")
    ) {

      animation = "Float";

    }


    // -------------------------------
    // Character name
    // -------------------------------

    let characterName;


    if (type === "robot") {

      characterName =
        "Robot";

    }

    else if (type === "bird") {

      characterName =
        "Bird";

    }

    else if (type === "animal") {

      characterName =
        "Animal";

    }

    else {

      characterName =
        "Hero";

    }


    // -------------------------------
    // Create character if needed
    // -------------------------------

    const exists =
      project.characters.some(
        character =>
          character.name ===
          characterName
      );


    if (!exists) {

      project.characters.push({

        name:
          characterName,

        type:
          type

      });

    }


    // -------------------------------
    // Create scene
    // -------------------------------

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


    // -------------------------------
    // Save
    // -------------------------------

    save();


    // -------------------------------
    // Refresh UI
    // -------------------------------

    refresh();


    // -------------------------------
    // Status
    // -------------------------------

    const status =
      $("aiStatus");


    if (status) {

      status.textContent =
        "✅ Scene created locally — no API and no upload.";

    }


    // -------------------------------
    // Open Scene Editor
    // -------------------------------

    if (typeof show === "function") {

      show("editor");

    }

  };

}
