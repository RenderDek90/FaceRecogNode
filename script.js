// console.log(faceapi.nets);

const modelPath = 'models';
const video = document.getElementById('video');

$(document).ready(function () {
  Promise.all([faceapi.nets.faceRecognitionNet.loadFromUri('/models'), faceapi.nets.faceLandmark68Net.loadFromUri('/models'), faceapi.nets.ssdMobilenetv1.loadFromUri('/models')]).then(startVideo);

  console.log(faceapi.nets);

  function startVideo() {
    navigator.getUserMedia(
      {
        video: {},
      },
      (stream) => (video.srcObject = stream),
      (err) => console.error(err)
    );
  }

  video.addEventListener('play', () => {
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    }, 100);
  });

  // function startWebcam() {
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       video: true,
  //       audio: false,
  //     })
  //     .then((stream) => {
  //       video.srcObject = stream;
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }

  // startWebcam();
});

// document.querySelector('script[src="js/face-api.min.js"]').addEventListener('load', function () {
//   // Now you can use faceapi
//   console.log(faceapi.nets);

//   // Your other code here
// });

// var faceapi = 'face-api.min.js';
// console.log(faceapi.nets);

// $('#model-switch').change(function () {
//   if (this.checked) {
//     $('.progress-bar').removeClass('d-none');
//     Promise.all([
//       faceapi.nets.tinyFaceDetector.load(modelPath),
//       faceapi.nets.faceLandmark68TinyNet.load(modelPath),
//       faceapi.nets.faceRecognitionNet.load(modelPath),
//       faceapi.nets.faceExpressionNet.load(modelPath),
//       faceapi.nets.ageGenderNet.load(modelPath),
//     ]).then(function () {
//       $('.progress-bar').addClass('d-none');
//       toggleContrl('detection-switch', true);
//     });
//   } else {
//     toggleContrl('detection-switch', false);
//   }
// });

// $('#detection-switch').change(function () {
//   if (this.checked) {
//     createCanvas();
//     toggleContrl('box-switch', true);
//     toggleContrl('landmarks-switch', true);
//     toggleContrl('expression-switch', true);
//     toggleContrl('age-gender-switch', true);
//     $('#box-switch').prop('checked', true);
//     $('.spinner-border').removeClass('d-none');
//     startDetection();
//   } else {
//     clearInterval(faceDetection);
//     toggleContrl('box-switch', false);
//     toggleContrl('landmarks-switch', false);
//     toggleContrl('expression-switch', false);
//     toggleContrl('age-gender-switch', false);
//     if (typeof canvas !== 'undefined') {
//       setTimeout(function () {
//         canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
//       }, 1000);
//     }
//   }
// });

// function createCanvas() {
//   if (document.getElementsByTagName('canvas').length == 0) {
//     canvas = faceapi.createCanvasFromMedia(camera);
//     document.getElementById('webcam-container').append(canvas);
//     faceapi.matchDimensions(canvas, displaySize);
//   }
// }

function startDetection() {
  faceDetection = setInterval(async () => {
    const detections = await faceapi.detectAllFaces(camera, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true).withFaceExpressions().withAgeAndGender();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    if ($('#box-switch').is(':checked')) {
      faceapi.draw.drawDetections(canvas, resizedDetections);
    }
    if ($('#landmarks-switch').is(':checked')) {
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }
    if ($('#expression-switch').is(':checked')) {
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }
    if ($('#age-gender-switch').is(':checked')) {
      resizedDetections.forEach((result) => {
        const { age, gender, genderProbability } = result;
        new faceapi.draw.DrawTextField([`${faceapi.round(age, 0)} years`, `${gender} (${faceapi.round(genderProbability)})`], result.detection.box.bottomRight).draw(canvas);
      });
    }
    if (!$('.spinner-border').hasClass('d-none')) {
      $('.spinner-border').addClass('d-none');
    }
  }, 300);
}

// // function start() {
// //   navigator.mediaDevices
// //     .getUserMedia({
// //       video: true,
// //       audio: false,
// //     })
// //     .then((stream) => {
// //       video.srcObject = stream;
// //     })
// //     .catch((err) => {
// //       console.error(err);
// //     });
// // }
