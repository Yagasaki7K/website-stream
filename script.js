var video;
var source;
var client;
var fullscreen = false;
var path = location.pathname.substring(1);
var channel = path.length == 0 ? 'hawolt' : path;

let isPageClicked = false;

function incoming(json) {
  console.log("[ws-in] " + json)
  if (!json.hasOwnProperty("instruction")) {
    var data = json["result"].split(" ");
    switch (data[0]) {
      case "COOLDOWN":
        addMessageElement(true, "", "system", "You need to wait before you can update your name again.")
        break;
      case "BAD_NAME":
        addMessageElement(true, "", "system", "A name can only contain A-Z and 0-9, max length is 15.")
        break;
      case "NAME_TAKEN":
        addMessageElement(true, "", "system", "This name is already taken.")
        break;
      case "EMPTY_MESSAGE":
        addMessageElement(true, "", "system", "You can't send an empty message.")
        break;
      case "MESSAGE_TO_LONG":
        addMessageElement(true, "", "system", "Your message is to long, character limit is 200.")
        break;
    }
    return;
  }
  let instruction = json["instruction"];
  switch (instruction) {
    case "list":
      document.getElementById("viewers").innerText = json["users"].length;
      break;
    case "chat":
      addMessageToMessagebox(json);
      break;
  }
}

function darkness() {

}

function connecting() {
  addMessageElement(true, "", "system", "connecting to chat...")
}

function reconnect() {
  addMessageElement(true, "", "system", "attempting to reconnect...")
}

function disconnect() {
  addMessageElement(true, "", "system", "lost connection to chat")
}

function addMessageToMessagebox(json) {
  let user = json["user"];
  let msg = json["message"];
  let identifier = json["identifier"];
  let isWithType = json.hasOwnProperty("type");
  let temp = document.createElement("span")
  temp.innerText = msg;
  addMessageElement(isWithType, user, identifier, replaceEmotesWithImages(linkifyHtml(temp.innerHTML, {attributes: {target: "_blank"}})));
}

function addMessageElement(isWithType, user, identifier, msg) {
  let messagebox = document.getElementById("chatbox");
  let message = document.createElement("div");
  message.classList = 'message message-align';
  let attendee = document.createElement("span");
  attendee.title = identifier;
  let content = document.createElement("span");
  content.title = new Date().toLocaleString();
  content.classList = "message-align";
  if (isWithType) {
    message.classList.add("system")
    attendee.innerText = user;
    content.innerHTML = (user.length == 0 ? '' : ' ') + msg;
  } else {
    attendee.classList = "user-message";
    attendee.innerText = user + ":";
    content.innerHTML = "&nbsp;" + msg;
  }
  message.appendChild(attendee);
  message.appendChild(content);
  messagebox.appendChild(message);
  messagebox.scrollTo(0, messagebox.scrollHeight);
}

function ready() {
  addMessageElement(true, "", "system", "connected.")
  addMessageElement(true, "", "system", "list commands via .commands")
  enter(channel);
}

function enter(channel) {
  client.join(channel, onJoinEvent);
}

function onJoinEvent(json) {

}

function submitMessage() {
  let submit = document.getElementById("text-message");
  let msg = submit.value;
  if (!msg.startsWith('.')) {
    client.message(
      channel,
      incoming,
      btoa(encodeURIComponent(msg))
    );
  } else {
    let command = msg.substring(1).split(" ")[0];
    switch (command) {
      case "commands":
        addMessageElement(true, "", "system", "list available emotes: .emotes")
        addMessageElement(true, "", "system", "change name: .rename &lt;name&gt;")
        break;
      case "rename":
        if (msg.split(" ").length > 1) {
	  var name = msg.split(" ").slice(1).join(" ");
	  localStorage.setItem('name', name);
          client.namechange(btoa(name), incoming, channel);
        } else {
          addMessageElement(true, "", "system", "usage: .rename NAME")
        }
        break;
      case "emotes":
        var list = "";
        for (var key in emoteMapping) {
          if (emoteMapping.hasOwnProperty(key)) {
            if (list.length != 0) list += " / ";
            list += key + ": " + replaceEmotesWithImages(key);
          }
        }
        addMessageElement(true, "", "system", list);
        break;
    }
  }
  submit.value = "";
}

function getValueFromStorage(key, defaultValue) {
    var storedName = localStorage.getItem(key);
    return storedName ? storedName : defaultValue;
}

window.onload = function () {
  var name = getValueFromStorage('name','anon');
  client = new RemoteClient(
    "wss://stream.hawolt.com:42069/?name="+name,
    this
  );

  document.body.addEventListener('click', function () {
    isPageClicked = true;
  });

  var href = window.location.href;
  if (href.match("https:\/\/stream\.hawolt\.com\/[A-z]{1,16}")) {
    channel = href.substring(href.lastIndexOf('/') + 1);
  }

  video = document.getElementById('video');

  var content = document.getElementById("content")
  var videoParent = document.getElementById("video-parent")
  var qualitySelect = document.getElementById('quality-select');
  var muteButton = document.getElementById('mute-button');
  var playButton = document.getElementById('play-button');
  var volumeControl = document.getElementById('volume-control');
  var fullscreenBtn = document.getElementById("fullscreen");

  document.addEventListener('fullscreenchange', fullscreenHandler, false);
  document.addEventListener('mozfullscreenchange', fullscreenHandler, false);
  document.addEventListener('MSFullscreenChange', fullscreenHandler, false);
  document.addEventListener('webkitfullscreenchange', fullscreenHandler, false);

  fullscreenBtn.addEventListener('click', () => {
    if (!fullscreen) {
      if (content.requestFullscreen) {
        content.requestFullscreen();
      } else if (content.webkitRequestFullscreen) { /* Safari */
        content.webkitRequestFullscreen();
      } else if (content.msRequestFullscreen) { /* IE11 */
        content.msRequestFullscreen();
      }
    } else {
      document.exitFullscreen()
    }
  });

  function fullscreenHandler() {
    fullscreen = !fullscreen;
    videoParent.classList.toggle("fullscreen");
    content.classList.toggle("overflow")

    fullscreenBtn.childNodes[0].classList.toggle("fa-expand");
    fullscreenBtn.childNodes[0].classList.toggle("fa-compress");
  }

  video.muted = true;
  setVolume()

  window.hls = new Hls();
  var hls = window.hls;

  hls.attachMedia(video);
  var availableQualities;
  var selectedQuality;
  var initialized;

  load('https://stream.hawolt.com/hls/transcoded/' + channel + '.m3u8');

  hls.on(Hls.Events.MANIFEST_PARSED, function () {
    if (!initialized) {
      availableQualities = hls.levels.map(function (level) {
        var resolution = level.attrs.RESOLUTION;
        return {
          label: resolution,
          value: level.height
        };
      });

      availableQualities.forEach(function (quality, index) {
        if (quality.label !== undefined && quality.label.length != 0) {
          var option = document.createElement('option');
          option.textContent = quality.label;
          option.value = index;
          qualitySelect.appendChild(option);
        }
      });
      
      var chat_option = document.createElement('option');
      chat_option.textContent = "chat";
      chat_option.value = "chat";
      qualitySelect.appendChild(chat_option);
      
      initialized = true;
    }
    if (!isPageClicked) {
      video.muted = true;
      muteButton.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    }
    video.play().catch(function (error) {
      playButton.innerHTML = '<i class="fas fa-play"></i>';
    });
  });

  var src_option = document.createElement('option');
  src_option.textContent = "source";
  src_option.value = "source";
  qualitySelect.insertBefore(src_option, qualitySelect.firstChild);
  
  hls.on(Hls.Events.LEVEL_LOADED, function (event, data) {
    currentQualityIndex = hls.nextLoadLevel;
    qualitySelect.selectedIndex = currentQualityIndex + (selectedQuality === 'source' ? 0 : 1);
  });

  hls.on(Hls.Events.ERROR, function (event, data) {
    //console.error('HLS error:', data);
  });

  qualitySelect.addEventListener('change', function () {
    selectedQuality = qualitySelect.value;
    if (selectedQuality === "chat") {
      video.style.display="none";
      video.pause();
      hls.stopLoad();
      playButton.innerHTML = '<i class="fas fa-play"></i>'; // Change button to play icon
    } else {
	video.style.display="block";
        if (selectedQuality === "source") {
        load('https://stream.hawolt.com/hls/source/' + channel + '/index.m3u8');
      } else {
        if (source.includes('source')) {
          load('https://stream.hawolt.com/hls/transcoded/' + channel + '.m3u8');
        }
        hls.nextLevel = parseInt(selectedQuality);
	if(video.paused) {
          playButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change button to pause icon
          hls.startLoad();
          video.play();
	}
      }
    }
  });

  function startPlayback() {
    if (video.paused) {
      hls.startLoad();
      video.play();
      playButton.title = "Pause (space)"
      playButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change button to pause icon
    } else {
      video.pause();
      hls.stopLoad();
      playButton.title = "Play (space)"
      playButton.innerHTML = '<i class="fas fa-play"></i>'; // Change button to play icon
    }
  }

  function setVolume() {
    video.muted = false;
    video.volume = volumeControl.value;
    muteButton.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
  }

  muteButton.addEventListener('click', function () {
    video.muted = !video.muted;
    muteButton.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
  });

  playButton.addEventListener('click', startPlayback);
  volumeControl.addEventListener('input', setVolume);

  var textBox = document.getElementById("text-message");

  textBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      submitMessage();
    }
  });

  document.addEventListener("keypress", function (event) {
    if (document.activeElement != textBox) {
      console.log(event.key);
      switch (event.key) {
        case "f":
          if (!fullscreen) {
            if (content.requestFullscreen) {
              content.requestFullscreen();
            } else if (content.webkitRequestFullscreen) { /* Safari */
              content.webkitRequestFullscreen();
            } else if (content.msRequestFullscreen) { /* IE11 */
              content.msRequestFullscreen();
            }
          } else {
            document.exitFullscreen()
          }
          break;
        case "m":
          video.muted = !video.muted;
          muteButton.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
          break;
        case " ":
          startPlayback();
          break;
      }
    }
  })
}

function load(playlist, delay = 1000) {
  var timeout;
  function loadSource() {
    source = playlist;
    hls.loadSource(playlist);
  }

  function retry() {
    timeout = setTimeout(function () {
      loadSource();
      retry();
    }, delay);
  }

  hls.once(Hls.Events.ERROR, function (event, data) {
    if (data.fatal && data.type === Hls.ErrorTypes.NETWORK_ERROR) {
      //console.error('Network error occurred while loading source:', playlist);
      retry();
    }
  });

  hls.once(Hls.Events.MANIFEST_PARSED, function () {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
  });

  loadSource();
}
