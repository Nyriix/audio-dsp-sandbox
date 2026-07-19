document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const act1 = document.getElementById("act-1");
    const bg_audio = document.getElementById("bg-audio")
    // UI targets inside the window
    const h1 = document.getElementById("main-title");
    const subtitle = document.getElementById("main-subtitle");
    const introContent = document.getElementById("intro-content");
    
    // Calibration targets
    const calibrationBox = document.getElementById("calibration-box");
    const authMicBtn = document.getElementById("auth-mic-btn");
    const calibrationStatus = document.getElementById("calibration-status");

    // ==========================================
    // ACT II: GLOBAL PUZZLE ENGINE VARIABLES
    // ==========================================
    const puzzleContainer = document.getElementById("puzzle-container");
     const original_img = document.getElementById("original-img");

    const puzzleStatus = document.getElementById("puzzle-status");
    const revealBtn = document.getElementById("reveal-btn");
    const dust = document.getElementById("dust")



    
    const imageSrc = 'assets/puzzle.jpg'; // <-- Drop your picture in your folder and name it this!
    let correctOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let currentOrder = [];
    let selectedTile = null;

    // Make Act 1 fade in beautifully when the page loads
    act1.style.opacity = "0"; 
    act1.classList.add("fade-in-entry");

    // Step 1: Click "Initialize Protocol" -> Swap contents inside the window
    startBtn.addEventListener("click", () => {
        bg_audio.play();
        // Hide the initial dashboard rows
        introContent.style.display = "none";
        
        // Update the textual layout for the diagnostic test
        h1.innerText = "System Calibration 🛠️";
        subtitle.innerText = "Audio diagnostics required to construct your digital environment.";
        
        // Show the calibration section smoothly
        calibrationBox.style.display = "block";
    });

    // Step 2: Instant Mic Check (No Meter)
    authMicBtn.addEventListener("click", () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(function(stream) {
                // SUCCESS: Stop the mic stream immediately so the indicator clears
                stream.getTracks().forEach(track => track.stop());
                
                authMicBtn.style.display = "none";
                calibrationStatus.style.display = "block";
                calibrationStatus.innerText = ">> ACCESS GRANTED: [TRUE]";
                calibrationStatus.style.color = "#22c55e";

                // Short delay so she sees the success verification, then clear out Act 1
                setTimeout(proceedToAct2, 1000);
            })
            .catch(function(err) {
                // FAILURE / ERROR
                console.error("Mic access denied: ", err);
                authMicBtn.style.display = "none";
                calibrationStatus.style.display = "block";
                calibrationStatus.innerText = ">> CRITICAL ERROR: MIC_ACCESS_DENIED [FALSE]";
                calibrationStatus.style.color = "#ef4444";
                
                // Dev bypass backup link
                calibrationStatus.style.cursor = "pointer";
                calibrationStatus.addEventListener("click", proceedToAct2);
            });
        }
    });

    // Cleaned up transition helper out of Act 1
    function proceedToAct2() {
        act1.classList.remove("fade-in-entry");
        act1.style.opacity = "0";
        act1.style.transition = "opacity 0.5s ease";
        
        setTimeout(() => {
            act1.classList.remove("active");
            
            // Bring Act II alive
            const act2 = document.getElementById("act-2");
            act2.classList.add("active", "fade-in-entry");
            
            console.log("Act 1 destroyed successfully. Initializing Act II structures...");
            initPuzzle(); // Now it will find this function cleanly!
        }, 500);
    }

    // ==========================================
    // ACT II: PUZZLE ENGINE LOGIC
    // ==========================================
    function initPuzzle() {
        // Create the initial array of indices
        currentOrder = [...correctOrder];
        
        // Scramble the array until it's genuinely mixed up
        do {
            currentOrder.sort(() => Math.random() - 0.5);
        } while (isPuzzleSolved()); // Ensure it doesn't accidentally start solved

        renderPuzzle();
    }

    function renderPuzzle() {
        puzzleContainer.innerHTML="";
        currentOrder.forEach((imageIndex, gridPosition) => {
            const tile = document.createElement("div");
            tile.classList.add("puzzle-tile");
            tile.dataset.gridPos = gridPosition;
            tile.dataset.imgIdx = imageIndex;
            
            tile.style.backgroundImage = `url('${imageSrc}')`;
            
           const tileWidth = 280 / 4;  // 70px per column
        const tileHeight = 210 / 4; // 52.5px per row
        
        const row = Math.floor(imageIndex / 4);
        const col = imageIndex % 4;
        
        // Calculate offsets using the separate width and height sizes
        const xOffset = -(col * tileWidth);
        const yOffset = -(row * tileHeight);
            
            tile.style.backgroundPosition = `${xOffset}px ${yOffset}px`;            // Click Handler to select and swap
            tile.addEventListener("click", () => handleTileClick(tile));
            
            puzzleContainer.appendChild(tile);
        }); 

                    puzzleContainer.appendChild(original_img);

    }

    revealBtn.addEventListener("click", () => {
        original_img.style.display = "block";
        setTimeout(() => {
            original_img.style.display = "none";
        }, 3000);

    })


    function handleTileClick(tile) {
        if (!selectedTile) {
            // First tile selected
            selectedTile = tile;
            selectedTile.style.borderColor = "#38bdf8"; // Highlight blue
            selectedTile.style.transform = "scale(0.95)";
        } else {
            // Second tile selected - perform the swap
            const pos1 = parseInt(selectedTile.dataset.gridPos);
            const pos2 = parseInt(tile.dataset.gridPos);
            
            // Swap indices in our tracking array
            let temp = currentOrder[pos1];
            currentOrder[pos1] = currentOrder[pos2];
            currentOrder[pos2] = temp;
            
            // Clear selection highlight
            selectedTile.style.borderColor = "transparent";
            selectedTile.style.transform = "scale(1)";
            selectedTile = null;
            
            // Re-render the grid with new positions
            renderPuzzle();
            
            // Check win state
            if (isPuzzleSolved()) {
                handlePuzzleWin();
                
            }
        }
    }

    function isPuzzleSolved() {
        return currentOrder.every((val, index) => val === correctOrder[index]);
    }

    function handlePuzzleWin() {
        dust.play();
        puzzleStatus.innerText = ">> DECRYPTION SUCCESSFUL !!";
        puzzleStatus.style.color = "#22c55e";
        puzzleContainer.style.gap = 0;
        puzzleContainer.style.borderColor = "green";
        
        // Disable further clicking
        puzzleContainer.style.pointerEvents = "none";
        
        // Brief pause to admire the completed image, then transition
        setTimeout(() => {
            const act2 = document.getElementById("act-2");
            act2.style.opacity = "0";
            act2.style.transition = "opacity 0.5s ease";
            
            setTimeout(() => {
                act2.classList.remove("active");
                console.log("Act 2 complete. Proceeding to Act 3: Lego Workshop...");
                const act3 = document.getElementById("act-3");
                if (act3) {
                    act3.classList.add("active", "fade-in-entry");
                }
            }, 500);
        }, 1500);
    }

    // ==========================================
    // ACT III: LEGO WORKSHOP STATE ENGINE
    // ==========================================
    let currentStep = 1;

    // Grab elements from DOM
    const workshopStepText = document.getElementById("workshop-step");
    const legoMessage = document.getElementById("lego-message");
    const legoText = document.getElementById("lego-text");
    const coin = document.getElementById("coin")


    // Bricks buttons
    const btnStem = document.getElementById("btn-stem");
    const btnLeaves = document.getElementById("btn-leaves");
    const btnPetals = document.getElementById("btn-petals");

    // Flower physical parts
    const partStem = document.getElementById("part-stem");
    const partLeaves = document.getElementById("part-leaves");
    const partPetals = document.getElementById("part-petals");

    // Step 1: Click the Stem
    btnStem.addEventListener("click", () => {
        if (currentStep !== 1) return;

        // Animate piece onto canvas
        partStem.classList.add("built");
        coin.play();
        // Update UI States
        btnStem.disabled = true;
        btnLeaves.disabled = false; // Unlock next brick
        
        // Reveal & type out narrative message
        legoMessage.style.display = "block";
        legoText.innerText = "> STAGE 01: Every beautiful bloom starts as a tiny spark beneath the surface. Just like you started on this world ! 🚀";
        workshopStepText.innerText = "Step 2: Attach the stabilizing foliage elements...";
        
        currentStep = 2;
    });

    // Step 2: Click the Leaves
    btnLeaves.addEventListener("click", () => {
        if (currentStep !== 2) return;

        partLeaves.classList.add("built");
        coin.play();
        btnLeaves.disabled = true;
        btnPetals.disabled = false; // Unlock final piece
        
        legoText.innerText = "> STAGE 02: Branching out bringing so much life and energy wherever you go, growing stronger every single year. 🍃✨";
        workshopStepText.innerText = "Step 3: Snap the core gift component to the crown slot...";
        
        currentStep = 3;
    });

          // Step 3: Click the Petals (Now transitions to Act 4 Candle)
    btnPetals.addEventListener("click", () => {
        if (currentStep !== 3) return;

        partPetals.classList.add("built");
        coin.play();
        btnPetals.disabled = true;
        
        legoText.innerText = "> STAGE 03: You asked me for flowers... So I built you some that will never die. 🌷✨";
        workshopStepText.innerText = "REDIRECTING PROTOCOL...";
        workshopStepText.style.color = "#22c55e";

        // Transition to Act 4 Cake instead of the finale dashboard
        setTimeout(initializeCakeScene, 2000);
    });

    // ==========================================
    // ACT IV: INTERACTIVE MIC AUDIO ANALYZER
    // ==========================================
    function initializeCakeScene() {
        const cake = document.getElementById("cake")

        const act3 = document.getElementById("act-3");
        act3.style.opacity = "0";
        act3.style.transition = "opacity 0.5s ease";
        
        setTimeout(() => {
            act3.classList.remove("active");
            
            const act4 = document.getElementById("act-4");
            act4.classList.add("active", "fade-in-entry");
            bg_audio.volume = 0;

            
            // Activate mic data listening stream
            startCandleAudioMonitor();
        }, 2500);
    }

    function startCandleAudioMonitor() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log("Audio contexts unsupported. Implementing click fallback bypass.");
            setupCandleFallback();
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.3;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            const micBar = document.getElementById("mic-bar");
            const flame = document.getElementById("flame");
            let candleBlown = false;

            javascriptNode.onaudioprocess = () => {
                if (candleBlown) return;

                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                let values = 0;

                for (let i = 0; i < array.length; i++) {
                    values += array[i];
                }

                // Calculate average decibel volume level percentage
                const averageVolume = values / array.length;
                const visualPercentage = Math.min(100, (averageVolume / 15) * 100);
                
                // Update UI bar graph indicator
                if (micBar) micBar.style.width = `${visualPercentage}%`;

                // Blow Threshold validation (If average volume crosses a sharp sound peak)
                if (averageVolume > 15) { 
                    candleBlown = true;
                    cake.play();
                    
                    // Kill audio processing tracks immediately to secure hardware
                    stream.getTracks().forEach(track => track.stop());
                    javascriptNode.onaudioprocess = null;
                    audioContext.close();

                    // Animate flame out
                    flame.classList.add("dead");
                    document.getElementById("candle-subtitle").innerText = "Wish received. Loading system layout...";
                    document.getElementById("candle-subtitle").style.color = "#22c55e";
                    if (micBar) micBar.style.width = "0%";

                    // Transition to the final Act 5 birthday splash card
                    setTimeout(triggerBirthdayFinale, 2000);
                }
            };
        })
        .catch(err => {
            console.error("Mic access failure inside Act 4:", err);
            setupCandleFallback();
        });
    }

    // Safety fallback click layer if permissions freeze up or on restricted mobile platforms
    function setupCandleFallback() {
        const flame = document.getElementById("flame");
        const statusText = document.getElementById("candle-subtitle");
        statusText.innerText = "(Tap the flame to make your wish!)";
        statusText.style.cursor = "pointer";
        
        statusText.addEventListener("click", () => {
            flame.classList.add("dead");
            setTimeout(triggerBirthdayFinale, 1500);
        });
    }

    // ==========================================
    // ACT V: THE SURPRISE FINALE DASHBOARD
    // ==========================================
    function triggerBirthdayFinale() {
        const act4 = document.getElementById("act-4");
        act4.style.opacity = "0";
        act4.style.transition = "opacity 0.5s ease";
        bg_audio.volume = 1;
        

        
        setTimeout(() => {
            act4.classList.remove("active");
            
            // Display the final system card block
            const act5 = document.getElementById("act-5");
            if (act5) {
                act5.classList.add("active", "fade-in-entry");
            }
        }, 500);
    }

    // Action listener for the final gift card container reveal button
    const giftBtn = document.getElementById("gift-btn");
    const giftLocation = document.getElementById("gift-location");

    if (giftBtn && giftLocation) {
        giftBtn.addEventListener("click", () => {
            giftBtn.style.display = "none";
            giftLocation.style.display = "block";
            giftLocation.innerText = ">> PACKAGE SECURED // Check your delivery updates or inbox for the secret tracking code! 🎁📦";
        });
    }
});