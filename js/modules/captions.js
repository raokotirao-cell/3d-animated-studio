// ========================================
// 3D ANIMATED STUDIO
// CAPTIONS / SUBTITLES
// LOCAL ONLY
// ========================================

export function initCaptions({
  project,
  $,
  save,
  refresh
}) {

  const addButton =
    $("addCaptionBtn");

  if (!addButton) {
    console.warn("addCaptionBtn not found.");
    return;
  }


  addButton.onclick = () => {

    const text =
      $("captionText")?.value.trim();

    const start =
      Number(
        $("captionStart")?.value
      );

    const end =
      Number(
        $("captionEnd")?.value
      );


    // -------------------------------
    // Validate text
    // -------------------------------

    if (!text) {

      alert(
        "Enter caption text."
      );

      $("captionText")?.focus();

      return;

    }


    // -------------------------------
    // Validate time
    // -------------------------------

    const safeStart =
      Number.isFinite(start) &&
      start >= 0
        ? start
        : 0;


    let safeEnd =
      Number.isFinite(end) &&
      end > safeStart
        ? end
        : safeStart + 3;


    // -------------------------------
    // Add caption
    // -------------------------------

    project.captions.push({

      text: text,

      start: safeStart,

      end: safeEnd

    });


    // -------------------------------
    // Sort captions
    // -------------------------------

    project.captions.sort(
      (a, b) =>
        Number(a.start) -
        Number(b.start)
    );


    // -------------------------------
    // Clear text input
    // -------------------------------

    if ($("captionText")) {

      $("captionText").value = "";

    }


    // -------------------------------
    // Save
    // -------------------------------

    save();


    // -------------------------------
    // Refresh UI
    // -------------------------------

    refresh();

  };

}
