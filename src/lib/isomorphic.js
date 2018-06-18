export function useDOM({clientSide, serverSide, bothSides, onError, afterComplete}) {
    try {
        var canUseDOM = !!(
            typeof window !== 'undefined' &&
            window.document &&
            window.document.createElement
        )

        if(canUseDOM) {
            if(clientSide != null) clientSide();
        } else {
            if(serverSide != null) serverSide();
        }

        if(bothSides != null) bothSides();

    } catch(e) {
        if(onError != null) onError();
    } finally {
        if(afterComplete != null) afterComplete();
    }
}

export function isomorph(callback) {
    if(callback) {
        useDOM({ clientSide: callback });
    }
}