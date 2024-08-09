let currentSong = new Audio();
let songs;
let currFolder;
let isLikeSelected = false;
let likedSongs = [];

async function getSongs(folder) {
    currFolder = folder;
    const baseUrl = 'https://api.github.com/repos/mannpadhiar/Spotify/contents';
    
    try {
        let response = await fetch(`${baseUrl}/${folder}`);
        if (!response.ok) throw new Error('Failed to fetch folder contents');
        
        let data = await response.json();
        
        songs = data
            .filter(file => file.name.endsWith('.mp3'))
            .map(file => file.name);
        
        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

const playMusic = (track, pause = false, playFolder = currFolder) => {
    currentSong.src = `https://raw.githubusercontent.com/mannpadhiar/Spotify/main/${playFolder}/` + track;
    console.log(currentSong.src);
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = track.split("/").pop().replaceAll("%20", " ").split('.')[0];
    document.querySelector(".songTime").innerHTML = "00:00";
    document.querySelector(".songDuration").innerHTML = "00:00";
    if(likedSongs.includes(currentSong.src.split("/songs")[1])){
        document.querySelector(".likeButton").style.color = 'red';
    }
    else{
        document.querySelector(".likeButton").style.color = 'white';
    }
}

function playMusicLike(track, playFolder) {
    currentSong.src = `https://raw.githubusercontent.com/mannpadhiar/Spotify/main/songs/${playFolder}/` + track;
    console.log(currentSong.src);
    currentSong.play();
    play.src = "pause.svg";
    document.querySelector(".songInfo").innerHTML = track.split("/").pop().replaceAll("%20", " ").split('.')[0];
    document.querySelector(".songTime").innerHTML = "00:00";
    document.querySelector(".songDuration").innerHTML = "00:00";
    if(likedSongs.includes(currentSong.src.split("/songs")[1])){
        document.querySelector(".likeButton").style.color = 'red';
    }
    else{
        document.querySelector(".likeButton").style.color = 'white';
    }
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
    songs = await getSongs("songs/temp");

    playMusic(songs[0],true);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for(const song of songs){
        songUL.innerHTML = songUL.innerHTML + '<li><img src="music.svg" alt="music" class="invert"><div class="info"><div class="visibility_none">'+ song.replaceAll("%20"," ") +'</div><div class="infoName">'+song.replaceAll("%20"," ").split('.')[0]+'</div><div>Song detail</div></div><div class="playNow"><span>Play Now</span><img src="play.svg" class="invert" alt=""></div></li>';
    }

    var audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
    });

    //to add event listner to songs

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>{
        e.addEventListener("click", element => {
            if(isLikeSelected){
                playMusicLike(e.querySelector(".info").firstElementChild.innerHTML.split('/')[2] ,+e.querySelector(".info").firstElementChild.innerHTML.split('/')[1]);
            }else{
                playMusic(e.querySelector(".info").firstElementChild.innerHTML);
            }
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
        document.querySelector(".songTime").innerHTML = `${convertSeconds(currentSong.currentTime)}`;
        document.querySelector(".songDuration").innerHTML =`${convertSeconds(currentSong.duration)}`;
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

    //volumeBar

    document.querySelector(".volumeBar").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100;
        console.log(parseInt(e.target.value)/100);
    });

    //for select a card

    function selectFromCard(songs){
        if(isLikeSelected){
            for(const song of songs){
                songUL.innerHTML = songUL.innerHTML + '<li><img src="music.svg" alt="music" class="invert"><div class="info"><div class="visibility_none">'+ song.replaceAll("%20"," ") +'</div>  <div class="infoName auto-scroll" id="flavoursParagraph">'+song.split('/')[2].replaceAll("%20"," ").split('.')[0]+'</div> <div>Song detail</div></div><div class="playNow"><span>Play Now</span><img src="play.svg" class="invert" alt=""></div></li>';
            }
        }
        else{
            for(const song of songs){
                songUL.innerHTML = songUL.innerHTML + '<li><img src="music.svg" alt="music" class="invert"><div class="info"><div class="visibility_none">'+ song.replaceAll("%20"," ") +'</div><div class="infoName">'+song.replaceAll("%20"," ").split('.')[0]+'</div><div>Song detail</div></div><div class="playNow"><span>Play Now</span><img src="play.svg" class="invert" alt=""></div></li>';
            }
        }    
        document.querySelector(".left").style.left = 0;

        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>{
            e.addEventListener("click", element => {
                console.log(e.querySelector(".info").firstElementChild.innerHTML);
                if(isLikeSelected){
                    playMusicLike(e.querySelector(".info").firstElementChild.innerHTML.split('/')[2],e.querySelector(".info").firstElementChild.innerHTML.split('/')[1]);
                }else{
                    playMusic(e.querySelector(".info").firstElementChild.innerHTML);
                }            
            });
        });
    }

    document.querySelector(".temp").addEventListener("click", async()=>{
        isLikeSelected = false;
        songs = await getSongs("songs/temp");
        console.log("temp2 selected");
        songUL.innerHTML = "";
        selectFromCard(songs);
    });

    document.querySelector(".temp2").addEventListener("click", async()=>{
        isLikeSelected = false;
        songs = await getSongs("songs/temp2");
        console.log("temp2 selected");
        songUL.innerHTML = "";
        selectFromCard(songs);
    });

    document.querySelector(".top_50_india").addEventListener("click", async()=>{
        isLikeSelected = false;
        songs = await getSongs("songs/India_50");
        console.log("india selected");
        songUL.innerHTML = "";
        selectFromCard(songs);
    });

    
    document.querySelector(".top_50_global").addEventListener("click", async()=>{
        isLikeSelected = false;
        songs = await getSongs("songs/Global_50");
        console.log("Global_50 selected");
        songUL.innerHTML = "";
        selectFromCard(songs);
    });

    document.querySelector(".oldSongs").addEventListener("click", async()=>{
        isLikeSelected = false;
        songs = await getSongs("songs/old_songs");
        console.log("oldSongs selected");
        songUL.innerHTML = "";
        selectFromCard(songs);
    });

    document.querySelector(".oldSongs_2").addEventListener("click", async()=>{
        isLikeSelected = false;
        songs = await getSongs("songs/oldSongs_2");
        console.log("oldSongs@ selected");
        songUL.innerHTML = "";
        selectFromCard(songs);
    });

    //for like a song

    document.querySelector(".likeButton").addEventListener("click",()=>{
        if(!(likedSongs.includes(currentSong.src.split("/songs")[1]))){
            likedSongs.push(currentSong.src.split("/songs")[1]);
            document.querySelector(".likeButton").style.color = 'red';
        }
        else if((likedSongs.includes(currentSong.src.split("/songs")[1]))){
            document.querySelector(".likeButton").style.color = 'white';
            let likedSongIndex = likedSongs.indexOf(currentSong.src.split("/songs")[1]);
            while (likedSongIndex !== -1) {
                likedSongs.splice(likedSongIndex, 1);
                likedSongIndex = likedSongs.indexOf(currentSong.src.split("/songs")[1]);
            }
        }
        console.log(currentSong.src.split("/"));
        
        // document.querySelector(".likeCard").pointerEevents = none;
    });

    document.querySelector(".likeCard").addEventListener("click",()=>{
        isLikeSelected = true;
        songUL.innerHTML = "";
        
        selectFromCard(likedSongs);
    }); 

    
    
}
main();


//animation on like button


document.querySelector('.likeButton').addEventListener('click', function() {
    const likeButton = this;
    likeButton.classList.add('animate');
    
    
    // Remove the class after the animation ends to allow re-triggering
    likeButton.addEventListener('animationend', function() {
        likeButton.classList.remove('animate');
    }, { once: true });
});




class AutoScroller {
    constructor(element, scrollStep = 1, scrollDelay = 65) {
        this.element = element;
        this.scrollStep = scrollStep;
        this.scrollDelay = scrollDelay;
        this.scrollPosition = 0;

        window.addEventListener('load', () => {
            this.contentWidth = this.element.scrollWidth;
            this.startScrolling();
        });
    }

    startScrolling() {
        this.interval = setInterval(() => {
            if (this.scrollPosition >= this.contentWidth) {
                this.element.scrollLeft = 0;
                clearInterval(this.interval); // Stop the interval after one loop
            } else {
                this.scrollPosition += this.scrollStep;
                this.element.scrollLeft = this.scrollPosition;
            }
        }, this.scrollDelay);
    }
}

new AutoScroller(document.getElementById('flavoursParagraph'), 1, 65);

        