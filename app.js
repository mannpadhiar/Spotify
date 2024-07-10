let currentSong = new Audio();
let songs;
async function getSongs(){
    let a = await fetch("https://github.com/mannpadhiar/Spotify/tree/main/songs/");
    let responce = await a.text();
    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a"); 
    let songs = [];

    for(let i=0;i<as.length;i++){
        let element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playMusic = (track,pause = false) =>{
    currentSong.src = "/songs/"+track;
    if(!pause){
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = track.replaceAll("%20"," ");
    document.querySelector(".songTime").innerHTML = "00-00/00-00";
}

//convert seconds into 00/00 formet

function convertSeconds(seconds) {
    if(isNaN(seconds) || seconds <0){
        return "00:00";
    }

    seconds = Math.floor(seconds);

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (remainingSeconds < 10) {
        remainingSeconds = '0' + remainingSeconds;
    }

    return minutes + ':' + remainingSeconds;
}

async function main(){
    
    //for sing list
    songs = await getSongs();
    
    playMusic(songs[0],true);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for(const song of songs){
        songUL.innerHTML = songUL.innerHTML + '<li><img src="music.svg" alt="music" class="invert"><div class="info"><div>'+song.replaceAll("%20"," ")+'</div><div>Song detail</div></div><div class="playNow"><span>Play Now</span><img src="play.svg" class="invert" alt=""></div></li>';
    }

    var audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
    });

    //to add event listner to songs

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>{
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        });
    });
      
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    // Event listener for space key press
    document.addEventListener("keyup", (event) => {
        if (event.code === "Space") {
            event.preventDefault(); 
            if (currentSong.paused) {
                currentSong.play();
                play.src = "pause.svg";
            } else {
                currentSong.pause();
                play.src = "play.svg";
            }
        }
    });

    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songTime").innerHTML = `${convertSeconds(currentSong.currentTime)} / ${convertSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration*100) +"%";
        document.querySelector(".innerbar").style.width = (currentSong.currentTime / currentSong.duration*100) +"%";
    });
//for touch in seekBar

   document.querySelector(".seekBar").addEventListener("click",x =>{
        let persent = (x.offsetX/x.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = persent + "%";
        document.querySelector(".innerbar").style.width = persent + "%";

        currentSong.currentTime = currentSong.duration*persent/100;
   });

   //for menu,arrowLeft button

   document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = 0;
   });

   document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = -120+"%";
   });

   //for privous and next song

   previous.addEventListener("click",() =>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(index);
        if((index-1) >= 0){
            playMusic(songs[index-1]);
        }
   });


   next.addEventListener("click",() =>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index+1) < songs.length){
            playMusic(songs[index+1]);
        }
    });

}
main();





const flavoursContainer = document.getElementById('flavoursContainer');
        const scrollStep = 1; // Pixels to move per step
        const scrollDelay = 65; // Delay in milliseconds

        window.addEventListener('load', () => {
            const contentWidth = flavoursContainer.scrollWidth;
            let scrollPosition = 0;

            const interval = setInterval(() => {
                if (scrollPosition >= contentWidth) {
                    flavoursContainer.scrollLeft = 0;
                    clearInterval(interval); // Stop the interval after one loop
                } else {
                    scrollPosition += scrollStep;
                    flavoursContainer.scrollLeft = scrollPosition;
                }
            }, scrollDelay);
        });
