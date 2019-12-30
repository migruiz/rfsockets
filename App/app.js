var spawn = require('child_process').spawn;


var mqtt = require('mqtt')
global.mtqqURL=process.env.mtqqURL
global.socketsTopic="rfsocketsaction"
global.waitForNextCommand=500
global.roundCycles=3

var client  = mqtt.connect(global.mtqqURL)
 
client.on('connect', function () {
  client.subscribe(global.socketsTopic)
})
client.on('message',async function (topic, message) {
    if (topic === global.socketsTopic) {    
        const codes = JSON.parse(message)
        await executeMultipleCommandsAsync(codes)
    }
  })



const timeout = ms => new Promise(res => setTimeout(res, ms))

async function executeMultipleCommandsAsync(codes) {
    for (var i = 0; i < global.roundCycles; i++) {
        for (codeIndex = 0; codeIndex < codes.length;codeIndex++) { 
            var code=codes[codeIndex];
             await executeSingleCommandAsync(code);
             await timeout(global.waitForNextCommand);
        }


    }
}

function executeSingleCommandAsync(code) {
    return new Promise(function (resolve, reject) {
        const command = spawn('/433Utils/RPi_utils/codesend'
            , [
                code
                , '-l'
                , '180'
            ]);
        command.stdout.on('data', data => {
            console.log(data.toString());
        });
        command.on('exit', function (code, signal) {
            console.log('exited');
            resolve();
        });
    });
}



// Catch uncaught exception
process.on('uncaughtException', err => {
    console.dir(err, { depth: null });
    process.exit(1);
});
process.on('exit', code => {
    console.log('Process exit');
    process.exit(code);
});
process.on('SIGTERM', code => {
    console.log('Process SIGTERM');
    process.exit(code);
});
