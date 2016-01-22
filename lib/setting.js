var channelSetting = function() {
    var self = this;
    self.settings = {
        camera: {
            width: 640,
            height: 480,
            quality: 30,
            fps: 10,
            send_image: true,
            compress: true,
            vlc_params: ['-I', 'dummy', '--ignore-config']
        },
        face: {
            detection: {
                enable: true,
                tracking: true,
                max_size: 8192,
                min_size: 40,
                age: true,
                gender: true,
                express: true
            },
            identification: {
                enable: false,
                group_id: null,
                mode: 2,
                max_result: 3
            }
        },
        human: {
            detection: {
                enable: true,
                tracking: true,
                max_size: 8192,
                min_size: 40
            }
        }
    }
}

channelSetting.prototype.setCamera = function(params) {
	var self = this;
	self.settings.camera = params;
}

channelSetting.prototype.setFace = function(params) {
	var self = this;
	self.settings.face = params;
}

channelSetting.prototype.setHuman = function(params) {
	var self = this;
	self.settings.human = params;
}

channelSetting.prototype.getAll = function() {
	var self = this;
	return self.settings;
}

module.exports = channelSetting;
