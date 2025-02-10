// Disable right-click context menu.
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

(function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // ---------------------
    // AUDIO SETUP (Web Audio API)
    // ---------------------
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    function playGunshotSound() {
        const bufferSize = audioCtx.sampleRate * 0.1;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 800;
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        whiteNoise.start();
        whiteNoise.stop(audioCtx.currentTime + 0.1);
    }

    function playRocketLaunchSound() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "sawtooth";
        oscillator.frequency.value = 200; // A lower-pitched tone for rocket launch.
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }
      
    function playExplosionSound() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "triangle";
        oscillator.frequency.value = 50;
        gainNode.gain.setValueAtTime(0.7, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    }
      
    function playZombieHitSound() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = 150;
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    }

    function playZombieHeadshotSound() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "square";
        oscillator.frequency.value = 80;
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    function playBombSound() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(120, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.7, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    }

    function playSpeedSound() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "triangle";
        oscillator.frequency.value = 300;
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
    }

    function playCurrencyPickupSound() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = 300;
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    // New Laser Sound
    function playLaserSound() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "sawtooth";
        oscillator.frequency.value = 500;
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    }

    function playReloadStartSound() {
        const now = audioCtx.currentTime;
        // Harsh "shook" part using a sawtooth wave:
        let osc1 = audioCtx.createOscillator();
        let gain1 = audioCtx.createGain();
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(100, now);
        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.08);

        // Harsh "sheek" part using a square wave:
        let osc2 = audioCtx.createOscillator();
        let gain2 = audioCtx.createGain();
        osc2.type = "square";
        osc2.frequency.setValueAtTime(400, now + 0.1);
        gain2.gain.setValueAtTime(0.4, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.18);
    }

    function playReloadEndSound() {
        const now = audioCtx.currentTime;
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = "sawtooth";  // using sawtooth for a grittier, harsher tone
        osc.frequency.setValueAtTime(200, now);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    // ---------------------
    // GLOBAL VARIABLES & STATE
    // ---------------------
    let zombieKills = 0;
    let gameStartTime = 0;
    let totalPausedTime = 0;   // Accumulates total pause duration
    let pauseStartTime = 0;    // Records when a pause starts

    let gameOver = false;
    // Game states: "menu", "playing", "paused", "shop"
    let gameState = "menu";
    // Game modes: "normal", "god", "test"
    let gameMode = "normal";

    let mouseDown = false;
    let particles = [];
    let autoReloadScheduled = false;
    let decapitatedHeads = [];
    let detachedLimbs = []; // NEW global array for detached zombie limbs
    let currencyDrops = [];

    // For continuous flame sound.
    let flameSoundOscillator = null;
    let flameSoundGain = null;

    // --- SHOP VARIABLES ---
    let shopThreshold = 100; // First shop opens at 100 kills.
    let shopOpen = false;
    let shopPriceMultiplier = 1.0; // Increases each shop round.

    // --- Freeze Effect: When shop (or test menu) is open, game simulation freezes.
    let freezeEndTime = 0;

    // ---------------------
    // PLAYER CONFIGURATION (with upgrade properties)
    // ---------------------
    let player = {
        x: width / 2,
        y: height / 2,
        baseSpeed: 3,
        speed: 3,
        angle: 0,
        radius: 20,
        ammo: 6,
        magazine: 6,
        reloadTime: 2000,
        reloading: false,
        reloadStart: 0,
        recoil: 0,
        walkCycle: 0,
        powerUps: {},
        weapon: "pistol",
        lastShotTime: 0,
        activeGun: { type: null, ammo: 0 },
        money: 0,
        lives: 1,
        invulnerableUntil: 0,
        moneyMagnet: false,
        // Upgrade properties:
        rapidFireLevel: 0,
        damageMultiplier: 1,
        healthRegenRate: 0,
        extraArmor: 0,
        critChance: 0,
        explosiveRounds: false,
        scoreMultiplier: 1,
        lastRegenTime: Date.now(),
        // Crossbow properties:
        crossbowAmmo: 5,
        crossbowReloading: false,
        crossbowReloadTime: 1500,
        crossbowReloadStart: 0,
        // Laser weapon properties:
        laserCooldown: 0,
        laserAmmo: 100,
        rocketAmmo: 5
    };

    // ---------------------
    // BULLETS, ZOMBIES, POWER-UPS, LASER BEAMS
    // ---------------------
    let bullets = [];
    let zombies = [];
    let powerUps = [];
    let laserBeams = [];  // Array to hold active laser beam effects.

    // Include "laser" as a power‑up type.
    const powerUpTypes = ["shield", "machineGun", "shotgun", "speed", "bomb", "extraAmmo", "slowMotion", "laser"];
    const powerUpColors = { shield: "blue", machineGun: "darkgray", shotgun: "saddlebrown", speed: "orange", bomb: "black", extraAmmo: "gold", slowMotion: "purple", laser: "cyan" };
    const powerUpNames = { shield: "Shield", machineGun: "Machine Gun", shotgun: "Shotgun", speed: "Speed", bomb: "Bomb", extraAmmo: "Extra Ammo", slowMotion: "Slow Motion", laser: "Laser Rifle" };

    // ---------------------
    // SHOP ITEMS (and now also used for test mode)
    // ---------------------
    const availableShopItems = [
        { id: "extraHealth", name: "Extra Health", description: "Gain an extra life.", price: 0, effect: function () { player.lives++; } },
        { id: "moneyMagnet", name: "Money Magnet", description: "Automatically collects money within 50px.", price: 0, effect: function () { player.moneyMagnet = true; } },
        { id: "extraArmor", name: "Extra Armor Upgrade", description: "Absorb one extra hit.", price: 0, effect: function () { player.extraArmor++; } },
        { id: "rapidFire", name: "Rapid Fire Upgrade", description: "Increase your fire rate permanently.", price: 0, effect: function () { player.rapidFireLevel++; } },
        { id: "damageBoost", name: "Damage Boost", description: "Increase your bullet damage.", price: 0, effect: function () { player.damageMultiplier += 0.25; } },
        { id: "ammoCapacity", name: "Ammo Capacity Upgrade", description: "Increase your magazine size.", price: 0, effect: function () { player.magazine += 3; player.ammo = player.magazine; } },
        { id: "healthRegen", name: "Health Regeneration", description: "Gain extra life every 5 seconds.", price: 0, effect: function () { player.healthRegenRate += 1; } },
        { id: "explosiveRounds", name: "Explosive Rounds", description: "Bullets cause splash damage.", price: 0, effect: function () { player.explosiveRounds = true; } },
        { id: "freezeGrenade", name: "Freeze Grenade", description: "Slow all zombies for 5 seconds.", price: 0, effect: function () { freezeEndTime = Date.now() + 5000; } },
        { id: "critChance", name: "Critical Hit Upgrade", description: "Increase chance for critical hits.", price: 0, effect: function () { player.critChance += 0.05; } },
        // FIXED the scoreMultiplier case by assigning base:
        { id: "scoreMultiplier", name: "Score Multiplier", description: "Double money earned for 10 seconds.", price: 0, effect: function () { player.scoreMultiplier = 2; setTimeout(() => { player.scoreMultiplier = 1; }, 10000); } }
    ];

    // ---------------------
    // INPUT EVENTS
    // ---------------------
    let keys = {};
    let mouse = { x: width / 2, y: height / 2 };

    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.key === "r" || e.key === "R") reloadGun();
        if (e.key === "Escape") {
            if (gameState === "playing") {
                gameState = "paused";
                pauseStartTime = Date.now();  // Record when pause starts
                document.getElementById("pauseMenuOverlay").style.display = "flex";
                document.getElementById("instructions").style.display = "block";
            } else if (gameState === "paused") {
                gameState = "playing";
                totalPausedTime += (Date.now() - pauseStartTime);  // Add the pause duration
                pauseStartTime = 0;
                document.getElementById("pauseMenuOverlay").style.display = "none";
                document.getElementById("instructions").style.display = "none";
            }
        }
    });

    document.addEventListener('keyup', (e) => { keys[e.key] = false; });
    canvas.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    canvas.addEventListener('mousedown', () => {
        mouseDown = true;
        // If using the pistol and currently reloading, try to trigger quick reload.
        if (player.weapon === "pistol" && player.reloading) {
            attemptQuickReload();
        } else if (player.weapon !== "machineGun" && player.weapon !== "flamethrower" && player.weapon !== "laser") {
            shootWeapon();
        }
    });

    canvas.addEventListener('mouseup', () => { mouseDown = false; });

    document.getElementById('restartButton').addEventListener('click', () => { location.reload(); });

    // ---------------------
    // UI Overlay Event Listeners
    // ---------------------
    document.getElementById("startGameButton").addEventListener("click", () => {
        // Set game start time when the game begins and reset paused time.
        gameStartTime = Date.now();
        totalPausedTime = 0;
      
        if (canvas.requestFullscreen) canvas.requestFullscreen();
        else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
        else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();
      
        gameState = "playing";
        document.getElementById("mainMenuOverlay").style.display = "none";
        document.getElementById("modesMenuOverlay").style.display = "none";
        document.getElementById("instructions").style.display = "none";  // hide controls overlay when game starts
      
        if (gameMode === "test") {
          document.getElementById("weaponSelectionOverlay").style.display = "block";
          document.getElementById("weaponSelectButton").style.display = "block";
          document.getElementById("testModeMenuButton").style.display = "block";
        }
    });
      
    document.getElementById("modesButton").addEventListener("click", () => {
        document.getElementById("mainMenuOverlay").style.display = "none";
        document.getElementById("modesMenuOverlay").style.display = "block";
    });
    document.getElementById("exitGameButton").addEventListener("click", () => {
        window.close();
        alert("Exiting game (simulate).");
    });

    document.getElementById("normalModeButton").addEventListener("click", () => {
        gameMode = "normal";
        document.getElementById("modesMenuOverlay").style.display = "none";
        document.getElementById("mainMenuOverlay").style.display = "block";
        document.getElementById("weaponSelectButton").style.display = "none";
        document.getElementById("testModeMenuButton").style.display = "none";
    });
    document.getElementById("godModeButton").addEventListener("click", () => {
        gameMode = "god";
        document.getElementById("modesMenuOverlay").style.display = "none";
        document.getElementById("mainMenuOverlay").style.display = "block";
        document.getElementById("weaponSelectButton").style.display = "none";
        document.getElementById("testModeMenuButton").style.display = "none";
    });
    document.getElementById("testModeButton").addEventListener("click", () => {
        gameMode = "test";
        document.getElementById("modesMenuOverlay").style.display = "none";
        document.getElementById("mainMenuOverlay").style.display = "block";
        document.getElementById("weaponSelectButton").style.display = "block";
        document.getElementById("testModeMenuButton").style.display = "block";
    });
    document.getElementById("backToMainFromModes").addEventListener("click", () => {
        document.getElementById("modesMenuOverlay").style.display = "none";
        document.getElementById("mainMenuOverlay").style.display = "block";
    });

    document.getElementById("resumeGameButton").addEventListener("click", () => {
        gameState = "playing";
        totalPausedTime += (Date.now() - pauseStartTime);
        pauseStartTime = 0;
        document.getElementById("pauseMenuOverlay").style.display = "none";
        document.getElementById("instructions").style.display = "none";
    });

    document.getElementById("toggleGodModeButton").addEventListener("click", () => {
        gameMode = (gameMode === "god") ? "normal" : "god";
        if (gameMode === "god") {
            document.getElementById("weaponSelectButton").style.display = "none";
            document.getElementById("testModeMenuButton").style.display = "none";
        }
    });
    document.getElementById("toggleTestModeButton").addEventListener("click", () => {
        gameMode = (gameMode === "test") ? "normal" : "test";
        document.getElementById("weaponSelectButton").style.display = (gameMode === "test") ? "block" : "none";
        document.getElementById("testModeMenuButton").style.display = (gameMode === "test") ? "block" : "none";
    });

    document.getElementById("saveGameButton").addEventListener("click", saveGame);
    document.getElementById("loadGameButton").addEventListener("click", loadGame);
    document.getElementById("mainMenuButton").addEventListener("click", () => { location.reload(); });
    document.getElementById("exitGamePauseButton").addEventListener("click", () => {
        window.close();
        alert("Exiting game (simulate).");
    });
    document.getElementById("weaponSelectButton").addEventListener("click", () => {
        document.getElementById("weaponSelectionOverlay").style.display = "block";
    });

    // Test Mode Menu button (only visible in test mode)
    document.getElementById("testModeMenuButton").addEventListener("click", openTestModeMenu);

    // Add event listener to close the Shop overlay when the close button is clicked.
    document.getElementById("closeShopButton").addEventListener("click", closeShop);

    // Weapon Selection Overlay (for Test Mode)
    const weaponOptions = document.querySelectorAll(".weaponOption");
    weaponOptions.forEach(option => {
        option.addEventListener("click", (e) => {
            let selectedWeapon = e.target.getAttribute("data-weapon");
            player.weapon = selectedWeapon;
            if (selectedWeapon === "machineGun") {
                player.activeGun = { type: "machineGun", ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 50 };
            } else if (selectedWeapon === "shotgun") {
                player.activeGun = { type: "shotgun", ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 20 };
            } else if (selectedWeapon === "flamethrower") {
                player.activeGun = { type: "flamethrower", fuel: 100 };
            } else if (selectedWeapon === "laser") {
                // When selecting laser, reset its ammo capacity
                player.weapon = "laser";
                player.laserAmmo = 100;
                // Continuous firing for laser is now handled in update()
            }
            // **** Add Rocket Launcher Option ****
            else if (selectedWeapon === "rocketLauncher") {
                player.weapon = "rocketLauncher";
                player.rocketAmmo = (gameMode === "test" || gameMode === "god") ? Infinity : 3;
            }
            else {
                // For pistol and crossbow, no activeGun object is used.
                player.activeGun = { type: null, ammo: 0 };
            }
            document.getElementById("weaponSelectionOverlay").style.display = "none";
        });
    });
    document.getElementById("resetWeaponButton").addEventListener("click", () => {
        player.weapon = "pistol";
        player.activeGun = { type: null, ammo: 0 };
    });
    document.getElementById("closeWeaponSelectionButton").addEventListener("click", () => {
        document.getElementById("weaponSelectionOverlay").style.display = "none";
    });

    // ---------------------
    // SAVE / LOAD FUNCTIONS
    // ---------------------
    function saveGame() {
        const stateToSave = {
            player: player,
            zombieKills: zombieKills,
            gameStartTime: gameStartTime,
            gameMode: gameMode,
            bullets: bullets,
            zombies: zombies,
            powerUps: powerUps,
            currencyDrops: currencyDrops,
            decapitatedHeads: decapitatedHeads
        };
        localStorage.setItem("zombieShooterSave", JSON.stringify(stateToSave));
        alert("Game Saved!");
    }

    function loadGame() {
        const saved = localStorage.getItem("zombieShooterSave");
        if (!saved) { alert("No saved game found."); return; }
        const state = JSON.parse(saved);
        player = state.player;
        zombieKills = state.zombieKills;
        gameStartTime = state.gameStartTime;
        gameMode = state.gameMode;
        bullets = state.bullets;
        zombies = state.zombies;
        powerUps = state.powerUps;
        currencyDrops = state.currencyDrops;
        decapitatedHeads = state.decapitatedHeads;
        gameState = "playing";
        document.getElementById("pauseMenuOverlay").style.display = "none";
        alert("Game Loaded!");
    }

    // ---------------------
    // SHOP FUNCTIONS
    // ---------------------
    function showShop() {
        shopOpen = true;
        gameState = "shop"; // Freeze simulation while shop is open.
        let items = availableShopItems.slice();
        items.sort(() => Math.random() - 0.5);
        // For shop, pick 3 random items.
        items = items.slice(0, 3);
        items.forEach(item => {
            let base;
            switch (item.id) {
                case "extraHealth": base = 25; break;
                case "moneyMagnet": base = 25; break;
                case "extraArmor": base = 23; break;
                case "rapidFire": base = 10; break;
                case "damageBoost": base = 20; break;
                case "ammoCapacity": base = 20; break;
                case "healthRegen": base = 50; break;
                case "explosiveRounds": base = 50; break;
                case "freezeGrenade": base = 50; break;
                case "critChance": base = 25; break;
                case "scoreMultiplier": base = 20; break;  // FIXED assignment here.
                default: base = 1;
            }
            item.price = Math.floor(base * shopPriceMultiplier);
        });
        let shopOverlay = document.getElementById("shopOverlay");
        let container = document.getElementById("shopItemsContainer");
        container.innerHTML = "";
        items.forEach(item => {
            let btn = document.createElement("button");
            btn.innerHTML = item.name + " - $" + item.price + "<br>" + item.description;
            btn.style.display = "block";
            btn.style.margin = "10px auto";
            btn.addEventListener("click", () => {
                if (player.money >= item.price) {
                    player.money -= item.price;
                    item.effect();
                    closeShop();
                } else {
                    alert("Not enough money!");
                }
            });
            container.appendChild(btn);
        });
        shopOverlay.style.display = "block";
    }

    function closeShop() {
        document.getElementById("shopOverlay").style.display = "none";
        shopOpen = false;
        gameState = "playing";
        shopThreshold *= 2;
        shopPriceMultiplier *= 1.2;
    }

    // ---------------------
    // TEST MODE MENU FUNCTIONS
    // ---------------------
    function openTestModeMenu() {
        let container = document.getElementById("testModeItemsContainer");
        container.innerHTML = "";
        availableShopItems.forEach(item => {
            let btn = document.createElement("button");
            btn.innerHTML = "Test: " + item.name + "<br>" + item.description;
            btn.style.display = "block";
            btn.style.margin = "5px auto";
            btn.addEventListener("click", () => {
                item.effect();
                alert(item.name + " effect applied.");
            });
            container.appendChild(btn);
        });
        document.getElementById("testModeMenuOverlay").style.display = "block";
    }

    document.getElementById("closeTestModeMenuButton").addEventListener("click", () => {
        document.getElementById("testModeMenuOverlay").style.display = "none";
    });

    document.getElementById("resetTestUpgradesButton").addEventListener("click", () => {
        player.rapidFireLevel = 0;
        player.damageMultiplier = 1;
        player.healthRegenRate = 0;
        player.extraArmor = 0;
        player.critChance = 0;
        player.explosiveRounds = false;
        player.scoreMultiplier = 1;
        alert("Upgrades have been reset.");
    });

    // ---------------------
    // PARTICLE SYSTEM FUNCTIONS
    // ---------------------
    function spawnParticle(x, y, vx, vy, size, life, color) {
        if (particles.length > 500) return;
        particles.push({ x, y, vx, vy, size, life, maxLife: life, color });
    }

    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            if (p.life <= 0) particles.splice(i, 1);
        }
    }

    function drawParticles() {
        for (let p of particles) {
            let alpha = p.life / p.maxLife;
            ctx.fillStyle = p.color.replace("ALPHA", alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // ---------------------
    // FLAMETHROWER HELPER FUNCTIONS
    // ---------------------
    function spawnFlameParticles() {
        let muzzleX = player.x + Math.cos(player.angle) * 20;
        let muzzleY = player.y + Math.sin(player.angle) * 20;
        for (let i = 0; i < 5; i++) {
            let angle = player.angle + (Math.random() - 0.5) * 0.3;
            let speed = 2 + Math.random() * 2;
            let vx = Math.cos(angle) * speed;
            let vy = Math.sin(angle) * speed;
            spawnParticle(muzzleX, muzzleY, vx, vy, 3, 30, "rgba(255,165,0,ALPHA)");
        }
    }

    function spawnFlameBullets() {
        let muzzleX = player.x + Math.cos(player.angle) * 20;
        let muzzleY = player.y + Math.sin(player.angle) * 20;
        let bulletSpeed = 20;
        for (let i = 0; i < 2; i++) {
            let spread = (Math.random() - 0.5) * 0.2;
            let angle = player.angle + spread;
            let bullet = {
                x: muzzleX,
                y: muzzleY,
                dx: Math.cos(angle) * bulletSpeed,
                dy: Math.sin(angle) * bulletSpeed,
                spawnTime: Date.now(),
                source: "flamethrower",
                startX: muzzleX,
                startY: muzzleY
            };
            bullets.push(bullet);
        }
    }

    function playFlameSound() {
        if (!flameSoundOscillator) {
            flameSoundOscillator = audioCtx.createOscillator();
            flameSoundGain = audioCtx.createGain();
            flameSoundOscillator.type = "sine";
            flameSoundOscillator.frequency.setValueAtTime(60, audioCtx.currentTime);
            flameSoundGain.gain.setValueAtTime(0.02, audioCtx.currentTime);
            flameSoundOscillator.connect(flameSoundGain);
            flameSoundGain.connect(audioCtx.destination);
            flameSoundOscillator.start();
        }
    }

    function stopFlameSound() {
        if (flameSoundOscillator) {
            flameSoundOscillator.stop();
            flameSoundOscillator.disconnect();
            flameSoundGain.disconnect();
            flameSoundOscillator = null;
            flameSoundGain = null;
        }
    }

    // ---------------------
    // CURRENCY SYSTEM FUNCTIONS
    // ---------------------
    function maybeDropCurrency(x, y, isElite) {
        const dropChance = 0.5;
        if (Math.random() < dropChance) {
            let type, value;
            if (isElite && Math.random() < 0.3) { type = "diamond"; value = 5; }
            else { type = "dollar"; value = 1; }
            value = Math.floor(value * player.scoreMultiplier);
            currencyDrops.push({ x, y, type, value, radius: 15, spawnTime: Date.now() });
        }
    }

    function updateCurrencyDrops() {
        for (let i = currencyDrops.length - 1; i >= 0; i--) {
            let drop = currencyDrops[i];
            if (Date.now() - drop.spawnTime > 6000) { currencyDrops.splice(i, 1); continue; }
            let pickupThreshold = player.moneyMagnet ? 50 : (player.radius + drop.radius);
            if (distance(player.x, player.y, drop.x, drop.y) < pickupThreshold) {
                player.money += drop.value;
                playCurrencyPickupSound();
                currencyDrops.splice(i, 1);
            }
        }
    }

    function drawCurrencyDrops() {
        ctx.save();
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let drop of currencyDrops) {
            if (drop.type === "dollar") { ctx.fillStyle = "green"; ctx.fillText("$", drop.x, drop.y); }
            else if (drop.type === "diamond") {
                ctx.font = "30px sans-serif";
                let grad = ctx.createLinearGradient(drop.x, drop.y - 20, drop.x, drop.y + 20);
                grad.addColorStop(0, "white");
                grad.addColorStop(0.5, "cyan");
                grad.addColorStop(1, "white");
                ctx.fillStyle = grad;
                ctx.fillText("♦", drop.x, drop.y);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "darkblue";
                ctx.strokeText("♦", drop.x, drop.y);
                ctx.font = "20px sans-serif";
            }
        }
        ctx.restore();
    }

    // ---------------------
    // GUN / WEAPON FUNCTIONS
    // ---------------------
    const baseMachineGunFireInterval = 100;

    function activatePowerUp(type) {
        // If a machine gun or shotgun power-up is picked up, switch weapon (even if currently using laser)
        if (type === "machineGun" || type === "shotgun") {
            if (type === "machineGun") {
                player.activeGun = { type: "machineGun", ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 50 };
                player.weapon = "machineGun";
            } else {
                player.activeGun = { type: "shotgun", ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 20 };
                player.weapon = "shotgun";
            }
            return;
        }
        switch (type) {
            case "shield":
                player.powerUps.shield = Date.now() + 5000;
                break;
            case "speed":
                player.powerUps.speed = Date.now() + 5000;
                playSpeedSound();
                break;
            case "bomb":
                playBombSound();
                zombies.forEach(z => {
                    if (!z.dying) {
                        zombieKills++;
                        z.dying = true;
                        z.deathTimer = 60;
                        z.initialDeathTimer = 60;
                        z.fallAngle = 0;
                        z.fallVector = { dx: 0, dy: 2 };
                        spawnBloodSplatter(z.x, z.y);
                        if (!z.currencyDropped) { maybeDropCurrency(z.x, z.y, z.elite); z.currencyDropped = true; }
                    }
                });
                break;
            case "extraAmmo":
                player.ammo = player.magazine;
                player.reloading = false;
                break;
            case "slowMotion":
                player.powerUps.slowMotion = Date.now() + 5000;
                break;
            // Laser pickup: When collected, switch the weapon to laser and refill its ammo.
            case "laser":
                player.weapon = "laser";
                player.laserAmmo = 100;
                break;
            default:
                break;
        }
    }

    function shootWeapon() {
        if (gameOver || gameState !== "playing") return;
        // Laser is now handled continuously in update()
        if (player.weapon === "laser") return;
        let bulletSpeed = 15;
        let angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
        if (player.weapon === "pistol") {
            if (player.reloading) return;
            // If not in god/test mode and no ammo remains, trigger a reload
            if (!(gameMode === "god" || gameMode === "test") && player.ammo <= 0) {
                reloadGun();
                return;
            }
            let bullet = {
                x: player.x,
                y: player.y,
                dx: Math.cos(angle) * bulletSpeed,
                dy: Math.sin(angle) * bulletSpeed,
                spawnTime: Date.now(),
                source: "pistol"
            };
            bullets.push(bullet);
            if (!(gameMode === "god" || gameMode === "test")) {
                player.ammo--;
            }
            playGunshotSound();
            player.lastShotTime = Date.now();
        } else if (player.weapon === "machineGun") {
            if (!player.activeGun || player.activeGun.ammo <= 0) {
                player.activeGun = { type: null, ammo: 0 };
                player.weapon = "pistol";
                return;
            }
            let bullet = { x: player.x, y: player.y, dx: Math.cos(angle) * bulletSpeed, dy: Math.sin(angle) * bulletSpeed, spawnTime: Date.now(), source: "machineGun" };
            bullets.push(bullet);
            if (!(gameMode === "god" || gameMode === "test")) { player.activeGun.ammo--; }
            playGunshotSound();
            if (player.activeGun.ammo <= 0) { player.activeGun = { type: null, ammo: 0 }; player.weapon = "pistol"; }
            player.lastShotTime = Date.now();
        } else if (player.weapon === "shotgun") {
            if (!player.activeGun || player.activeGun.ammo <= 0) {
                player.activeGun = { type: null, ammo: 0 };
                player.weapon = "pistol";
                return;
            }
            let offsets = [-Math.PI / 12, -Math.PI / 24, 0, Math.PI / 24, Math.PI / 12];
            for (let offset of offsets) {
                let newAngle = angle + offset;
                let bullet = { x: player.x, y: player.y, dx: Math.cos(newAngle) * bulletSpeed, dy: Math.sin(newAngle) * bulletSpeed, spawnTime: Date.now(), source: "shotgun" };
                bullets.push(bullet);
            }
            if (!(gameMode === "god" || gameMode === "test")) { player.activeGun.ammo--; }
            playGunshotSound();
            if (player.activeGun.ammo <= 0) { player.activeGun = { type: null, ammo: 0 }; player.weapon = "pistol"; }
            player.lastShotTime = Date.now();
        }
        // **** Add Rocket Launcher Branch ****
        else if (player.weapon === "rocketLauncher") {
            if (player.rocketAmmo <= 0) {
                // Switch back to pistol if out of rocket ammo
                player.weapon = "pistol";
                return;
            }
            let rocketSpeed = 10; // Rockets are slower than pistol bullets.
            let rocket = {
              x: player.x,
              y: player.y,
              dx: Math.cos(angle) * rocketSpeed,
              dy: Math.sin(angle) * rocketSpeed,
              spawnTime: Date.now(),
              source: "rocket"
            };
            bullets.push(rocket);
            player.rocketAmmo--;
            playRocketLaunchSound();
            spawnParticle(
              player.x + Math.cos(angle) * 20,
              player.y + Math.sin(angle) * 20,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
              8,
              15,
              "rgba(255,140,0,ALPHA)"
            );
            player.lastShotTime = Date.now();
        }
        // New Crossbow branch
        else if (player.weapon === "crossbow") {
            if (player.crossbowReloading) return;
            if (player.crossbowAmmo <= 0) return;
            let bulletSpeed = 20;
            let angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
            let bolt = { x: player.x, y: player.y, dx: Math.cos(angle) * bulletSpeed, dy: Math.sin(angle) * bulletSpeed, spawnTime: Date.now(), source: "crossbow" };
            bullets.push(bolt);
            player.crossbowAmmo--;
            player.crossbowReloading = true;
            player.crossbowReloadStart = Date.now();
            setTimeout(() => { player.crossbowReloading = false; }, player.crossbowReloadTime);
            playGunshotSound();
            player.lastShotTime = Date.now();
        }
    }

    function reloadGun() {
        if (gameMode === "god" || gameMode === "test") return;
        if (!player.reloading && player.weapon === "pistol" && player.ammo < player.magazine) {
            player.reloading = true;
            player.reloadStart = Date.now();
            // Initialize the reload duration to the base reload time.
            player.reloadDuration = player.reloadTime;  // e.g., 2000 ms
            // No penalty is active at the start.
            player.penaltyActive = false;
            autoReloadScheduled = false;
            playReloadStartSound();
        }
    }

    function attemptQuickReload() {
        if (!player.reloading) return;

        let reloadElapsed = Date.now() - player.reloadStart;
        let progress = reloadElapsed / player.reloadDuration;
        const QUICK_RELOAD_ZONE_START = 0.3;
        const QUICK_RELOAD_ZONE_END = 0.4;

        if (player.penaltyActive) {
            console.log("Reload penalty active, wait for reload to complete.");
            return;
        }

        if (progress >= QUICK_RELOAD_ZONE_START && progress <= QUICK_RELOAD_ZONE_END) {
            player.ammo = player.magazine;
            player.reloading = false;
            player.penaltyActive = false;
            playReloadEndSound();
            console.log("Quick Reload Successful!");
        } else {
            if (progress < QUICK_RELOAD_ZONE_START) {
                console.log("Quick Reload Failed: Too early. Penalty applied.");
                player.reloadStart = Date.now();
                player.reloadDuration += 500;
            } else if (progress > QUICK_RELOAD_ZONE_END) {
                console.log("Quick Reload Failed: Too late. Penalty applied.");
                let targetElapsed = player.reloadDuration * QUICK_RELOAD_ZONE_START;
                player.reloadStart = Date.now() - targetElapsed;
                player.reloadDuration += 1000;
            }
            player.penaltyActive = true;
        }
    }

    // ---------------------
    // ZOMBIE SPAWNING
    // ---------------------
    setInterval(spawnZombie, 1000);
    function spawnZombie() {
        if (gameOver || gameState !== "playing") return;
        if (gameOver) return;
        let side = Math.floor(Math.random() * 4);
        let x, y;
        const offset = 30;
        if (side === 0) { x = Math.random() * width; y = -offset; }
        else if (side === 1) { x = width + offset; y = Math.random() * height; }
        else if (side === 2) { x = Math.random() * width; y = height + offset; }
        else { x = -offset; y = Math.random() * height; }
        const zombieSpeed = 0.5 + Math.random() * 2;
        let zombie = {
            x, y,
            speed: zombieSpeed,
            radius: 20,
            dying: false,
            deathTimer: 30,
            initialDeathTimer: 30,
            crawling: false,
            walkCycle: Math.random() * Math.PI * 2,
            health: 1,
            headDecapitated: false,
            leftArmDetached: false,    // NEW: left arm status
            rightArmDetached: false,   // NEW: right arm status
            currencyDropped: false
        };
        if (Math.random() < 0.1) { zombie.elite = true; zombie.health = 3; }
        else { zombie.elite = false; zombie.health = 1; }
        zombies.push(zombie);
    }

    // ---------------------
    // POWER‑UP SPAWNING
    // ---------------------
    setInterval(spawnPowerUp, 10000);
    function spawnPowerUp() {
        if (gameOver || gameState !== "playing") return;
        if (gameOver) return;
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        const margin = 50;
        const x = margin + Math.random() * (width - 2 * margin);
        const y = margin + Math.random() * (height - 2 * margin);
        powerUps.push({ type, x, y, radius: 15, spawnTime: Date.now() });
    }

    // ---------------------
    // UTILITY FUNCTION
    // ---------------------
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    // ---------------------
    // BLOOD SPLATTER EFFECT
    // ---------------------
    function spawnBloodSplatter(x, y) {
        const count = 10;
        for (let i = 0; i < count; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = Math.random() * 4;
            spawnParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 2 + Math.random() * 2, 30, "rgba(220,20,60,ALPHA)");
        }
    }

    // ---------------------
    // ROCKET EXPLOSION LOGIC
    // ---------------------
    function explodeRocket(rocket) {
        let dx = mouse.x - rocket.x;
        let dy = mouse.y - rocket.y;
        let explosionRadius = Math.min(50 + Math.sqrt(dx * dx + dy * dy) / 10, 150);
        
        zombies.forEach((z) => {
          if (!z.dying && distance(rocket.x, rocket.y, z.x, z.y) <= explosionRadius + z.radius) {
            zombieKills++;
            z.dying = true;
            z.deathTimer = 60;
            z.initialDeathTimer = 60;
            let impactDx = z.x - rocket.x;
            let impactDy = z.y - rocket.y;
            let mag = Math.sqrt(impactDx * impactDx + impactDy * impactDy);
            if (mag === 0) mag = 1;
            impactDx /= mag;
            impactDy /= mag;
            z.fallVector = { dx: impactDx * 5, dy: impactDy * 5 };
            z.fallAngle = Math.atan2(impactDy, impactDx);
            spawnBloodSplatter(z.x, z.y);
            if (!z.currencyDropped) { maybeDropCurrency(z.x, z.y, z.elite); z.currencyDropped = true; }
          }
        });
        
        for (let i = 0; i < 50; i++) {
          let angle = Math.random() * Math.PI * 2;
          let speed = Math.random() * 6;
          let size = 3 + Math.random() * 2;
          let lifetime = 35 + Math.random() * 15;
          let color = (Math.random() < 0.5)
            ? "rgba(255,69,0,ALPHA)"
            : "rgba(255,140,0,ALPHA)";
          spawnParticle(rocket.x, rocket.y, Math.cos(angle) * speed, Math.sin(angle) * speed, size, lifetime, color);
        }
        
        spawnParticle(rocket.x, rocket.y, 0, 0, explosionRadius, 10, "rgba(255,255,200,ALPHA)");
        playExplosionSound();
    }

    // ---------------------
    // HUD DRAWING FUNCTION
    // ---------------------
    function drawHUD() {
        const hudMarginLeft = 20;
        const hudMarginTop = 20;
        const lineHeight = 24;
        let lines = [];
        lines.push("Money: $" + player.money);
        lines.push("Lives: " + player.lives);
        if (player.activeGun && player.activeGun.type) {
            if (player.activeGun.type === "flamethrower")
                lines.push("Fuel (" + player.activeGun.type + "): " + Math.floor(player.activeGun.fuel));
            else
                lines.push("Ammo (" + player.activeGun.type + "): " + (player.activeGun.ammo === Infinity ? "∞" : player.activeGun.ammo));
        } else if (player.weapon === "pistol")
            lines.push("Ammo: " + player.ammo + " / " + player.magazine);
        else if (player.weapon === "crossbow")
            lines.push("Ammo (Crossbow): " + player.crossbowAmmo + " bolts");
        else if (player.weapon === "laser")
            lines.push("Laser Ammo: " + player.laserAmmo);
        else if (player.weapon === "rocketLauncher")
            lines.push("Rocket Ammo: " + player.rocketAmmo);
        lines.push("Weapon: " + player.weapon.charAt(0).toUpperCase() + player.weapon.slice(1));
        if (player.rapidFireLevel > 0) lines.push("Rapid Fire Level: " + player.rapidFireLevel);
        if (player.damageMultiplier > 1) lines.push("Damage Boost: x" + player.damageMultiplier.toFixed(2));
        if (player.extraArmor > 0) lines.push("Armor: " + player.extraArmor);
        if (player.healthRegenRate > 0) lines.push("Health Regen: +" + player.healthRegenRate + " per 5s");
        if (player.critChance > 0) lines.push("Crit Chance: " + (player.critChance * 100).toFixed(0) + "%");
        if (player.explosiveRounds) lines.push("Explosive Rounds: On");
        if (player.scoreMultiplier > 1) lines.push("Score Multiplier: x" + player.scoreMultiplier);
        let currentTime = (gameState === "paused" && pauseStartTime) ? pauseStartTime : Date.now();
        let elapsedTime = Math.floor((currentTime - gameStartTime - totalPausedTime) / 1000);
        lines.push("Kills: " + zombieKills);
        lines.push("Time: " + elapsedTime + "s");
        ctx.save();
        ctx.font = "20px sans-serif";
        ctx.fillStyle = "black";
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], hudMarginLeft, hudMarginTop + i * lineHeight);
        }
        ctx.restore();
    }

    // ---------------------
    // GAME UPDATE FUNCTION
    // ---------------------
    function update() {
        if (gameState !== "playing") return;

        if (player.healthRegenRate > 0 && Date.now() - player.lastRegenTime >= 5000) {
            player.lives += player.healthRegenRate;
            player.lastRegenTime = Date.now();
        }

        if (gameMode === "god" || gameMode === "test") {
            player.ammo = player.magazine;
            if (player.activeGun && player.activeGun.type && player.weapon !== "pistol")
                player.activeGun.ammo = Infinity;
        }

        if (gameMode === "god") player.speed = player.baseSpeed * 2;
        else player.speed = player.baseSpeed * (player.powerUps.speed ? 1.5 : 1);

        if (player.weapon === "machineGun" || player.weapon === "shotgun" || player.weapon === "flamethrower") {
            if (player.activeGun && player.activeGun.type) {
                player.weapon = player.activeGun.type;
            } else {
                player.weapon = "pistol";
            }
        }

        let moving = false;
        if (keys['w'] || keys['ArrowUp']) { player.y -= player.speed; moving = true; }
        if (keys['s'] || keys['ArrowDown']) { player.y += player.speed; moving = true; }
        if (keys['a'] || keys['ArrowLeft']) { player.x -= player.speed; moving = true; }
        if (keys['d'] || keys['ArrowRight']) { player.x += player.speed; moving = true; }
        player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
        if (moving) player.walkCycle += 0.15; else player.walkCycle = 0;
        if (player.recoil > 0) player.recoil = Math.max(player.recoil - 1, 0);
        if (player.reloading && player.weapon === "pistol") {
            let reloadElapsed = Date.now() - player.reloadStart;
            if (reloadElapsed >= player.reloadDuration) {
                player.ammo = player.magazine;
                player.reloading = false;
                player.penaltyActive = false;
                playReloadEndSound();
            }
        }

        for (let key in player.powerUps) {
            if (gameMode !== "god" && Date.now() > player.powerUps[key]) delete player.powerUps[key];
        }
        for (let i = powerUps.length - 1; i >= 0; i--) {
            const pwr = powerUps[i];
            if (Date.now() - pwr.spawnTime > 20000) { powerUps.splice(i, 1); continue; }
            if (distance(player.x, player.y, pwr.x, pwr.y) < player.radius + pwr.radius) {
                activatePowerUp(pwr.type);
                powerUps.splice(i, 1);
            }
        }

        // Machine gun rapid fire.
        if (player.weapon === "machineGun" && mouseDown) {
            let fireInterval = baseMachineGunFireInterval / (1 + player.rapidFireLevel * 0.2);
            if (Date.now() - player.lastShotTime >= fireInterval) shootWeapon();
        }
        // Flamethrower.
        if (player.weapon === "flamethrower" && mouseDown) {
            if (player.activeGun && player.activeGun.fuel > 0) {
                player.activeGun.fuel -= 0.5;
                if (player.activeGun.fuel < 0) player.activeGun.fuel = 0;
                spawnFlameParticles();
                spawnFlameBullets();
                playFlameSound();
                player.lastShotTime = Date.now();
            } else {
                player.activeGun = { type: null, fuel: 0 };
                player.weapon = "pistol";
                stopFlameSound();
            }
        } else { if (player.weapon !== "flamethrower" || !mouseDown) stopFlameSound(); }

        // Laser continuous fire.
        if (player.weapon === "laser" && mouseDown) {
            let laserFireInterval = 100; // fire every 100ms
            if (Date.now() - player.lastShotTime >= laserFireInterval) {
                if (player.laserAmmo > 0) {
                    player.laserAmmo--;
                    playLaserSound();
                    player.lastShotTime = Date.now();
                    laserBeams.push({ x: player.x, y: player.y, angle: player.angle, spawnTime: Date.now(), duration: 100 });
                    let beamWidth = 10;
                    let beamLength = Math.sqrt(width * width + height * height);
                    for (let i = zombies.length - 1; i >= 0; i--) {
                        let z = zombies[i];
                        if (z.dying) continue;
                        let dx = z.x - player.x;
                        let dy = z.y - player.y;
                        let proj = dx * Math.cos(player.angle) + dy * Math.sin(player.angle);
                        if (proj < 0 || proj > beamLength) continue;
                        let perpDist = Math.abs(-Math.sin(player.angle) * dx + Math.cos(player.angle) * dy);
                        if (perpDist < beamWidth + z.radius) {
                            zombieKills++;
                            z.dying = true;
                            z.deathTimer = 60;
                            z.initialDeathTimer = 60;
                            z.fallAngle = player.angle;
                            z.fallVector = { dx: Math.cos(player.angle) * 5, dy: Math.sin(player.angle) * 5 };
                            spawnBloodSplatter(z.x, z.y);
                            if (!z.currencyDropped) { maybeDropCurrency(z.x, z.y, z.elite); z.currencyDropped = true; }
                        }
                    }
                } else {
                    player.weapon = "pistol";
                }
            }
        }

        for (let i = bullets.length - 1; i >= 0; i--) {
            let b = bullets[i];

            if (b.source === "rocket") {
                let rocketAngle = Math.atan2(b.dy, b.dx);
                let tailOffset = 16; 
                let tailX = b.x - Math.cos(rocketAngle) * tailOffset;
                let tailY = b.y - Math.sin(rocketAngle) * tailOffset;
                for (let k = 0; k < 2; k++) {
                  spawnParticle(
                    tailX + (Math.random() - 0.5) * 4, 
                    tailY + (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 0.5, 
                    (Math.random() - 0.5) * 0.5,
                    4,
                    40,
                    "rgba(80,80,80,ALPHA)"
                  );
                }
                b.x += b.dx;
                b.y += b.dy;
                let exploded = false;
                for (let j = 0; j < zombies.length; j++) {
                  let z = zombies[j];
                  if (distance(b.x, b.y, z.x, z.y) < z.radius + 10) {
                    explodeRocket(b);
                    exploded = true;
                    break;
                  }
                }
                if (b.x < 0 || b.x > width || b.y < 0 || b.y > height || Date.now() - b.spawnTime > 3000) {
                  explodeRocket(b);
                  exploded = true;
                }
                if (exploded) {
                  bullets.splice(i, 1);
                }
                continue;
            }

            b.x += b.dx;
            b.y += b.dy;
            if (b.source !== "flamethrower")
                spawnParticle(b.x, b.y, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, 1, 15, "rgba(0,0,0,ALPHA)");
            if (b.source === "flamethrower" && distance(b.startX, b.startY, b.x, b.y) > 100) { bullets.splice(i, 1); continue; }
            if (b.x < 0 || b.x > width || b.y < 0 || b.y > height) { bullets.splice(i, 1); }
        }

        for (let i = zombies.length - 1; i >= 0; i--) {
            let z = zombies[i];
            if (!z.dying) {
                let effectiveSpeed = z.speed;
                if (player.powerUps.slowMotion) effectiveSpeed *= 0.5;
                if (freezeEndTime && Date.now() < freezeEndTime) effectiveSpeed *= 0.5;
                if (z.crawling) effectiveSpeed *= 0.3;
                const angle = Math.atan2(player.y - z.y, player.x - z.x);
                z.x += Math.cos(angle) * effectiveSpeed;
                z.y += Math.sin(angle) * effectiveSpeed;
                if (distance(z.x, z.y, player.x, player.y) < z.radius + player.radius) {
                    if (Date.now() < (player.invulnerableUntil || 0)) { }
                    else if (gameMode === "god" || player.powerUps.shield) {
                        if (!z.dying) {
                            zombieKills++;
                            z.dying = true;
                            z.deathTimer = 60;
                            z.initialDeathTimer = 60;
                            z.fallAngle = 0;
                            z.fallVector = { dx: 0, dy: 2 };
                            spawnBloodSplatter(z.x, z.y);
                            if (!z.currencyDropped) { maybeDropCurrency(z.x, z.y, z.elite); z.currencyDropped = true; }
                        }
                    } else if (player.extraArmor > 0) {
                        player.extraArmor--;
                        if (!z.dying) {
                            zombieKills++;
                            z.dying = true;
                            z.deathTimer = 60;
                            z.initialDeathTimer = 60;
                            z.fallAngle = 0;
                            z.fallVector = { dx: 0, dy: 2 };
                            spawnBloodSplatter(z.x, z.y);
                            if (!z.currencyDropped) { maybeDropCurrency(z.x, z.y, z.elite); z.currencyDropped = true; }
                        }
                    } else if (player.lives > 1) {
                        player.lives--;
                        player.invulnerableUntil = Date.now() + 2000;
                        if (!z.dying) {
                            zombieKills++;
                            z.dying = true;
                            z.deathTimer = 60;
                            z.initialDeathTimer = 60;
                            z.fallAngle = 0;
                            z.fallVector = { dx: 0, dy: 2 };
                            spawnBloodSplatter(z.x, z.y);
                            if (!z.currencyDropped) { maybeDropCurrency(z.x, z.y, z.elite); z.currencyDropped = true; }
                        }
                    } else { gameOver = true; showGameOverOverlay(); }
                }
            } else {
                z.x += z.fallVector.dx;
                z.y += z.fallVector.dy;
                z.fallVector.dx *= 0.95;
                z.fallVector.dy *= 0.95;
                z.deathTimer--;
                if (z.deathTimer <= 0) {
                    if (!z.currencyDropped) { maybeDropCurrency(z.x, z.y, z.elite); z.currencyDropped = true; }
                    zombies.splice(i, 1);
                }
            }
        }

        for (let i = zombies.length - 1; i >= 0; i--) {
            let z = zombies[i];
            if (!z.dying) {
                for (let j = bullets.length - 1; j >= 0; j--) {
                    let b = bullets[j];
                    let collisionTolerance = (b.source === "flamethrower") ? 10 : 3;
                    if (distance(z.x, z.y, b.x, b.y) < z.radius + collisionTolerance) {
                        if (b.source === "flamethrower") {
                            z.health -= 0.5 * player.damageMultiplier;
                            if (z.health <= 0 && !z.dying) {
                                zombieKills++;
                                spawnBloodSplatter(z.x, z.y);
                                z.dying = true;
                                z.deathTimer = 60;
                                z.initialDeathTimer = 60;
                                z.fallAngle = 0;
                                z.fallVector = { dx: 0, dy: 2 };
                                if (!z.currencyDropped) { maybeDropCurrency(z.x, z.y, z.elite); z.currencyDropped = true; }
                            }
                            bullets.splice(j, 1);
                            continue;
                        }
                        else if (b.source === "crossbow") {
                            let baseDamage = 4;
                            if (distance(b.x, b.y, z.x, z.y - 15) < 10) {
                                baseDamage *= 1.5;
                                if (!z.headDecapitated) {
                                    z.headDecapitated = true;
                                    decapitatedHeads.push({
                                        x: z.x,
                                        y: z.y - 15,
                                        vx: b.dx * 0.8,
                                        vy: b.dy * 0.8,
                                        rotation: 0,
                                        angularVelocity: 0.1,
                                        life: 120,
                                        maxLife: 120
                                    });
                                    spawnBloodSplatter(z.x, z.y - 15);
                                }
                                playZombieHeadshotSound();
                            } else {
                                playZombieHitSound();
                            }
                            z.health -= baseDamage * player.damageMultiplier;
                            bullets.splice(j, 1);
                            if (z.health <= 0 && !z.dying) {
                                zombieKills++;
                                spawnBloodSplatter(z.x, z.y);
                                z.dying = true;
                                z.deathTimer = 60;
                                z.initialDeathTimer = 60;
                                let fallImpactFactor = 0.5;
                                z.fallAngle = Math.atan2(b.dy, b.dx);
                                z.fallVector = { dx: b.dx * fallImpactFactor, dy: b.dy * fallImpactFactor };
                                if (!z.currencyDropped) { maybeDropCurrency(z.x, z.y, z.elite); z.currencyDropped = true; }
                            }
                            break;
                        }
                        else if (b.source === "laser") {
                            let baseDamage = 8;
                            if (distance(b.x, b.y, z.x, z.y - 15) < 10) {
                                baseDamage *= 1.5;
                                if (!z.headDecapitated) {
                                    z.headDecapitated = true;
                                    decapitatedHeads.push({
                                        x: z.x,
                                        y: z.y - 15,
                                        vx: b.dx * 0.8,
                                        vy: b.dy * 0.8,
                                        rotation: 0,
                                        angularVelocity: 0.1,
                                        life: 120,
                                        maxLife: 120
                                    });
                                    spawnBloodSplatter(z.x, z.y - 15);
                                }
                                playZombieHeadshotSound();
                            } else {
                                playZombieHitSound();
                            }
                            z.health -= baseDamage * player.damageMultiplier;
                            bullets.splice(j, 1);
                            if (z.health <= 0 && !z.dying) {
                                zombieKills++;
                                spawnBloodSplatter(z.x, z.y);
                                z.dying = true;
                                z.deathTimer = 60;
                                z.initialDeathTimer = 60;
                                let fallImpactFactor = 0.5;
                                z.fallAngle = Math.atan2(b.dy, b.dx);
                                z.fallVector = { dx: b.dx * fallImpactFactor, dy: b.dy * fallImpactFactor };
                                if (!z.currencyDropped) { maybeDropCurrency(z.x, z.y, z.elite); z.currencyDropped = true; }
                            }
                            break;
                        }
                        else {
                            let baseDamage = 0;
                            if (distance(b.x, b.y, z.x, z.y - 15) < 10) {
                                baseDamage = 2;
                                if (!z.headDecapitated) {
                                    z.headDecapitated = true;
                                    decapitatedHeads.push({
                                        x: z.x,
                                        y: z.y - 15,
                                        vx: b.dx * 0.8,
                                        vy: b.dy * 0.8,
                                        rotation: 0,
                                        angularVelocity: 0.1,
                                        life: 120,
                                        maxLife: 120
                                    });
                                    spawnBloodSplatter(z.x, z.y - 15);
                                }
                                playZombieHeadshotSound();
                            } else if (b.y > z.y + 5) {
                                baseDamage = 1;
                                z.crawling = true;
                                playZombieHitSound();
                            } else {
                                baseDamage = 1;
                                playZombieHitSound();
                            }
                            // NEW: ZOMBIE LIMB EFFECT
                            if (!z.headDecapitated) {
                                if (b.x < z.x && !z.leftArmDetached) {
                                    z.leftArmDetached = true;
                                    detachedLimbs.push({
                                        type: 'leftArm',
                                        x: z.x - 15,
                                        y: z.y,
                                        vx: b.dx * 0.8 + (Math.random() - 0.5) * 2,
                                        vy: b.dy * 0.8 + (Math.random() - 0.5) * 2,
                                        rotation: 0,
                                        angularVelocity: (Math.random() - 0.5) * 0.2,
                                        life: 120,
                                        maxLife: 120
                                    });
                                } else if (b.x >= z.x && !z.rightArmDetached) {
                                    z.rightArmDetached = true;
                                    detachedLimbs.push({
                                        type: 'rightArm',
                                        x: z.x + 15,
                                        y: z.y,
                                        vx: b.dx * 0.8 + (Math.random() - 0.5) * 2,
                                        vy: b.dy * 0.8 + (Math.random() - 0.5) * 2,
                                        rotation: 0,
                                        angularVelocity: (Math.random() - 0.5) * 0.2,
                                        life: 120,
                                        maxLife: 120
                                    });
                                }
                            }
                            let damage = baseDamage * player.damageMultiplier;
                            if (Math.random() < player.critChance) damage *= 2;
                            z.health -= damage;
                            if (player.explosiveRounds) {
                                for (let k = 0; k < zombies.length; k++) {
                                    let z2 = zombies[k];
                                    if (z2 !== z && distance(b.x, b.y, z2.x, z2.y) < 30)
                                        z2.health -= damage * 0.5;
                                }
                            }
                            if (z.health <= 0 && !z.dying) {
                                zombieKills++;
                                spawnBloodSplatter(z.x, z.y);
                                z.dying = true;
                                z.deathTimer = 60;
                                z.initialDeathTimer = 60;
                                let fallImpactFactor = (b.source === "pistol") ? 0.2 : 0.5;
                                z.fallAngle = Math.atan2(b.dy, b.dx);
                                z.fallVector = { dx: b.dx * fallImpactFactor, dy: b.dy * fallImpactFactor };
                                if (!z.currencyDropped) { maybeDropCurrency(z.x, z.y, z.elite); z.currencyDropped = true; }
                            }
                            bullets.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        }

        for (let i = decapitatedHeads.length - 1; i >= 0; i--) {
            let head = decapitatedHeads[i];
            head.x += head.vx;
            head.y += head.vy;
            head.rotation += head.angularVelocity;
            head.vx *= 0.98;
            head.vy *= 0.98;
            head.life--;
            if (head.life <= 0) decapitatedHeads.splice(i, 1);
        }

        // NEW: Update detached limbs.
        for (let i = detachedLimbs.length - 1; i >= 0; i--) {
            let limb = detachedLimbs[i];
            limb.x += limb.vx;
            limb.y += limb.vy;
            limb.rotation += limb.angularVelocity;
            limb.vx *= 0.98;
            limb.vy *= 0.98;
            limb.life--;
            if (limb.life <= 0) detachedLimbs.splice(i, 1);
        }

        updateCurrencyDrops();
        updateParticles();

        // Update laser beams.
        for (let i = laserBeams.length - 1; i >= 0; i--) {
            if (Date.now() - laserBeams[i].spawnTime > laserBeams[i].duration) {
                laserBeams.splice(i, 1);
            }
        }

        if (zombieKills >= shopThreshold && !shopOpen) {
            showShop();
        }
    }

    // ---------------------
    // DRAW FUNCTIONS
    // ---------------------
    function draw() {
        ctx.clearRect(0, 0, width, height);
        drawPowerUps();
        if (gameMode === "god") {
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.shadowColor = "yellow";
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius + 15, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 0, 0.2)";
            ctx.fill();
            ctx.restore();
        }
        drawPlayer();
        for (let b of bullets) {
            if (b.source === "flamethrower") continue;
            if (b.source === "rocket") {
                let rocketAngle = Math.atan2(b.dy, b.dx);
                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.rotate(rocketAngle);
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.moveTo(-12, -4);
                ctx.lineTo(0, -2);
                ctx.quadraticCurveTo(14, 1, 0, 4);
                ctx.lineTo(-12, 4);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.restore();
            } else {
                let bulletAngle = Math.atan2(b.dy, b.dx);
                let pulse = 1 + 0.5 * Math.abs(Math.sin((Date.now() - b.spawnTime) * 0.02));
                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.rotate(bulletAngle);
                ctx.strokeStyle = "black";
                ctx.lineWidth = pulse * 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-8, 0);
                ctx.stroke();
                ctx.restore();
            }
        }
        for (let z of zombies) { drawZombie(z); }
        drawParticles();
        for (let head of decapitatedHeads) {
            ctx.save();
            ctx.translate(head.x, head.y);
            ctx.rotate(head.rotation);
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.restore();
        }
        // NEW: Draw detached limbs.
        for (let limb of detachedLimbs) {
            ctx.save();
            ctx.translate(limb.x, limb.y);
            ctx.rotate(limb.rotation);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(15, 0);
            ctx.stroke();
            ctx.restore();
        }
        drawCurrencyDrops();

        // Draw active laser beams.
        for (let beam of laserBeams) {
            let beamLength = Math.sqrt(width * width + height * height);
            let endX = beam.x + Math.cos(beam.angle) * beamLength;
            let endY = beam.y + Math.sin(beam.angle) * beamLength;
            ctx.save();
            ctx.strokeStyle = "cyan";
            ctx.lineWidth = 5;
            ctx.shadowColor = "cyan";
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.moveTo(beam.x, beam.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.restore();
        }

        drawHUD();
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.restore();
    }

    function drawPlayer() {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        if (player.powerUps.shield) {
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius + 10, 0, Math.PI * 2);
            ctx.strokeStyle = "blue";
            ctx.stroke();
            ctx.strokeStyle = "black";
        }
        ctx.beginPath();
        ctx.arc(player.x, player.y - 15, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(player.x, player.y - 5);
        ctx.lineTo(player.x, player.y + 15);
        ctx.stroke();
        let leftArmSwing = Math.sin(player.walkCycle) * 3;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x - 15 + leftArmSwing, player.y);
        ctx.stroke();
        const armLength = 15;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x + Math.cos(player.angle) * armLength, player.y + Math.sin(player.angle) * armLength);
        ctx.stroke();
        let leftLegOffset = Math.sin(player.walkCycle) * 5;
        let rightLegOffset = Math.sin(player.walkCycle + Math.PI) * 5;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y + 15);
        ctx.lineTo(player.x - 10 + leftLegOffset, player.y + 30);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(player.x, player.y + 15);
        ctx.lineTo(player.x + 10 + rightLegOffset, player.y + 30);
        ctx.stroke();
        const gunStartX = player.x + Math.cos(player.angle) * (armLength - player.recoil);
        const gunStartY = player.y + Math.sin(player.angle) * (armLength - player.recoil);
        ctx.save();
        ctx.translate(gunStartX, gunStartY);
        ctx.rotate(player.angle);
        if (player.weapon === "shotgun") {
            const gunLength = 30;
            const gunThickness = 8;
            ctx.fillStyle = "saddlebrown";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        } else if (player.weapon === "flamethrower") {
            const gunLength = 25;
            const gunThickness = 8;
            ctx.fillStyle = "orange";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        } else if (player.weapon === "crossbow") {
            const gunLength = 25;
            const gunThickness = 8;
            ctx.fillStyle = "peru";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        } else if (player.weapon === "laser") {
            const gunLength = 30;
            const gunThickness = 6;
            ctx.fillStyle = "cyan";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        } else {
            const gunLength = 20;
            const gunThickness = 6;
            ctx.fillStyle = "darkgray";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        }
        ctx.restore();
        if (player.reloading) {
            let reloadElapsed = Date.now() - player.reloadStart;
            let progress = Math.min(reloadElapsed / player.reloadDuration, 1);
            let barWidth = 50;
            let barHeight = 8;
            let barX = player.x - barWidth / 2;
            let barY = player.y - 40;

            ctx.strokeStyle = "black";
            ctx.strokeRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = player.penaltyActive ? "grey" : "green";
            ctx.fillRect(barX, barY, barWidth * progress, barHeight);
            const QUICK_RELOAD_ZONE_START = 0.3;
            const QUICK_RELOAD_ZONE_END = 0.4;
            let targetX = barX + barWidth * QUICK_RELOAD_ZONE_START;
            let targetWidth = barWidth * (QUICK_RELOAD_ZONE_END - QUICK_RELOAD_ZONE_START);
            ctx.fillStyle = "black";
            ctx.fillRect(targetX, barY, targetWidth, barHeight);
            let pointerX = barX + barWidth * progress;
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(pointerX, barY);
            ctx.lineTo(pointerX, barY + barHeight);
            ctx.stroke();
        }

        if (player.weapon === "crossbow" && player.crossbowReloading) {
            let reloadElapsed = Date.now() - player.crossbowReloadStart;
            let progress = Math.min(reloadElapsed / player.crossbowReloadTime, 1);
            let barWidth = 50;
            let barHeight = 8;
            let barX = player.x - barWidth / 2;
            let barY = player.y - 40;
            ctx.strokeStyle = "black";
            ctx.strokeRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = "orange";
            ctx.fillRect(barX, barY, barWidth * progress, barHeight);
        }
    }

    function drawZombie(z) {
        ctx.strokeStyle = z.elite ? "purple" : "#330000";
        ctx.lineWidth = 2;
        ctx.save();
        ctx.translate(z.x, z.y);
        if (z.dying) { ctx.rotate(z.fallAngle); ctx.globalAlpha = z.deathTimer / z.initialDeathTimer; }
        if (!z.headDecapitated) {
            ctx.beginPath();
            ctx.arc(0, -15, 10, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(0, 15);
        ctx.stroke();
        // Draw arms only if not detached.
        ctx.beginPath();
        if (!z.leftArmDetached) {
            ctx.moveTo(0, 0);
            ctx.lineTo(-15, 0);
        }
        if (!z.rightArmDetached) {
            ctx.moveTo(0, 0);
            ctx.lineTo(15, 0);
        }
        ctx.stroke();
        if (z.crawling) {
            ctx.beginPath();
            ctx.moveTo(0, 15);
            ctx.lineTo(-5, 20);
            ctx.moveTo(0, 15);
            ctx.lineTo(5, 20);
            ctx.stroke();
        } else {
            ctx.beginPath();
            let leftLegOffset = Math.sin(z.walkCycle) * 5;
            let rightLegOffset = Math.sin(z.walkCycle + Math.PI) * 5;
            ctx.moveTo(0, 15);
            ctx.lineTo(-10 + leftLegOffset, 30);
            ctx.moveTo(0, 15);
            ctx.lineTo(10 + rightLegOffset, 30);
            ctx.stroke();
        }
        ctx.restore();
        ctx.globalAlpha = 1;
    }

    function drawPowerUps() {
        for (let p of powerUps) {
            let rectWidth = 40;
            let rectHeight = 40;
            let x = p.x - rectWidth / 2;
            let y = p.y - rectHeight / 2;
            ctx.fillStyle = powerUpColors[p.type] || "gray";
            ctx.fillRect(x, y, rectWidth, rectHeight);
            ctx.strokeStyle = "black";
            ctx.strokeRect(x, y, rectWidth, rectHeight);
            ctx.fillStyle = "white";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(powerUpNames[p.type] || "", p.x, p.y);
        }
    }

    function showGameOverOverlay() {
        const overlay = document.getElementById("gameOverOverlay");
        let currentTime = (gameState === "paused" && pauseStartTime) ? pauseStartTime : Date.now();
        const elapsedTime = Math.floor((currentTime - gameStartTime - totalPausedTime) / 1000);
        document.getElementById("finalStats").innerText = "Kills: " + zombieKills + " | Time: " + elapsedTime + "s";
        overlay.style.display = "flex";
    }
      
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();

    // ---------------------
    // TEST MODE MENU FUNCTIONS
    // ---------------------
    function openTestModeMenu() {
        let container = document.getElementById("testModeItemsContainer");
        container.innerHTML = "";
        availableShopItems.forEach(item => {
            let btn = document.createElement("button");
            btn.innerHTML = "Test: " + item.name + "<br>" + item.description;
            btn.style.display = "block";
            btn.style.margin = "5px auto";
            btn.addEventListener("click", () => {
                item.effect();
                alert(item.name + " effect applied.");
            });
            container.appendChild(btn);
        });
        document.getElementById("testModeMenuOverlay").style.display = "block";
    }

    document.getElementById("closeTestModeMenuButton").addEventListener("click", () => {
        document.getElementById("testModeMenuOverlay").style.display = "none";
    });

    document.getElementById("resetTestUpgradesButton").addEventListener("click", () => {
        player.rapidFireLevel = 0;
        player.damageMultiplier = 1;
        player.healthRegenRate = 0;
        player.extraArmor = 0;
        player.critChance = 0;
        player.explosiveRounds = false;
        player.scoreMultiplier = 1;
        alert("Upgrades have been reset.");
    });
})();
