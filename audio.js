(() => {
  'use strict';

  let speechRate = 1;

  let mediaRecorder = null;
  let mediaStream = null;
  let audioChunks = [];
  let recordingUrl = null;

  const state = {
    isRecording: false,
    hasRecording: false
  };

  function setSpeechRate(rate) {
    const allowed = [1, 0.7, 0.5];

    const parsed = Number(rate);

    speechRate = allowed.includes(parsed)
      ? parsed
      : 1;
  }

  function getSpeechRate() {
    return speechRate;
  }

  function getMalayVoice() {
    const voices =
      window.speechSynthesis
        ? window.speechSynthesis.getVoices()
        : [];

    if (!voices.length) {
      return null;
    }

    return (
      voices.find(voice =>
        /^ms(-|_)/i.test(voice.lang)
      ) ||
      voices.find(voice =>
        /^id(-|_)/i.test(voice.lang)
      ) ||
      voices[0]
    );
  }

  function speakSentence(sentence) {
    return new Promise((resolve, reject) => {
      if (
        !window.speechSynthesis ||
        !window.SpeechSynthesisUtterance
      ) {
        reject(
          new Error(
            'Fungsi audio tidak disokong oleh pelayar ini.'
          )
        );
        return;
      }

      const text =
        String(sentence || '').trim();

      if (!text) {
        reject(
          new Error(
            'Tiada ayat untuk dimainkan.'
          )
        );
        return;
      }

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(text);

      utterance.lang = 'ms-MY';
      utterance.rate = speechRate;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voice =
        getMalayVoice();

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = event => {
        reject(
          new Error(
            event.error ||
            'Audio gagal dimainkan.'
          )
        );
      };

      window.speechSynthesis.speak(
        utterance
      );
    });
  }

  function stopSpeech() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  async function checkMicrophoneSupport() {
    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      throw new Error(
        'Pelayar ini tidak menyokong akses mikrofon.'
      );
    }

    if (
      !window.MediaRecorder
    ) {
      throw new Error(
        'Pelayar ini tidak menyokong rakaman audio.'
      );
    }

    return true;
  }

  function chooseMimeType() {
    if (!window.MediaRecorder) {
      return '';
    }

    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4'
    ];

    for (const type of candidates) {
      if (
        MediaRecorder.isTypeSupported &&
        MediaRecorder.isTypeSupported(type)
      ) {
        return type;
      }
    }

    return '';
  }

  async function startRecording() {
    await checkMicrophoneSupport();

    if (state.isRecording) {
      return;
    }

    cleanupRecording();

    mediaStream =
      await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

    audioChunks = [];

    const mimeType =
      chooseMimeType();

    if (mimeType) {
      mediaRecorder =
        new MediaRecorder(
          mediaStream,
          { mimeType }
        );
    } else {
      mediaRecorder =
        new MediaRecorder(
          mediaStream
        );
    }

    mediaRecorder.ondataavailable =
      event => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          audioChunks.push(
            event.data
          );
        }
      };

    mediaRecorder.onerror =
      event => {
        console.error(
          'Rakaman audio gagal:',
          event
        );
      };

    mediaRecorder.start();

    state.isRecording = true;
    state.hasRecording = false;

    return true;
  }

  function stopRecording() {
    return new Promise((resolve, reject) => {
      if (
        !mediaRecorder ||
        !state.isRecording
      ) {
        reject(
          new Error(
            'Tiada rakaman sedang berlangsung.'
          )
        );
        return;
      }

      mediaRecorder.onstop = () => {
        try {
          const type =
            mediaRecorder.mimeType ||
            'audio/webm';

          const blob =
            new Blob(
              audioChunks,
              { type }
            );

          if (
            recordingUrl
          ) {
            URL.revokeObjectURL(
              recordingUrl
            );
          }

          recordingUrl =
            URL.createObjectURL(
              blob
            );

          state.isRecording = false;
          state.hasRecording = true;

          stopMediaStream();

          resolve({
            blob,
            url: recordingUrl,
            mimeType: type
          });
        } catch (error) {
          state.isRecording = false;

          stopMediaStream();

          reject(error);
        }
      };

      mediaRecorder.stop();
    });
  }

  function playRecording(audioElement) {
    return new Promise(
      (resolve, reject) => {
        if (
          !state.hasRecording ||
          !recordingUrl
        ) {
          reject(
            new Error(
              'Belum ada rakaman.'
            )
          );
          return;
        }

        let audio = audioElement;

        if (!audio) {
          audio =
            new Audio();
        }

        audio.src =
          recordingUrl;

        audio.currentTime = 0;

        audio.onended =
          () => resolve();

        audio.onerror =
          () => {
            reject(
              new Error(
                'Rakaman tidak dapat dimainkan.'
              )
            );
          };

        audio.play()
          .catch(reject);
      }
    );
  }

  function stopMediaStream() {
    if (mediaStream) {
      mediaStream
        .getTracks()
        .forEach(track => {
          track.stop();
        });

      mediaStream = null;
    }
  }

  function cleanupRecording() {
    if (
      mediaRecorder &&
      state.isRecording
    ) {
      try {
        mediaRecorder.stop();
      } catch (error) {
        // Abaikan.
      }
    }

    stopMediaStream();

    mediaRecorder = null;
    audioChunks = [];

    state.isRecording = false;
    state.hasRecording = false;

    if (recordingUrl) {
      URL.revokeObjectURL(
        recordingUrl
      );

      recordingUrl = null;
    }
  }

  function resetRecording() {
    cleanupRecording();
  }

  function getRecordingUrl() {
    return recordingUrl;
  }

  function hasRecording() {
    return state.hasRecording;
  }

  function isRecording() {
    return state.isRecording;
  }

  function getMicrophoneErrorMessage(error) {
    if (!error) {
      return 'Mikrofon tidak dapat digunakan.';
    }

    if (
      error.name === 'NotAllowedError' ||
      error.name === 'PermissionDeniedError'
    ) {
      return 'Kebenaran mikrofon tidak diberikan. Tekan ikon kunci pada browser dan benarkan Microphone.';
    }

    if (
      error.name === 'NotFoundError' ||
      error.name === 'DevicesNotFoundError'
    ) {
      return 'Tiada mikrofon dikesan pada peranti ini.';
    }

    if (
      error.name === 'NotReadableError' ||
      error.name === 'TrackStartError'
    ) {
      return 'Mikrofon sedang digunakan oleh aplikasi lain.';
    }

    if (
      error.name === 'SecurityError'
    ) {
      return 'Akses mikrofon disekat oleh keselamatan browser.';
    }

    return (
      error.message ||
      'Mikrofon tidak dapat digunakan.'
    );
  }

  window.BekalAudio = {
    setSpeechRate,
    getSpeechRate,
    speakSentence,
    stopSpeech,

    checkMicrophoneSupport,
    startRecording,
    stopRecording,
    playRecording,

    resetRecording,
    cleanupRecording,

    getRecordingUrl,
    hasRecording,
    isRecording,

    getMicrophoneErrorMessage
  };
})();
