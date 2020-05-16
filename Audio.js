
const myPlaylist = [{
    id:"Asa - Preacher Man",
    displayName:"Preacher Man",
    artist:"Asa",
    fileName:"Asa - Preacher Man.mp3",
},
{
    id:"asa bimpe",
    displayName:"Bimpe",
    artist:"Asa",
    fileName:"asa bimpe.mp3",
},
{
    id:"Asa_Awe",
    displayName:"Awe",
    artist:"Asa",
    fileName:"Asa_Awe.mp3",
},
{
    id:"Asa_Bed_Of_Stone",
    displayName:"Bed_Of_Stone",
    artist:"Asa",
    fileName:"Asa_Bed_Of_Stone.mp3",
},
{
    id:"Asa_Eye_Adaba",
    displayName:"Eye_Adaba",
    artist:"Asa",
    fileName:"Asa_Eye_Adaba.mp3",
},
{
    id:"Asa_Eyo",
    displayName:"Eyo",
    artist:"Asa",
    fileName:"Asa_Eyo.mp3",
},
{
    id:"Asa - Why can't we",
    displayName:"Why can't we",
    artist:"Asa",
    fileName:"Asa - Why can't we.mp3",
},
{
    id:"Asa_Far_Away",
    displayName:"Far_Away",
    artist:"Asa",
    fileName:"Asa_Far_Away.mp3",
},
{
    id:"Asa_Ft_Ife_Love_Bibanke_Duet_Remix",
    displayName:"Ife_Love_Bibanke_Duet_Remix",
    artist:"Asa",
    fileName:"Asa_Ft_Ife_Love_Bibanke_Duet_Remix.mp3",
},
{
    id:"Asa_Grateful",
    displayName:"Grateful",
    artist:"Asa",
    fileName:"Asa_Grateful.mp3",
},
]


    const albumArt = document.querySelector('.album-art')
    const container = document.querySelector('#container')
    const cover = document.querySelector('.cover')
    const buttons = document.querySelector('.buttons');
    const playlist = document.querySelector('.playlist');
    const volume = document.querySelector('.volume');
    const artist = document.querySelector('.artist');
    const title = document.querySelector('.title');
    const seeker = document.querySelector('.seeker');
    const currentTime = document.querySelector('.currentTime');
    const duration = document.querySelector('.duration');
    const play = document.querySelector('#play');
    let audio = document.createElement('audio');
    const volumeButton = document.querySelector('.volume-btn')
    const loop = document.querySelector('#loop')
    const path = "Audio/"
    let currentlyPlaying;
    let index = 0;
    let repeat = 0;
    let count = 0
    let auto;
    let canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
    
    for(let i=0; i<myPlaylist.length; i++){
        playlist.innerHTML += `<li class=${myPlaylist[i].id} class="songs">${myPlaylist[i].displayName}</li>`
    }
    let lis = document.querySelectorAll('.playlist li')

    const frameLooper=()=>{
            window.requestAnimationFrame(frameLooper)
            fbc_array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(fbc_array)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = "#0032ff";
            bars = 100;
            for(let i=0; i<bars; i++){
                bar_x = i*3;
                bar_width = 2;
                bar_height = -(fbc_array[i] / 2)
                ctx.fillRect(bar_x, canvas.height, bar_width, bar_height)
            }
        }

    const initAudioPlayer=()=>{
            
            context = new AudioContext();
            analyser = context.createAnalyser()
            canvas = document.querySelector('.virtualization')
            ctx = canvas.getContext('3d')
            source = context.createMediaElementSource(audio)
            source.connect(analyser)
            analyser.connect(context.destination)
            frameLooper();
        }
    
    const init =(index, event)=>{

        
        cover.src = `${path}${myPlaylist[index].displayName}.jpeg`;
        artist.innerHTML = myPlaylist[index].artist;
        title.innerHTML = myPlaylist[index].displayName;
        lis[index].classList.add('active')
        audio.src = `${path}${myPlaylist[index].fileName}`
        currentlyPlaying = myPlaylist[index].id
        console.log(audio.loop)
        
        if (!event) return 
        else if(event.target.id === 'next'|| 'prev'|| event.target.classList.contains('songs')|| event.type === "ended"){
            
            console.log('I see you')
            audio.play()
            container.classList.add('play');
            play.classList.add('pause')
        }
    }

    init(index)

    const mute =()=>{
        if (!audio) return
        volumeButton.classList.toggle('mute');
        audio.muted = !audio.muted;
    }
    const volumeControl =()=>{
        audio.volume = volume.value / volume.max
    }

    const updateTimers =()=>{
        let currentTimePercentage = audio.currentTime * (100 / audio.duration)
        seeker.value = currentTimePercentage;
        let curmins = Math.floor(audio.currentTime / 60);
        let cursecs = Math.floor(audio.currentTime % 60);
        let durmins = Math.floor(audio.duration / 60);
        let dursecs = Math.floor(audio.duration % 60);
        curmins < 10? curmins = "0"+curmins: curmins;
        cursecs < 10? cursecs = "0"+cursecs: cursecs;
        durmins < 10? durmins = "0"+durmins: durmins;
        dursecs < 10? dursecs = "0"+dursecs: dursecs;
        currentTime.innerHTML = `${curmins} : ${cursecs}`;
        duration.innerHTML = `${durmins} : ${dursecs}`;
         
    }
        
    const pauseTrack =()=>{
        audio.pause();
        play.classList.remove('pause');
        container.classList.remove('play');
    }

    const nextTrack =(event)=>{
        lis[index].classList.remove('active')
            if(index === lis.length - 1){
                index = 0
                if(!auto || repeat % 3 == 2 ){  
                    init(index,event)
                    
                }else{
                    play.classList.remove('pause');
                    container.classList.remove('play');
                }
            }else{
                
                index ++
                init(index, event);   
            }
    }

    const audioPositionUpdate =()=>{
       
        if(!audio) return
                let seekTo = audio.duration * (seeker.value / seeker.max)
                audio.currentTime = seekTo;
    }

    
    buttons.addEventListener('click',()=>{
        if(event.target.id === 'play'){
            if(audio.paused){
                audio.play();
                event.target.classList.add('pause');
                container.classList.add('play')
                
            }else{
                pauseTrack()
            }
        }else if(event.target.id === 'stop'){
            pauseTrack()
            audio.currentTime = 0;

        }else if(event.target.id === 'next'){
           auto = 0;
           nextTrack(event)

        }else if(event.target.id === 'prev'){
            lis[index].classList.remove('active')
            if(index === 0){
                index = lis.length - 1
            }else{
                index --;
            }
            init(index, event);
           
        }
        else if(event.target.id === 'loop'){
            
            repeat++
            if (repeat >= 3){
                    repeat = 0;
                }
            if(repeat % 3 == 0){
                console.log('loop-0')
                event.target.classList.remove('loop-2')
            }
            else if(repeat % 3 == 1){
                console.log('loop-1')
                event.target.classList.add('loop-1')
            }else if(repeat % 3 == 2){
                console.log('loop-2')
                event.target.classList.remove('loop-1')
                event.target.classList.add('loop-2')
            }
        }
    })

    playlist.addEventListener('click', ()=>{
        
        if(event.target.classList.contains('songs')){
            lis[index].classList.remove('active')
            let clickedli = document.querySelector(`#${event.target.id}`)
            lis = Array.from(lis)
            index = lis.indexOf(clickedli)
            init(index, event)
        }
    })

    seeker.addEventListener('change', audioPositionUpdate)
    // seeker.addEventListener('mousedown', audioPositionUpdate)
    seeker.addEventListener('mousedown', ()=>{
        seek = true;
        audioPositionUpdate()})
    audio.addEventListener('ended', (event)=>{
        
        auto = 1
        if(repeat % 3 == 1){
            audio.play();
        }else{
             nextTrack(event);
         }
         
    })
    
    audio.addEventListener('timeupdate', updateTimers)
    volume.addEventListener('change', volumeControl )
    volumeButton.addEventListener('click', mute)
    albumArt.addEventListener('click', ()=>{
        count ++
        if(count === 1){
            initAudioPlayer()
        }
        
        Array.from(albumArt.children).forEach((child)=>{
            child.classList.toggle('showHide')
        })
        
    })

       
        // window.addEventListener("load",initAudioPlayer, false)