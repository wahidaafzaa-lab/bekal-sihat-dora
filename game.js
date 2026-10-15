(() => {
  'use strict';

  /*
   * =========================================================
   * BEKAL SIHAT DORA
   * GAME CONTROLLER
   * =========================================================
   */

  const BACKEND_URL =
    'PASTE_LINK_APPS_SCRIPT_EXEC_DI_SINI';


  /*
   * =========================================================
   * DATA 5 MISI
   * =========================================================
   */

  const MISSIONS = [

    {
      checkpoint: 1,

      title:
        'Misi 1: Pilih Epal',

      sentence:
        'Dora membawa sebiji epal.',

      instruction:
        'Dengar ayat. Pilih gambar yang sepadan.',

      answer:
        'epal',

      choices: [
        {
          value: 'epal',
          label: '🍎 Epal'
        },
        {
          value: 'pisang',
          label: '🍌 Pisang'
        },
        {
          value: 'susu',
          label: '🥛 Susu'
        },
        {
          value: 'lobak',
          label: '🥕 Lobak'
        }
      ]
    },


    {
      checkpoint: 2,

      title:
        'Misi 2: Pilih Susu',

      sentence:
        'Bimo minum susu.',

      instruction:
        'Dengar ayat. Pilih gambar yang sepadan.',

      answer:
        'susu',

      choices: [
        {
          value: 'air',
          label: '💧 Air kosong'
        },
        {
          value: 'susu',
          label: '🥛 Susu'
        },
        {
          value: 'epal',
          label: '🍎 Epal'
        },
        {
          value: 'roti',
          label: '🍞 Roti'
        }
      ]
    },


    {
      checkpoint: 3,

      title:
        'Misi 3: Isi Beg Bekal',

      sentence:
        'Masukkan roti dan susu ke dalam beg.',

      instruction:
        'Dengar ayat. Pilih pilihan yang betul.',

      answer:
        'roti-susu',

      choices: [
        {
          value: 'roti-susu',
          label: '🍞 Roti + 🥛 Susu'
        },
        {
          value: 'gula-gula',
          label: '🍬 Gula-gula'
        },
        {
          value: 'kentang-air',
          label: '🍟 Kentang + 🥤 Minuman'
        },
        {
          value: 'kek',
          label: '🍰 Kek'
        }
      ]
    },


    {
      checkpoint: 4,

      title:
        'Misi 4: Buah Tembikai',

      sentence:
        'Saya makan buah tembikai.',

      instruction:
        'Dengar ayat. Pilih gambar yang sepadan.',

      answer:
        'tembikai',

      choices: [
        {
          value: 'pisang',
          label: '🍌 Pisang'
        },
        {
          value: 'tembikai',
          label: '🍉 Tembikai'
        },
        {
          value: 'lobak',
          label: '🥕 Lobak'
        },
        {
          value: 'roti',
          label: '🍞 Roti'
        }
      ]
    },


    {
      checkpoint: 5,

      title:
        'Misi 5: Air Kosong',

      sentence:
        'Amir minum air kosong.',

      instruction:
        'Dengar ayat. Pilih gambar yang sepadan.',

      answer:
        'air',

      choices: [
        {
          value: 'susu',
          label: '🥛 Susu'
        },
        {
          value: 'air',
          label: '💧 Air kosong'
        },
        {
          value: 'jus',
          label: '🧃 Jus'
        },
        {
          value: 'minuman-manis',
          label: '🥤 Minuman manis'
        }
      ]
    }

  ];


  /*
   * =========================================================
   * GAME STATE
   * =========================================================
   */

  const GAME = {

    studentName: '',
    studentClass: '',

    currentMission: 0,

    imageCorrect: 0,
    speechCorrect: 0,

    wrongCards: [
      0,
      0,
      0,
      0,
      0
    ],

    audioSpeed: 1,

    inclusiveMode: false,

    startedAt: null,
    finishedAt: null,

    sessionId: '',

    answerCompleted: false,
    speechCompleted: false
  };


  /*
   * =========================================================
   * DOM
   * =========================================================
   */

  const startScreen =
    document.getElementById(
      'startScreen'
    );

  const gameScreen =
    document.getElementById(
      'gameScreen'
    );

  const savingScreen =
    document.getElementById(
      'savingScreen'
    );

  const resultScreen =
    document.getElementById(
      'resultScreen'
    );


  const studentNameInput =
    document.getElementById(
      'studentName'
    );

  const studentClassInput =
    document.getElementById(
      'studentClass'
    );

  const inclusiveModeInput =
    document.getElementById(
      'inclusiveMode'
    );


  const startGameBtn =
    document.getElementById(
      'startGameBtn'
    );


  const hudName =
    document.getElementById(
      'hudName'
    );

  const hudCheckpoint =
    document.getElementById(
      'hudCheckpoint'
    );

  const hudScore =
    document.getElementById(
      'hudScore'
    );


  const worldContainer =
    document.getElementById(
      'worldContainer'
    );


  const challengePanel =
    document.getElementById(
      'challengePanel'
    );

  const challengeTitle =
    document.getElementById(
      'challengeTitle'
    );

  const challengeInstruction =
    document.getElementById(
      'challengeInstruction'
    );

  const challengeContent =
    document.getElementById(
      'challengeContent'
    );

  const challengeFeedback =
    document.getElementById(
      'challengeFeedback'
    );


  const playSentenceBtn =
    document.getElementById(
      'playSentenceBtn'
    );


  const recordingPanel =
    document.getElementById(
      'recordingPanel'
    );

  const recordStatus =
    document.getElementById(
      'recordStatus'
    );

  const startRecordBtn =
    document.getElementById(
      'startRecordBtn'
    );

  const stopRecordBtn =
    document.getElementById(
      'stopRecordBtn'
    );

  const playRecordingBtn =
    document.getElementById(
      'playRecordingBtn'
    );

  const redoRecordingBtn =
    document.getElementById(
      'redoRecordingBtn'
    );

  const recordedAudio =
    document.getElementById(
      'recordedAudio'
    );

  const confirmSpeechBtn =
    document.getElementById(
      'confirmSpeechBtn'
    );


  const continueBtn =
    document.getElementById(
      'challengeContinueBtn'
    );


  const resultName =
    document.getElementById(
      'resultName'
    );

  const resultSummary =
    document.getElementById(
      'resultSummary'
    );

  const playAgainBtn =
    document.getElementById(
      'playAgainBtn'
    );


  const toast =
    document.getElementById(
      'toast'
    );


  /*
   * =========================================================
   * SCREEN
   * =========================================================
   */

  function showScreen(
    screen
  ) {

    [
      startScreen,
      gameScreen,
      savingScreen,
      resultScreen
    ].forEach(
      element => {

        element.classList.remove(
          'active'
        );

      }
    );


    screen.classList.add(
      'active'
    );
  }


  /*
   * =========================================================
   * AUDIO SPEED
   * =========================================================
   */

  document
    .querySelectorAll(
      '.speed-btn'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          () => {

            document
              .querySelectorAll(
                '.speed-btn'
              )
              .forEach(
                item => {

                  item.classList.remove(
                    'active'
                  );

                }
              );


            button.classList.add(
              'active'
            );


            GAME.audioSpeed =
              Number(
                button.dataset.speed
              );


            BekalAudio.setSpeechRate(
              GAME.audioSpeed
            );

          }
        );

      }
    );


  /*
   * =========================================================
   * START GAME
   * =========================================================
   */

  startGameBtn.addEventListener(
    'click',
    startGame
  );


  function startGame() {

    const name =
      studentNameInput.value.trim();

    const className =
      studentClassInput.value.trim();


    if (!name) {

      showToast(
        'Masukkan nama murid dahulu.'
      );

      studentNameInput.focus();

      return;
    }


    if (!className) {

      showToast(
        'Masukkan kelas murid dahulu.'
      );

      studentClassInput.focus();

      return;
    }


    GAME.studentName =
      name;

    GAME.studentClass =
      className;

    GAME.currentMission = 0;

    GAME.imageCorrect = 0;
    GAME.speechCorrect = 0;

    GAME.wrongCards = [
      0,
      0,
      0,
      0,
      0
    ];

    GAME.inclusiveMode =
      inclusiveModeInput.checked;

    GAME.startedAt =
      new Date();

    GAME.finishedAt =
      null;

    GAME.sessionId =
      createSessionId();

    GAME.answerCompleted =
      false;

    GAME.speechCompleted =
      false;


    BekalAudio.setSpeechRate(
      GAME.audioSpeed
    );


    hudName.textContent =
      GAME.studentName;


    updateHud();


    showScreen(
      gameScreen
    );


    try {

      BekalWorld.init(
        worldContainer
      );

      BekalWorld.start();

    } catch (error) {

      console.error(
        error
      );

      showToast(
        'Dunia 3D tidak dapat dimuatkan, tetapi aktiviti masih boleh diteruskan.'
      );

    }


    setTimeout(
      () => {

        showMission(
          0
        );

      },
      800
    );

  }


  /*
   * =========================================================
   * SHOW MISSION
   * =========================================================
   */

  function showMission(
    index
  ) {

    GAME.currentMission =
      index;

    GAME.answerCompleted =
      false;

    GAME.speechCompleted =
      false;


    BekalAudio.resetRecording();


    const mission =
      MISSIONS[index];


    updateHud();


    challengePanel.classList.remove(
      'hidden'
    );


    challengeTitle.textContent =
      mission.title;


    challengeInstruction.textContent =
      mission.instruction;


    challengeContent.innerHTML =
      '';


    challengeFeedback.textContent =
      '';

    challengeFeedback.className =
      'feedback';


    recordingPanel.classList.add(
      'hidden'
    );


    continueBtn.classList.add(
      'hidden'
    );


    resetRecordingUI();


    createChoiceCards(
      mission
    );


    /*
     * Mainkan ayat secara automatik.
     */
    setTimeout(
      () => {

        playCurrentSentence();

      },
      500
    );

  }


  /*
   * =========================================================
   * CHOICE CARDS
   * =========================================================
   */

  function createChoiceCards(
    mission
  ) {

    const grid =
      document.createElement(
        'div'
      );


    grid.className =
      'choice-grid';


    mission.choices.forEach(
      choice => {

        const button =
          document.createElement(
            'button'
          );


        button.type =
          'button';


        button.className =
          'choice-card';


        button.textContent =
          choice.label;


        button.addEventListener(
          'click',
          () => {

            checkAnswer(
              button,
              choice.value,
              mission
            );

          }
        );


        grid.appendChild(
          button
        );

      }
    );


    challengeContent.appendChild(
      grid
    );
  }


  /*
   * =========================================================
   * CHECK ANSWER
   * =========================================================
   */

  function checkAnswer(
    button,
    value,
    mission
  ) {

    if (
      GAME.answerCompleted
    ) {
      return;
    }


    if (
      value ===
      mission.answer
    ) {

      GAME.answerCompleted =
        true;


      GAME.imageCorrect++;


      button.classList.add(
        'correct'
      );


      challengeFeedback.textContent =
        '🌟 Betul! Sekarang sebut semula ayat yang kamu dengar.';


      challengeFeedback.className =
        'feedback success';


      /*
       * Matikan semua pilihan.
       */
      challengeContent
        .querySelectorAll(
          '.choice-card'
        )
        .forEach(
          item => {

            item.disabled =
              true;

          }
        );


      updateHud();


      setTimeout(
        () => {

          beginSpeakingTask(
            mission
          );

        },
        700
      );


    } else {

      GAME.wrongCards[
        GAME.currentMission
      ]++;


      button.classList.add(
        'wrong'
      );


      button.disabled =
        true;


      challengeFeedback.textContent =
        'Cuba lagi. Dengar ayat dengan teliti.';


      challengeFeedback.className =
        'feedback error';


      /*
       * Main semula audio sebagai bantuan.
       */
      setTimeout(
        playCurrentSentence,
        500
      );

    }

  }


  /*
   * =========================================================
   * PLAY SENTENCE
   * =========================================================
   */

  playSentenceBtn.addEventListener(
    'click',
    playCurrentSentence
  );


  function playCurrentSentence() {

    const mission =
      MISSIONS[
        GAME.currentMission
      ];


    if (!mission) {
      return;
    }


    BekalAudio
      .speakSentence(
        mission.sentence
      )
      .catch(
        error => {

          console.error(
            error
          );

          showToast(
            'Audio tidak dapat dimainkan.'
          );

        }
      );

  }


  /*
   * =========================================================
   * SPEAKING TASK
   * =========================================================
   */

  function beginSpeakingTask(
    mission
  ) {

    recordingPanel.classList.remove(
      'hidden'
    );


    const sentence =
      document.createElement(
        'div'
      );


    sentence.style.padding =
      '16px';

    sentence.style.marginTop =
      '18px';

    sentence.style.borderRadius =
      '16px';

    sentence.style.background =
      '#fff8e1';

    sentence.style.fontSize =
      '1.25rem';

    sentence.style.fontWeight =
      '700';

    sentence.style.textAlign =
      'center';


    sentence.textContent =
      `🗣️ "${mission.sentence}"`;


    challengeContent.appendChild(
      sentence
    );


    challengeInstruction.textContent =
      'Sekarang rakam suara kamu menyebut ayat tersebut.';


    recordStatus.textContent =
      'Tekan “Mula Rakam” apabila sudah bersedia.';


    setTimeout(
      () => {

        recordingPanel.scrollIntoView({
          behavior:
            'smooth',

          block:
            'nearest'
        });

      },
      200
    );

  }


  /*
   * =========================================================
   * START RECORD
   * =========================================================
   */

  startRecordBtn.addEventListener(
    'click',
    async () => {

      try {

        BekalAudio.stopSpeech();


        await BekalAudio.startRecording();


        recordStatus.textContent =
          '🔴 Sedang merakam... Sebut ayat dengan jelas.';


        startRecordBtn.disabled =
          true;

        stopRecordBtn.disabled =
          false;

        playRecordingBtn.disabled =
          true;

        redoRecordingBtn.disabled =
          true;

        confirmSpeechBtn.classList.add(
          'hidden'
        );


      } catch (error) {

        console.error(
          error
        );


        recordStatus.textContent =
          BekalAudio
            .getMicrophoneErrorMessage(
              error
            );


        showToast(
          BekalAudio
            .getMicrophoneErrorMessage(
              error
            )
        );

      }

    }
  );


  /*
   * =========================================================
   * STOP RECORD
   * =========================================================
   */

  stopRecordBtn.addEventListener(
    'click',
    async () => {

      try {

        recordStatus.textContent =
          'Memproses rakaman...';


        const result =
          await BekalAudio
            .stopRecording();


        recordedAudio.src =
          result.url;


        recordedAudio.classList.remove(
          'hidden'
        );


        recordStatus.textContent =
          '✅ Rakaman selesai. Dengar semula sebelum mengesahkan.';


        startRecordBtn.disabled =
          true;

        stopRecordBtn.disabled =
          true;

        playRecordingBtn.disabled =
          false;

        redoRecordingBtn.disabled =
          false;


        confirmSpeechBtn.classList.remove(
          'hidden'
        );


      } catch (error) {

        console.error(
          error
        );


        recordStatus.textContent =
          'Rakaman tidak dapat dihentikan.';


        showToast(
          'Rakaman tidak dapat dihentikan.'
        );

      }

    }
  );


  /*
   * =========================================================
   * PLAY RECORDING
   * =========================================================
   */

  playRecordingBtn.addEventListener(
    'click',
    async () => {

      try {

        recordStatus.textContent =
          '▶ Sedang memainkan rakaman...';


        await BekalAudio
          .playRecording(
            recordedAudio
          );


        recordStatus.textContent =
          'Selesai dimainkan. Kamu boleh sahkan atau rakam semula.';


      } catch (error) {

        console.error(
          error
        );


        showToast(
          'Rakaman tidak dapat dimainkan.'
        );

      }

    }
  );


  /*
   * =========================================================
   * REDO RECORDING
   * =========================================================
   */

  redoRecordingBtn.addEventListener(
    'click',
    () => {

      BekalAudio.resetRecording();


      resetRecordingUI();


      recordStatus.textContent =
        'Rakaman dipadam. Tekan “Mula Rakam” untuk mencuba lagi.';

    }
  );


  /*
   * =========================================================
   * CONFIRM SPEECH
   * =========================================================
   */

  confirmSpeechBtn.addEventListener(
    'click',
    () => {

      if (
        !BekalAudio.hasRecording()
      ) {

        showToast(
          'Rakam suara dahulu.'
        );

        return;
      }


      if (
        GAME.speechCompleted
      ) {
        return;
      }


      GAME.speechCompleted =
        true;


      /*
       * Untuk versi ini, rakaman yang berjaya
       * disahkan dikira sebagai percubaan sebutan berjaya.
       *
       * Rakaman boleh didengar dahulu oleh murid
       * sebelum disahkan.
       */
      GAME.speechCorrect++;


      confirmSpeechBtn.disabled =
        true;


      challengeFeedback.textContent =
        '🎉 Bagus! Rakaman sebutan kamu telah disahkan.';


      challengeFeedback.className =
        'feedback success';


      continueBtn.classList.remove(
        'hidden'
      );


      if (
        GAME.currentMission ===
        MISSIONS.length - 1
      ) {

        continueBtn.textContent =
          'Lihat Keputusan ⭐';

      } else {

        continueBtn.textContent =
          'Seterusnya ➜';

      }


      updateHud();

    }
  );


  /*
   * =========================================================
   * NEXT
   * =========================================================
   */

  continueBtn.addEventListener(
    'click',
    () => {

      if (
        !GAME.answerCompleted ||
        !GAME.speechCompleted
      ) {

        showToast(
          'Selesaikan aktiviti dahulu.'
        );

        return;
      }


      BekalAudio.resetRecording();


      const next =
        GAME.currentMission + 1;


      if (
        next <
        MISSIONS.length
      ) {

        showMission(
          next
        );

      } else {

        finishGame();

      }

    }
  );


  /*
   * =========================================================
   * RESET RECORD UI
   * =========================================================
   */

  function resetRecordingUI() {

    startRecordBtn.disabled =
      false;

    stopRecordBtn.disabled =
      true;

    playRecordingBtn.disabled =
      true;

    redoRecordingBtn.disabled =
      true;


    confirmSpeechBtn.disabled =
      false;


    confirmSpeechBtn.classList.add(
      'hidden'
    );


    recordedAudio.pause();

    recordedAudio.removeAttribute(
      'src'
    );

    recordedAudio.load();


    recordedAudio.classList.add(
      'hidden'
    );


    recordStatus.textContent =
      'Tekan “Mula Rakam” apabila sudah bersedia.';

  }


  /*
   * =========================================================
   * HUD
   * =========================================================
   */

  function updateHud() {

    hudCheckpoint.textContent =
      Math.min(
        GAME.currentMission + 1,
        5
      );


    hudScore.textContent =
      GAME.imageCorrect +
      GAME.speechCorrect;

  }


  /*
   * =========================================================
   * FINISH
   * =========================================================
   */

  async function finishGame() {

    GAME.finishedAt =
      new Date();


    BekalAudio.cleanupRecording();


    showScreen(
      savingScreen
    );


    const durationSeconds =
      Math.round(
        (
          GAME.finishedAt.getTime() -
          GAME.startedAt.getTime()
        ) / 1000
      );


    const payload = {

      name:
        GAME.studentName,

      className:
        GAME.studentClass,

      startedAt:
        GAME.startedAt.toISOString(),

      finishedAt:
        GAME.finishedAt.toISOString(),

      durationSeconds:
        durationSeconds,

      sentences:
        MISSIONS.map(
          mission =>
            mission.sentence
        ),

      imageCorrect:
        GAME.imageCorrect,

      speechCorrect:
        GAME.speechCorrect,

      wrongCards:
        GAME.wrongCards,

      lastCheckpoint:
        5,

      audioSpeed:
        GAME.audioSpeed,

      inclusiveMode:
        GAME.inclusiveMode,

      device:
        navigator.userAgent,

      sessionId:
        GAME.sessionId
    };


    try {

      const result =
        await saveToBackend(
          payload
        );


      if (
        !result ||
        result.success !== true
      ) {

        throw new Error(
          result &&
          result.message
            ? result.message
            : 'Rekod tidak dapat disimpan.'
        );
      }


      showResults(
        result
      );


    } catch (error) {

      console.error(
        error
      );


      /*
       * Jika backend belum dimasukkan,
       * jangan hilangkan keputusan murid.
       */
      showScreen(
        resultScreen
      );


      resultName.textContent =
        GAME.studentName;


      resultSummary.innerHTML =
        `
          <h3>Permainan selesai</h3>

          <p>
            Pilih gambar:
            <strong>
              ${GAME.imageCorrect}/5
            </strong>
          </p>

          <p>
            Rakaman sebutan:
            <strong>
              ${GAME.speechCorrect}/5
            </strong>
          </p>

          <p style="color:#c62828;">
            Rekod Google Sheets belum dapat disimpan.
          </p>
        `;


      showToast(
        'Permainan selesai tetapi sambungan Google Sheets belum berjaya.'
      );

    }

  }


  /*
   * =========================================================
   * SAVE USING JSONP
   * =========================================================
   */

  function saveToBackend(
    payload
  ) {

    return new Promise(
      (resolve, reject) => {

        if (
          !BACKEND_URL ||
          BACKEND_URL.includes(
            'PASTE_LINK'
          )
        ) {

          reject(
            new Error(
              'BACKEND_URL belum dimasukkan.'
            )
          );

          return;
        }


        const callbackName =
          '__bekalCallback_' +
          Date.now() +
          '_' +
          Math.floor(
            Math.random() *
            100000
          );


        const script =
          document.createElement(
            'script'
          );


        let finished =
          false;


        const cleanup =
          () => {

            if (
              script.parentNode
            ) {

              script.parentNode.removeChild(
                script
              );

            }


            try {

              delete window[
                callbackName
              ];

            } catch (error) {

              window[
                callbackName
              ] =
                undefined;

            }

          };


        const timeout =
          setTimeout(
            () => {

              if (
                finished
              ) {
                return;
              }


              finished =
                true;


              cleanup();


              reject(
                new Error(
                  'Masa sambungan ke Google Sheets tamat.'
                )
              );

            },
            20000
          );


        window[
          callbackName
        ] =
          response => {

            if (
              finished
            ) {
              return;
            }


            finished =
              true;


            clearTimeout(
              timeout
            );


            cleanup();


            resolve(
              response
            );

          };


        const url =
          BACKEND_URL +
          '?action=save' +
          '&callback=' +
          encodeURIComponent(
            callbackName
          ) +
          '&payload=' +
          encodeURIComponent(
            JSON.stringify(
              payload
            )
          );


        script.src =
          url;


        script.onerror =
          () => {

            if (
              finished
            ) {
              return;
            }


            finished =
              true;


            clearTimeout(
              timeout
            );


            cleanup();


            reject(
              new Error(
                'Sambungan ke Apps Script gagal.'
              )
            );

          };


        document.body.appendChild(
          script
        );

      }
    );

  }


  /*
   * =========================================================
   * RESULT
   * =========================================================
   */

  function showResults(
    result
  ) {

    showScreen(
      resultScreen
    );


    resultName.textContent =
      `Syabas, ${GAME.studentName}!`;


    const imagePassed =
      GAME.imageCorrect >= 4;


    const speechPassed =
      GAME.speechCorrect >= 4;


    const overallPassed =
      imagePassed &&
      speechPassed;


    resultSummary.innerHTML =
      `
        <h3>
          ${
            overallPassed
              ? '🏆 Objektif Tercapai!'
              : '🌱 Teruskan Usaha!'
          }
        </h3>

        <p>
          🖼️ Pilih gambar:
          <strong>
            ${GAME.imageCorrect}/5
          </strong>
        </p>

        <p>
          🎤 Sebutan:
          <strong>
            ${GAME.speechCorrect}/5
          </strong>
        </p>

        <p>
          ⭐ Jumlah skor:
          <strong>
            ${
              GAME.imageCorrect +
              GAME.speechCorrect
            }/10
          </strong>
        </p>

        <p>
          ${
            overallPassed
              ? 'Tahniah! Kamu berjaya mencapai kedua-dua objektif pembelajaran.'
              : 'Cuba lagi untuk mendapatkan sekurang-kurangnya 4 daripada 5 bagi kedua-dua kemahiran.'
          }
        </p>

        <p>
          ✅ Rekod telah disimpan ke Google Sheets.
        </p>
      `;

  }


  /*
   * =========================================================
   * PLAY AGAIN
   * =========================================================
   */

  playAgainBtn.addEventListener(
    'click',
    () => {

      BekalAudio.cleanupRecording();


      try {

        BekalWorld.destroy();

      } catch (error) {

        console.error(
          error
        );

      }


      studentNameInput.value =
        '';

      studentClassInput.value =
        '';


      GAME.currentMission = 0;

      GAME.imageCorrect = 0;

      GAME.speechCorrect = 0;


      showScreen(
        startScreen
      );

  });


  /*
   * =========================================================
   * SESSION ID
   * =========================================================
   */

  function createSessionId() {

    if (
      window.crypto &&
      typeof window.crypto.randomUUID ===
        'function'
    ) {

      return window.crypto.randomUUID();

    }


    return (
      'SESSION-' +
      Date.now() +
      '-' +
      Math.random()
        .toString(36)
        .slice(2)
    );

  }


  /*
   * =========================================================
   * TOAST
   * =========================================================
   */

  let toastTimer =
    null;


  function showToast(
    message
  ) {

    toast.textContent =
      message;


    toast.classList.remove(
      'hidden'
    );


    if (
      toastTimer
    ) {

      clearTimeout(
        toastTimer
      );

    }


    toastTimer =
      setTimeout(
        () => {

          toast.classList.add(
            'hidden'
          );

        },
        3500
      );

  }


  /*
   * =========================================================
   * INITIAL
   * =========================================================
   */

  showScreen(
    startScreen
  );


})();
