AudioPlayer = {
    _audioElement: null,
    _audioContext: null,

    init: function(element) {
        var self = this;
        this._audioElement = element;
        this._audioElement.addEventListener('canplay', function() {
            this.play();
        });
        this._audioElement.addEventListener('ended', function() {
        });
        
    },
    loadContext: function(context) {
        if(context != undefined) {
            this._audioContext = context;
        }
    },
    loadFromDataUrl: function(dataUrl, context) {
        this.loadContext(context);
        this._audioElement.src = dataUrl;
        this._audioElement.load();
    },
};
