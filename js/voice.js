// ========================================
// 3D ANIMATED STUDIO
// BROWSER VOICE / NARRATION
// NO API KEY
// ========================================


// ========================================
// POPULATE AVAILABLE VOICES
// ========================================

export function populateVoices(select) {

  if (
    !("speechSynthesis" in window)
  ) {

    select.innerHTML =
      `<option>
        Speech synthesis unavailable
      </option>`;

    return;

  }


  function fillVoices() {

    const voices =
      window.speechSynthesis
        .getVoices();


    select.innerHTML = "";


    voices.forEach(
      (voice, index) => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          index;


        option.textContent =
          `${voice.name} — ${voice.lang}`;


        select.appendChild(
          option
        );

      }
    );


    if (!voices.length) {

      const option =
        document.createElement(
          "option"
        );

      option.textContent =
        "Loading browser voices...";

      select.appendChild(
        option
      );

    }

  }


  fillVoices();


  window.speechSynthesis
    .addEventListener(
      "voiceschanged",
      fillVoices
    );

}


// ========================================
// SPEAK TEXT
// ========================================

export function speak(
  text,
  select,
  rate = 1
) {

  if (
    !("speechSynthesis" in window)
  ) {

    return;

  }


  const cleanText =
    String(text || "").trim();


  if (!cleanText) {

    return;

  }


  window.speechSynthesis.cancel();


  const voices =
    window.speechSynthesis
      .getVoices();


  const voiceIndex =
    Number(select?.value) || 0;


  const utterance =
    new SpeechSynthesisUtterance(
      cleanText
    );


  utterance.voice =
    voices[voiceIndex] ||
    voices[0] ||
    null;


  utterance.rate =
    Number(rate) || 1;


  utterance.pitch = 1;


  utterance.volume = 1;


  window.speechSynthesis.speak(
    utterance
  );

}


// ========================================
// STOP VOICE
// ========================================

export function stopSpeak() {

  if (
    "speechSynthesis" in window
  ) {

    window.speechSynthesis.cancel();

  }

}


// ========================================
// PAUSE VOICE
// ========================================

export function pauseSpeak() {

  if (
    "speechSynthesis" in window
  ) {

    window.speechSynthesis.pause();

  }

}


// ========================================
// RESUME VOICE
// ========================================

export function resumeSpeak() {

  if (
    "speechSynthesis" in window
  ) {

    window.speechSynthesis.resume();

  }

}
