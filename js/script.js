let toggle = document.querySelector(".hamburger-toggle");
let currentsong = new Audio();
let currFolder;
toggle.addEventListener("click", () => {
  console.log("clicked");

  let humburger = document.querySelector(".nav-items");
  if (!humburger.classList.contains("hide")) {
    console.log("true");
    document.getElementById("toggle-signup").style.display = "none";
    document.getElementById("toggle-login").style.display = "none";
    humburger.classList.add("hide");
    // humburger.classList.remove("hide");
  } else {
    // humburger.classList.add("hide");
    document.getElementById("toggle-signup").style.display = "flex";
    document.getElementById("toggle-login").style.display = "flex";
    humburger.classList.remove("hide");
  }
});
//song list hide show

let btnsonglist = document.querySelector(".expand");
btnsonglist.addEventListener("click", () => {
  console.log("clicked");

  let leftbar = document.querySelector(".left");
  if (!leftbar.classList.contains("left-hide")) {
    console.log("true");
    document.getElementById("left").classList.add("left-hide");
    // leftbar.classList.add("hide");
    leftbar.classList.remove("show-left");
  } else {
    console.log("click");
    document.getElementById("left").classList.add("show-left");
    leftbar.classList.remove("left-hide");
  }
});

//get song list
let songs;
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  // console.log(div)
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    // console.log(element);
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currFolder}/`)[1]);
    }
  }
//show all songs in playlist
  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songul.innerHTML = "";
  console.log(songul);
  for (const song of songs) {
    songul.innerHTML =
      songul.innerHTML +
      `<li>
                <div class="info">
                  <i class="fa-solid fa-music"></i>
                  <div class="song-info">
                    <div class="song-name">${song.replaceAll("%20", " ")}</div>
                    <div class="song-artist">Glad Heart</div>
                  </div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <i class="fa-solid fa-play"></i>
                </div>
              
    
    
    
    
    </li>`;
  }
  // add event listener to each song

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".song-info").firstElementChild.innerHTML);
      playMusic(
        e.querySelector(".song-info").firstElementChild.innerHTML.trim()
      );
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  //let audio = new Audio("/songs/" + track);
  currentsong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentsong.play();
    play.style.display = "none";
    pausebtn.style.display = "flex";
  }
  document.querySelector(".songname").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let spotifyPlaylist = document.querySelector(".spotify-playlist");
  console.log(div);
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    // console.log(e.href);
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];

      //get the metadata of the folder

      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);
      spotifyPlaylist.innerHTML =
        spotifyPlaylist.innerHTML +
        `<div data-folder="${folder}" class="card">
                  <div class="play">
                    <i class="fa-solid fa-play"></i>
                  </div>
                  <img
                    src="/songs/${folder}/cover.jpg"
                    alt="top charts"
                  />
                  <h2>
                    ${response.description}
                  </h2>
                </div>`;
    }
  }

  //load playlist on card click
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log("card clicked");
      console.log(item.currentTarget, item.currentTarget.dataset.folder);
      console.log(`songs/${item.currentTarget.dataset.folder}`);
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    });
  });
}

async function main() {
  await getSongs("/songs/audio");
  // console.log(songs);
  playMusic(songs[0], true);

  //display all albums on the page

  displayAlbums();

  //add event listner to play,previous and next

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.style.display = "none";
      pausebtn.style.display = "flex";
      // console.log(currentsong)
      console.log("paly if run");
      return;
    } else currentsong.pause();
    console.log("play else run");
    play.style.display = "flex";
    pausebtn.style.display = "none";
  });

  pausebtn.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.style.display = "none";
      pausebtn.style.display = "flex";
      // console.log(currentsong)
      console.log("pause if run");
    } else currentsong.pause();
    console.log(" pouse else run");
    play.style.display = "flex";
    pausebtn.style.display = "none";
  });

  //add eventlistner to timeupdate
  let currenttime;
  let songduration;
  currentsong.addEventListener("timeupdate", () => {
    currenttime = Math.floor(currentsong.currentTime);
    songduration = Math.floor(currentsong.duration);
    // console.log(currenttime + songduration);
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currenttime
    )} / ${formatTime(songduration)}`;
    document.querySelector(".circle").style.left =
      (currenttime / songduration) * 100 + "%";
  });

  //add eventlistner to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.offsetX);
    let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percentage + "%";
    currentsong.currentTime = Math.floor((songduration * percentage) / 100);
    // console.log(`Seeked to: ${currenttime}s, ${percentage}%`);
    // console.log("current time:" + currenttime);
    // console.log(songduration);
  });

  //add event listner to previous

  previous.addEventListener("click", () => {
    console.log("Previous clicked");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

    console.log(songs, index);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  //add event listner to next

  next.addEventListener("click", () => {
    console.log("Next clicked");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

    console.log(songs, index);
    if (index + 1 < songs.length) {
      console.log("length: " + length);
      console.log("index:" + (index + 1));
      playMusic(songs[index + 1]);
    }
  });

  //add eventlistner to volume

  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("setting volume to" + e.target.value + "/100");
      currentsong.volume = parseInt(e.target.value) / 100;
      if(currentsong.volume>0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
      }
    });

  //add event listner to volume

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    console.log(e.target);
    console.log("changing", e.target);
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentsong.volume = 0;
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentsong.volume = 0.1;
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}

main();
