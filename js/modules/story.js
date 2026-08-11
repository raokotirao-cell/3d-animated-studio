// ========================================
// 3D ANIMATED STUDIO
// STORY → SCENES
// LOCAL PROCESSING
// ========================================

export function initStory({
  project,
  $,
  save,
  refresh,
  show
}) {

  const storyText = $("storyText");
  const createButton = $("storyToScenesBtn");

  if (!storyText || !createButton) {
    console.warn("Story controls not found.");
    return;
  }


  // ========================================
  // STORY TEXT
  // ========================================

  storyText.value = project.story || "";

  storyText.oninput = () => {

    project.story =
      storyText.value;

    save();

  };


  // ========================================
  // STORY → SCENES
  // ========================================

  createButton.onclick = () => {

    const story =
      storyText.value.trim();


    if (!story) {

      alert(
        "First write your story."
      );

      storyText.focus();

      return;

    }


    project.story =
      story;


    // Split story into paragraphs
    // or sentences.

    let parts =
      story
        .split(/\n\s*\n/)
        .map(text => text.trim())
        .filter(Boolean);


    // If only one paragraph,
    // split it into sentences.

    if (parts.length === 1) {

      parts =
        story
          .match(
            /[^.!?]+[.!?]+|[^.!?]+$/g
          )
          ?.map(text => text.trim())
          .filter(Boolean)
          || [story];

    }


    // ====================================
    // CREATE SCENES
    // ====================================

    project.scenes =
      parts.map(
        (text, index) => {

          const words =
            text
              .split(/\s+/)
              .filter(Boolean)
              .length;


          const duration =
            Math.max(
              3,
              Math.min(
                30,
                Math.ceil(
                  words / 2
                )
              )
            );


          return {

            title:
              `Scene ${index + 1}`,

            duration:
              duration,

            description:
              text,

            background:
              detectBackground(text),

            camera:
              detectCamera(text),

            animation:
              detectAnimation(text),

            characters:
  detectCharacters(
    text,
    project.characters
  )

          };

        }
      );


    // ====================================
    // SAVE
    // ====================================

    save();


    // ====================================
    // REFRESH
    // ====================================

    refresh();


    // ====================================
    // OPEN SCENES
    // ====================================

    if (typeof show === "function") {

      show("scenes");

    }

  };

}


// ========================================
// BACKGROUND DETECTOR
// ========================================

function detectBackground(text) {

  const value =
    text.toLowerCase();


  if (
    value.includes("night") ||
    value.includes("moon") ||
    value.includes("dark")
  ) {

    return "night";

  }


  if (
    value.includes("forest") ||
    value.includes("jungle") ||
    value.includes("tree")
  ) {

    return "forest";

  }


  if (
    value.includes("city") ||
    value.includes("street") ||
    value.includes("building")
  ) {

    return "city";

  }


  if (
    value.includes("space") ||
    value.includes("galaxy") ||
    value.includes("planet")
  ) {

    return "space";

  }


  if (
    value.includes("desert") ||
    value.includes("sand")
  ) {

    return "desert";

  }


  return "day";

}


// ========================================
// CAMERA DETECTOR
// ========================================

function detectCamera(text) {

  const value =
    text.toLowerCase();


  if (
    value.includes("zoom") ||
    value.includes("close up")
  ) {

    return "Zoom";

  }


  if (
    value.includes("orbit") ||
    value.includes("around")
  ) {

    return "Orbit";

  }


  if (
    value.includes("pan") ||
    value.includes("moves across")
  ) {

    return "Pan";

  }


  return "Static";

}


// ========================================
// ANIMATION DETECTOR
// ========================================

function detectAnimation(text) {

  const value =
    text.toLowerCase();


  if (
    value.includes("walk") ||
    value.includes("walking")
  ) {

    return "Walk";

  }


  if (
    value.includes("jump") ||
    value.includes("jumping")
  ) {

    return "Jump";

  }


  if (
    value.includes("wave") ||
    value.includes("waving")
  ) {

    return "Wave";

  }


  if (
    value.includes("dance") ||
    value.includes("dancing")
  ) {

    return "Dance";

  }


  if (
    value.includes("float") ||
    value.includes("floating")
  ) {

    return "Float";

  }


  return "None";

}
// ========================================
// CHARACTER DETECTOR
// ========================================

function detectCharacters(
  text,
  characters
) {

  if (
    !Array.isArray(characters) ||
    !characters.length
  ) {
    return [];
  }

  const value =
    text.toLowerCase();

  return characters
    .filter(character => {

      if (
        !character ||
        !character.name
      ) {
        return false;
      }

      return value.includes(
        character.name.toLowerCase()
      );

    })
    .map(
      character =>
        character.name
    );
}
