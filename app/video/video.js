
ZiggeoApi.token = "89f1e8db2eba30c939d1d4dcbdeddb05";
ZiggeoApi.language = "es";

ZiggeoApi.Config.cdn = true;
ZiggeoApi.Config.webrtc = true;
ZiggeoApi.Config.resumable = true;

var video_token = '';
var video_url = '';
var RECORDING = 0;
var RECORDINGS = 0;
var MAX_RECORDINGS = 2;
var DEFAULT_ERROR_MSG = 'Ha ocurrido un error al procesar tu respuesta. Por favor, intenta mas tarde.';        


function showMessage(color, message) {
    $('#status_container').removeClass('red');
    $('#status_container').removeClass('green');
    $('#status_container').removeClass('yellow');
    $('#status_container').addClass(color);
    $('#status').html(message);
}
function showErrorMsg(message) {
    message = typeof message !== 'undefined' ? a : DEFAULT_ERROR_MSG;
    showMessage('red', "<i class='fa fa-exclamation-circle'></i> " + message);
}

function startCounter(time, format, onFinish) {
    console.log('Starting counter for time:' + time);
    var comienzo = new Date();
    comienzo.setSeconds(comienzo.getSeconds() + time);
    if ($('#status_container').length > 0) {
        $('#status_container').countdown(comienzo, function (event) {
            if (event.type == 'finish') {
                console.log('Countdown event: ' + event.type);
                onFinish();
            } else if (event.type == 'update') {                        
                if ($('#counter').length > 0) {
                    $('#counter').html(event.strftime(format));
                }
                if($('#status_container .tiempo-preparacion') && event.strftime("%S") == 3){
                    $('#status_container').removeClass('yellow');
                    $('#status_container').addClass('red');
                }                        
            } else {
                console.log('Countdown event: ' + event.type);
            }
        });
    } else {
        console.log('No status_container found');
    }
}
function cancelCounter() {
    if ($('#status_container').length > 0) {
        $('#status_container').countdown('remove');
    } else {
        console.log('No status_container found');
    }
}

function showQuestions() {
    $('#questions').show();
}

function secondsToMS(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ((m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

function initRecorder() {
    showMessage('yellow', 'Iniciando grabador...');
    startCounter(60, '%S', initializationFailed);
    tryToInit();
}

function tryToInit() {
    if ($('.btn-primary[data-selector="record-video"]').length > 0) {
        $('.btn-primary[data-selector="record-video"]').get(0).click();
    } else {
        console.log('Initialization failed... retrying')
        setTimeout(tryToInit, 1000);
    }
}

function initializationFailed() {
    if (RECORDING == 0) {
        showMessage('red', "No hemos podido conectarnos a tu cámara.<br/>Por favor intenta con otro navegador.");
    }
}

function recordingCountdown() {
    cancelCounter();
    showQuestions();
    showMessage('yellow', "<i class='fa fa-info-circle'></i> Tiempo de preparación: <span id='counter' class='tiempo-preparacion'>{{$setup_time}}</span><br/>Piensa tu respuesta");
    startCounter(30, '%M:%S', recordingAlert);
}

function recordingAlert() {
    showMessage('red', "Espera...");                            
    record();            
}

function record() {
    cancelCounter();
    showMessage('red', "Iniciando grabación...");
    var embedding = ZiggeoApi.Embed.get("grabador");
    embedding.record();
}

function recordingStarting() {
    showMessage('red', "Iniciando grabación...");
    cancelCounter();
}

function recordingStarted() {
    if (!RECORDING) {
        RECORDING = 1;
        showMessage('green', "Responde ahora <br/><span id='counter'>00:00</span>/" + secondsToMS(60));
        startCounter(10, '%M:%S');
    }
}

function recordingFinished() {
    RECORDINGS = RECORDINGS + 1;
    RECORDING = 0;
    showMessage('yellow', "Espere un momento. Estamos recibiendo y procesando su respuesta.");
}

function recordingSaved(data) {
    video_token = data.video.token;
    video_url = ZiggeoApi.Videos.source(data.video.token);
    console.log('video token:' + video_token + ' url:' + video_url);
    saveVideoAnswer(video_url);
}

function saveVideoAnswer(video_url) {
    $.ajax({
        url: 'http://vinderapi.azurewebsites.net/api/videos/',                                                
        data: {
            url: video_url,
            fileName: "video.mp4",
        },
        type: 'POST',
        success: function (data) {                                        
            console.log(data)                    
            //
        },
        error: function (data) {                    
            console.log('Error: ' + data.responseText);
            showErrorMsg();
        },                
    });
}

//EVENTOS ZIGGEO

ZiggeoApi.Events.on("access_granted", function (data) {
    // Triggered when the user grants access to the camera
    console.log('access_granted.');
});

ZiggeoApi.Events.on("countdown", function (time, data) {
    // Triggered while the video recorder counts down
    console.log('recording countdown time: ' + time);
});

ZiggeoApi.Events.on("ready_to_record", function (data) {
    // Triggered when a video recorder is ready to record a video
    console.log('ready to record.');
    if (RECORDING == 0) {
        recordingCountdown();
    }
});

ZiggeoApi.Events.on("recording", function (data) {
    // Triggered when the recording process has been started
    console.log('recording data: ' + JSON.stringify(data));
    recordingStarting();
});

ZiggeoApi.Events.on("elapsed", function (time, data) {
    //console.log('elapsed time:' + time + ' data: ' + JSON.stringify(data));
    console.log('elapsed...');
    // Triggered while the video recorder records the video
    recordingStarted();
});

ZiggeoApi.Events.on("finished", function (data) {
    // Triggered when the recording process has finished
    console.log('recording finished');
    recordingFinished();
});

ZiggeoApi.Events.on("uploading", function (data) {
    // Triggered when the video is uploading
    console.log('uploading begins');
});

ZiggeoApi.Events.on("upload_progress", function (uploaded, total, data) {
    // Upload progress events
    //console.log('upload progress uploaded/total:' + uploaded + '/' + total);
    console.log('uploading...');
});

ZiggeoApi.Events.on("uploaded", function (data) {
    // Triggered when a video has been uploaded / recorded (but not processed)
    console.log('uploaded video data:' + JSON.stringify(data));
});

ZiggeoApi.Events.on("submitted", function (data) {
    console.log("Submitted a new video with data '" + JSON.stringify(data) + "'!");
    recordingSaved(data);
});

ZiggeoApi.Events.on("processing_progress", function (percentage, data) {
    // Processing progress events
    //console.log('Processing progress percentage:' + percentage );
    //console.log('processing...(' + percentage + ')');
});

ZiggeoApi.Events.on("discarded", function (data) {
    // Triggered when a recorded video has been discarded and is being re-recorded
    console.log('video dicarded');
    recordingCountdown();
});


ZiggeoApi.Events.on("error_recorder", function (data, error) {
    // Triggered when the video recorder encounters an error
    console.log('error recorder data: ' + JSON.stringify(data) + ' error: ' + error);
    showErrorMsg();
});

ZiggeoApi.Events.on("access_forbidden", function (data, error) {
    // Triggered when the user does not grant access to the camera
    console.log('access_forbidden. data:' + JSON.stringify(data) + ' error:' + error);
    showErrorMsg('No logramos conectarnos a tu camara.');
});

ZiggeoApi.Events.on("flash_hibernate", function (data) {
    // Triggered when the browser puts Flash into hibernation mode
    console.log('flash_hibernate. data:' + JSON.stringify(data));
    showErrorMsg('Tu cámara no está disponible.');
});

ZiggeoApi.Events.on("camera_unresponsive", function (data) {
    // Triggered when the camera has become unresponsive.
    console.log('camera_unresponsive. data:' + JSON.stringify(data));
    showErrorMsg('No logramos conectarnos a tu cámara.');
});

ZiggeoApi.Events.on("camera_nosignal", function (data) {
    // Triggered when the camera has no signal.
    console.log('camera_nosignal. data:' + JSON.stringify(data));
    showErrorMsg('No logramos conectarnos a tu cámara.');
});

$(function () {
    initRecorder();
});    