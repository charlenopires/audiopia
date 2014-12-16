UI.registerHelper('formatSecs', function(secs) {
    if(secs == -1) {
        return '\u2026';
    } else {
        var hours = Math.floor(secs / 3600), mins = Math.floor(secs % 3600 / 60), secs = Math.ceil(secs % 3600 % 60);
        return (hours == 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0' + hours + ':' : hours + ':') + (mins.toString().length < 2 ? '0'+ mins : mins) + ':' + (secs.toString().length < 2 ? '0' + secs : secs);
    }
});

Template.audio.created = function() {
    this.audioElement = null;
    this._classPrefix = 'audioplayer-';
    this.duration = new ReactiveVar(-1);
    this.currentTime = new ReactiveVar(0);
}

Template.audio.rendered = function() {
    var self = this;
    self.audioElement = self.find('audio');
    self.audioElement.addEventListener('play', function(event) {
        $(self.firstNode).addClass(self._classPrefix + 'playing');
    });
    self.audioElement.addEventListener('pause', function(event) {
        $(self.firstNode).removeClass(self._classPrefix + 'playing');
    });
    self.audioElement.addEventListener('volumechange', function(event) {
        $(self.firstNode).toggleClass(self._classPrefix + 'muted', this.muted);
        self.$('[data-role="volume-slider"] :first-child').height(Math.ceil(this.volume * 100) + '%');
    });
    self.audioElement.addEventListener('durationchange', function(event) {
        self.duration.set(this.duration);
    });
    self.audioElement.addEventListener('timeupdate', function(event) {
        self.currentTime.set(this.currentTime);
        self.$('[data-role="progress-slider"] :last-child').width((this.currentTime / self.duration.get()) * 100 + '%');
    });

    AudioPlayer.init(self.audioElement);
}

Template.audio.helpers({
    duration: function() {
        self = Template.instance();
        return self.duration.get();
    },
    currentTime: function() {
        self = Template.instance();
        return self.currentTime.get();
    }
});

Template.audio.events({
    'click [data-role="play-button"]': function(event, template) {
        var self = template;
        if(!self.audioElement.paused) {
            self.audioElement.pause();
        } else {
            self.audioElement.play();
        }
    },
    'click [data-role="volume-button"]': function(event, template) {
        var self = template;
        self.audioElement.muted = !self.audioElement.muted;
    },
    'mousedown [data-role$="-slider"]': function(event, template) {
        var self = template;
        var func = undefined;
        var target = $(event.currentTarget);
        switch(target.attr('data-role')) {
            case 'volume-slider': func = function(event) {
                self.audioElement.volume = Math.abs((event.pageY - (target.offset().top + target.height())) / target.height());
            }; break;
            case 'progress-slider': func = function(event) {
                self.audioElement.currentTime = Math.round((self.audioElement.duration * (event.pageX - target.offset().left)) / target.width());
            }; break;
        }
        target.on('mousemove', function(event) {
            try {
                func(event);
            } catch(e) {}
        }).on('mouseup', function(event) {
            target.unbind('mousemove');
        });
        func(event);
    }
});
