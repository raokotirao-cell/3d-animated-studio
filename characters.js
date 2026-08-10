// ========================================
// 3D ANIMATED STUDIO
// CHARACTERS
// LOCAL ONLY
// ========================================

export function initCharacters({
  project,
  $,
  save,
  refresh
}) {

  const addButton = $("addCharBtn");

  if (!addButton) {
    console.warn("addCharBtn not found.");
    return;
  }


  addButton.onclick = () => {

    const name =
      $("charName")?.value.trim();

    const type =
      $("charType")?.value || "human";


    if (!name) {

      alert(
        "Enter a character name."
      );

      $("charName")?.focus();

      return;

    }


    // Prevent duplicates

    const exists =
      project.characters.some(
        character =>
          character.name.toLowerCase() ===
          name.toLowerCase()
      );


    if (exists) {

      alert(
        "This character already exists."
      );

      return;

    }


    // Add character

    project.characters.push({

      name: name,

      type: type

    });


    // Clear input

    $("charName").value = "";


    // Save

    save();


    // Refresh

    refresh();

  };

}
