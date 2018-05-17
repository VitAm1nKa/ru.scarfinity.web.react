var intervalIndex = 0;
var interval = null;
var stepLength = 5;
var stepCount = 4;

var timerDel = 1;
var pause = false;
var unpause = false;

function BannerBackgroundWork(stepLength, steps) {
    if(unpause) {
        postMessage({
            message: "unpause",
            index: (intervalIndex / timerDel) / stepLength,
        });

        unpause = false;
    }

    intervalIndex = (intervalIndex + 1) % (steps * timerDel);

    // message to prepare
    if((intervalIndex + (1 * timerDel)) % (stepLength * timerDel) === 0) {
        postMessage({
            message: "prepare",
            index: intervalIndex / timerDel,
        });
    }

    // message change
    if(intervalIndex % (stepLength * timerDel) === 0) {
        postMessage({
            message: "change",
            index: (intervalIndex / timerDel) / stepLength,
        });
    }
}

function BannerBackground(delay, index, message) {
    if(index != null)
        intervalIndex = index * timerDel * stepLength - 1;

    let steps = stepLength * stepCount;
    interval = setInterval(() => {BannerBackgroundWork(stepLength, steps)}, 1000 / timerDel);
    if(message) {
        postMessage(message);
    }
}

onmessage = (event) => {
    if(event.data.message === "start") {
        let delay = event.data.props.delay ? event.data.props.delay : 0;
        if(event.data.props.stepLength)
            stepLength = event.data.props.stepLength;
        if(event.data.props.stepCount)
            stepCount = event.data.props.stepCount

        BannerBackground(delay, null, {
            message: "started",
        });
    }

    if(event.data.message === "gotoindex") {
        let nextIndex = event.data.nextIndex;
        if(nextIndex != null) {
            unpause = true;
            clearInterval(interval);
            BannerBackground(0, nextIndex, {
                message: "waitForGoIndex",
                nextIndex: nextIndex,
            });
        }
    }
}