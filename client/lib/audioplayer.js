AudioPlayer = {
    _currentSong: null,
    _audioElement: null,

    init: function(element) {
        this._audioElement = element;
        this._audioElement.addEventListener('canplay', function() {
            this.play();
        });
        
    },
    loadSong: function(song) {
        if(song != undefined) {
            this._currentSong = song;
        }
    },
    loadFromDataUrl: function(dataUrl, song) {
        this.loadSong(song);
        this._audioElement.src = dataUrl;
        this._audioElement.load();
    }
};
