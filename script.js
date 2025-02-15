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
        oscillator.frequency.value = 200;
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

    // Subtle zombie kill sound
    function playZombieKillSound() {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.value = 100;
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    }

    // ---------------------
    // GLOBAL VARIABLES & STATE
    // ---------------------
    let zombieKills = 0;
    let gameStartTime = 0;
    let totalPausedTime = 0;   // Accumulates total pause duration
    let pauseStartTime = 0;    // Records when a pause starts
    let screenShake = 0;
    let gameOver = false;
    // Game states: "menu", "playing", "paused", "shop"
    let gameState = "menu";
    // Game modes: "normal", "god", "test"
    let gameMode = "normal";

    let mouseDown = false;
    let particles = [];
    let autoReloadScheduled = false;
    let decapitatedHeads = [];
    let detachedLimbs = [];
    let currencyDrops = [];
    let plasmaEffects = [];
    // For continuous flame sound.
    let flameSoundOscillator = null;
    let flameSoundGain = null;

    // Shop variables
    let shopThreshold = 100;
    let shopOpen = false;
    let shopPriceMultiplier = 1.0;

    // Freeze effect: When shop (or test menu) is open, game simulation freezes.
    let freezeEndTime = 0;

    // ADDED/CHANGED: Revolver specific fields
    // (We treat it similar to the pistol with 7 shots in a cylinder and a total ammo pool.)
    let revolveMagazine = 7;        // cylinder capacity
    let revolveShots = 7;           // current shots in cylinder
    let revolveAmmo = 21;           // total revolve ammo pool
    let revolveReloadTime = 1500;   // revolve reload time
    let revolveReloading = false;
    let revolveReloadStart = 0;
    let revolveReloadDuration = revolveReloadTime;
    let revolvePenaltyActive = false;

    // ADDED: For repeated boss spawns
    let nextBossKillsThreshold = 20;

    // ADDED: Helper to see if a boss is alive
    function isBossAlive() {
        return zombies.some(z => z.isBoss && !z.dying);
    }

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
        reloadTime: 1500,
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
        rapidFireLevel: 0,
        damageMultiplier: 1,
        healthRegenRate: 0,
        extraArmor: 0,
        critChance: 0,
        explosiveRounds: false,
        scoreMultiplier: 1,
        lastRegenTime: Date.now(),
        crossbowAmmo: 5,
        crossbowReloading: false,
        crossbowReloadTime: 1000,
        crossbowReloadStart: 0,
        laserCooldown: 0,
        laserAmmo: 50,
        rocketAmmo: 5
    };

    // ---------------------
    // BULLETS, ZOMBIES, POWER‑UPS, LASER BEAMS
    // ---------------------
    let bullets = [];
    let zombies = [];
    let powerUps = [];
    let laserBeams = [];

    // Power-up definitions
    const powerUpTypes = [
        "shield", "machineGun", "shotgun", "speed", "bomb", "extraAmmo", "slowMotion", "laser",
        "sniperRifle", "miniGun", "revolver", "plasmaRifle", "freezeCannon", "lightningGun",
        "bfg9000", "acidGun", "grenadeLauncher", "dualUzis", "pistolDouble"
    ];

    const powerUpColors = {
        shield: "blue",
        machineGun: "darkgray",
        shotgun: "saddlebrown",
        speed: "orange",
        bomb: "black",
        extraAmmo: "gold",
        slowMotion: "purple",
        laser: "cyan",
        sniperRifle: "darkgreen",
        miniGun: "dimgray",
        revolver: "silver",
        plasmaRifle: "skyblue",
        freezeCannon: "lightcyan",
        lightningGun: "yellow",
        bfg9000: "lime",
        acidGun: "chartreuse",
        grenadeLauncher: "olive",
        pistolDouble: "olive",
        dualUzis: "slategray"

    };

    const powerUpNames = {
        shield: "Shield",
        machineGun: "Machine Gun",
        shotgun: "Shotgun",
        speed: "Speed",
        bomb: "Bomb",
        extraAmmo: "Extra Ammo",
        slowMotion: "Slow Motion",
        laser: "Laser Rifle",
        sniperRifle: "Sniper Rifle",
        miniGun: "Mini Gun",
        revolver: "Revolver",
        plasmaRifle: "Plasma Rifle",
        freezeCannon: "Freeze Cannon",
        lightningGun: "Lightning Gun",
        bfg9000: "BFG 9000",
        acidGun: "Acid Gun",
        grenadeLauncher: "Grenade Launcher",
        pistolDouble: "Double Pistol",
        dualUzis: "Dual Uzis"
    };

    // ---------------------
    // SHOP ITEMS
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
        { id: "scoreMultiplier", name: "Score Multiplier", description: "Double money earned for 10 seconds.", price: 0, effect: function () { player.scoreMultiplier = 2; setTimeout(() => { player.scoreMultiplier = 1; }, 10000); } },
        {
            id: "randomGun",
            name: "Buy Random Gun",
            description: "Purchase a random weapon (fixed cost).",
            price: 0,
            effect: function () {
                const gunOptions = [
                    "pistolDouble", "machineGun", "shotgun", "flamethrower", "crossbow", "rocketLauncher", "laser",
                    "sniperRifle", "miniGun", "revolver", "plasmaRifle", "freezeCannon", "lightningGun",
                    "bfg9000", "acidGun", "grenadeLauncher", "dualUzis", "sniperRifle"
                ];
                let randomIndex = Math.floor(Math.random() * gunOptions.length);
                let selectedGun = gunOptions[randomIndex];

                if (selectedGun === "pistolDouble") {
                    player.weapon = "pistolDouble";
                    player.ammo = 12;
                    player.magazine = 12;
                } else if (selectedGun === "laser") {
                    player.weapon = "laser";
                    player.laserAmmo = 50;
                } else if (selectedGun === "flamethrower") {
                    player.weapon = "flamethrower";
                    player.activeGun = { type: "flamethrower", fuel: 100 };
                } else if (selectedGun === "machineGun") {
                    player.weapon = "machineGun";
                    player.activeGun = { type: "machineGun", ammo: 50 };
                } else if (selectedGun === "shotgun") {
                    player.weapon = "shotgun";
                    player.activeGun = { type: "shotgun", ammo: 20 };
                } else if (selectedGun === "rocketLauncher") {
                    player.weapon = "rocketLauncher";
                    player.rocketAmmo = 3;
                } else if (selectedGun === "crossbow") {
                    player.weapon = "crossbow";
                    player.crossbowAmmo = 5;
                } else if (selectedGun === "sniperRifle") {
                    player.weapon = "sniperRifle";
                    player.activeGun = { type: "sniperRifle", ammo: 10 };
                } else if (selectedGun === "miniGun") {
                    player.weapon = "miniGun";
                    player.activeGun = { type: "miniGun", ammo: 100 };
                } else if (selectedGun === "revolver") {
                    player.weapon = "revolver";
                    revolveShots = revolveMagazine; // reset cylinder
                } else if (selectedGun === "plasmaRifle") {
                    player.weapon = "plasmaRifle";
                    player.activeGun = { type: "plasmaRifle", ammo: 30 };
                } else if (selectedGun === "freezeCannon") {
                    player.weapon = "freezeCannon";
                    player.activeGun = { type: "freezeCannon", ammo: 10 };
                } else if (selectedGun === "lightningGun") {
                    player.weapon = "lightningGun";
                    player.activeGun = { type: "lightningGun", ammo: 25 };
                } else if (selectedGun === "bfg9000") {
                    player.weapon = "bfg9000";
                    player.activeGun = { type: "bfg9000", ammo: 5 };
                } else if (selectedGun === "acidGun") {
                    player.weapon = "acidGun";
                    player.activeGun = { type: "acidGun", ammo: 20 };
                } else if (selectedGun === "grenadeLauncher") {
                    player.weapon = "grenadeLauncher";
                    player.activeGun = { type: "grenadeLauncher", ammo: 5 };
                } else if (selectedGun === "dualUzis") {
                    player.weapon = "dualUzis";
                    player.activeGun = { type: "dualUzis", ammo: 50 };
                }
            }
        },
        // 10 new guns as direct shop items
        {
            id: "sniperRifle",
            name: "Sniper Rifle",
            description: "Long range, high damage, slow fire.",
            price: 80,
            effect: function () {
                player.weapon = "sniperRifle";
                player.activeGun = {
                    type: "sniperRifle",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 10
                };
            }
        },
        {
            id: "miniGun",
            name: "Mini-Gun",
            description: "High fire-rate weapon with large ammo.",
            price: 100,
            effect: function () {
                player.weapon = "miniGun";
                player.activeGun = {
                    type: "miniGun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 100
                };
            }
        },
        {
            id: "revolver",
            name: "Revolver",
            description: "Powerful handgun with 7 shots, partial penetration.",
            price: 60,
            effect: function () {
                player.weapon = "revolver";
                revolveShots = revolveMagazine;
            }
        },
        {
            id: "plasmaRifle",
            name: "Plasma Rifle",
            description: "Fires deadly plasma bolts.",
            price: 90,
            effect: function () {
                player.weapon = "plasmaRifle";
                player.activeGun = {
                    type: "plasmaRifle",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 30
                };
            }
        },
        {
            id: "freezeCannon",
            name: "Freeze Cannon",
            description: "Slows enemies on hit.",
            price: 100,
            effect: function () {
                player.weapon = "freezeCannon";
                player.activeGun = {
                    type: "freezeCannon",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 10
                };
            }
        },
        {
            id: "lightningGun",
            name: "Lightning Gun",
            description: "Arcs electricity between enemies.",
            price: 95,
            effect: function () {
                player.weapon = "lightningGun";
                player.activeGun = {
                    type: "lightningGun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 25
                };
            }
        },
        {
            id: "bfg9000",
            name: "BFG 9000",
            description: "Devastating area-of-effect shots.",
            price: 150,
            effect: function () {
                player.weapon = "bfg9000";
                player.activeGun = {
                    type: "bfg9000",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 5
                };
            }
        },
        {
            id: "acidGun",
            name: "Acid Gun",
            description: "Melts enemies over time.",
            price: 85,
            effect: function () {
                player.weapon = "acidGun";
                player.activeGun = {
                    type: "acidGun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 20
                };
            }
        },
        {
            id: "grenadeLauncher",
            name: "Grenade Launcher",
            description: "Lobs grenades with splash damage.",
            price: 110,
            effect: function () {
                player.weapon = "grenadeLauncher";
                player.activeGun = {
                    type: "grenadeLauncher",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 5
                };
            }
        },
        {
            id: "dualUzis",
            name: "Dual Uzis",
            description: "Two SMGs for double the fun.",
            price: 90,
            effect: function () {
                player.weapon = "dualUzis";
                player.activeGun = {
                    type: "dualUzis",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 50
                };
            }
        }
    ];

    // ---------------------
    // INPUT EVENTS
    // ---------------------
    let keys = {};
    let mouse = { x: width / 2, y: height / 2 };

    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.key === "r" || e.key === "R") {
            // Reload logic for pistol or revolver
            reloadGun();
            reloadRevolver();
        }
        if (e.key === "Escape") {
            if (gameState === "playing") {
                gameState = "paused";
                pauseStartTime = Date.now();
                document.getElementById("pauseMenuOverlay").style.display = "flex";
                document.getElementById("instructions").style.display = "block";
            } else if (gameState === "paused") {
                gameState = "playing";
                totalPausedTime += (Date.now() - pauseStartTime);
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
        if ((player.weapon === "pistol" || player.weapon === "pistolDouble") && player.reloading) {
            attemptQuickReload();
        } else if (
            player.weapon !== "machineGun" &&
            player.weapon !== "flamethrower" &&
            player.weapon !== "laser" &&
            player.weapon !== "miniGun"
        ) {
            shootWeapon();
        }
    });
    canvas.addEventListener('mouseup', () => { mouseDown = false; });

    document.getElementById('restartButton').addEventListener('click', () => { location.reload(); });

    // ---------------------
    // UI Overlays
    // ---------------------
    document.getElementById("startGameButton").addEventListener("click", () => {
        gameStartTime = Date.now();
        totalPausedTime = 0;

        if (canvas.requestFullscreen) canvas.requestFullscreen();
        else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
        else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();

        gameState = "playing";
        document.getElementById("mainMenuOverlay").style.display = "none";
        document.getElementById("modesMenuOverlay").style.display = "none";
        document.getElementById("instructions").style.display = "none";

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

    // Test Mode Menu button
    document.getElementById("testModeMenuButton").addEventListener("click", openTestModeMenu);

    // Close shop
    document.getElementById("closeShopButton").addEventListener("click", closeShop);

    // Weapon Selection Overlay (for Test Mode)
    const weaponOptions = document.querySelectorAll(".weaponOption");
    weaponOptions.forEach(option => {
        option.addEventListener("click", (e) => {
            let selectedWeapon = e.target.getAttribute("data-weapon");
            player.weapon = selectedWeapon;

            if (selectedWeapon === "machineGun") {
                player.activeGun = {
                    type: "machineGun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 50
                };
            } else if (selectedWeapon === "shotgun") {
                player.activeGun = {
                    type: "shotgun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 20
                };
            } else if (selectedWeapon === "flamethrower") {
                player.activeGun = {
                    type: "flamethrower",
                    fuel: (gameMode === "test" || gameMode === "god") ? Infinity : 100
                };
            } else if (selectedWeapon === "crossbow") {
                player.activeGun = {
                    type: "crossbow",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 10
                };
            } else if (selectedWeapon === "laser") {
                player.activeGun = {
                    type: "laser",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 50
                };
            } else if (selectedWeapon === "rocketLauncher") {
                player.activeGun = {
                    type: "rocketLauncher",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 3
                };
            } else if (selectedWeapon === "miniGun") {
                player.activeGun = {
                    type: "miniGun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 100
                };
            } else if (selectedWeapon === "revolver") {
                // ADDED: revolveShots reset
                revolveShots = revolveMagazine;
            } else if (selectedWeapon === "plasmaRifle") {
                player.activeGun = {
                    type: "plasmaRifle",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 30
                };
            } else if (selectedWeapon === "freezeCannon") {
                player.activeGun = {
                    type: "freezeCannon",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 10
                };
            } else if (selectedWeapon === "lightningGun") {
                player.activeGun = {
                    type: "lightningGun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 10
                };
            } else if (selectedWeapon === "bfg9000") {
                player.activeGun = {
                    type: "bfg9000",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 1
                };
            } else if (selectedWeapon === "acidGun") {
                player.activeGun = {
                    type: "acidGun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 30
                };
            } else if (selectedWeapon === "grenadeLauncher") {
                player.activeGun = {
                    type: "grenadeLauncher",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 5
                };
            } else if (selectedWeapon === "dualUzis") {
                player.activeGun = {
                    type: "dualUzis",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 60
                };
            } else if (selectedWeapon === "pistolDouble") {
                player.ammo = 12;
                player.magazine = 12;
                player.activeGun = { type: null, ammo: 0 };
            } else if (selectedWeapon === "pistol") {
                player.activeGun = { type: null, ammo: 0 };
            } else {
                // Fallback
                player.activeGun = { type: null, ammo: 0 };
            }

            // Hide the overlay after selection
            document.getElementById("weaponSelectionOverlay").style.display = "none";
        });
    });

    // Reset button to revert to default pistol
    document.getElementById("resetWeaponButton").addEventListener("click", () => {
        player.weapon = "pistol";
        player.activeGun = { type: null, ammo: 0 };
    });

    // Close button to hide the overlay without changes
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
            decapitatedHeads: decapitatedHeads,
            revolveShots: revolveShots,
            revolveAmmo: revolveAmmo
        };
        localStorage.setItem("zombieShooterSave", JSON.stringify(stateToSave));
        alert("Game Saved!");
    }

    function loadGame() {
        const saved = localStorage.getItem("zombieShooterSave");
        if (!saved) {
            alert("No saved game found.");
            return;
        }
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
        revolveShots = state.revolveShots || revolveShots;
        revolveAmmo = state.revolveAmmo || revolveAmmo;

        gameState = "playing";
        document.getElementById("pauseMenuOverlay").style.display = "none";
        alert("Game Loaded!");
    }

    // ---------------------
    // SHOP FUNCTIONS
    // ---------------------
    function showShop() {
        shopOpen = true;
        gameState = "shop";
        let items = availableShopItems.slice();
        items.sort(() => Math.random() - 0.5);

        // Pick 3 random items
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
                case "healthRegen": base = 100; break;
                case "explosiveRounds": base = 50; break;
                case "freezeGrenade": base = 50; break;
                case "critChance": base = 25; break;
                case "scoreMultiplier": base = 20; break;
                case "randomGun": base = 50; break;
                case "sniperRifle": base = 60; break;
                case "miniGun": base = 100; break;
                case "revolver": base = 60; break;
                case "plasmaRifle": base = 90; break;
                case "freezeCannon": base = 50; break;
                case "lightningGun": base = 95; break;
                case "bfg9000": base = 150; break;
                case "acidGun": base = 85; break;
                case "grenadeLauncher": base = 50; break;
                case "dualUzis": base = 40; break;
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
    // PARTICLE SYSTEM
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
    // FLAMETHROWER HELPERS
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
    // CURRENCY SYSTEM
    // ---------------------
    function maybeDropCurrency(x, y, isElite) {
        const dropChance = 0.5;
        if (Math.random() < dropChance) {
            let type, value;
            if (isElite && Math.random() < 0.3) {
                type = "diamond";
                value = 5;
            }
            else {
                type = "dollar";
                value = 1;
            }
            value = Math.floor(value * player.scoreMultiplier);
            currencyDrops.push({ x, y, type, value, radius: 15, spawnTime: Date.now() });
        }
    }

    // ADDED: guaranteed treasure drop from boss
    function dropBossTreasure(x, y) {
        currencyDrops.push({
            x,
            y,
            type: "treasure",
            value: 20,      // boss treasure is worth $20
            radius: 15,
            spawnTime: Date.now()
        });
    }

    function updateCurrencyDrops() {
        for (let i = currencyDrops.length - 1; i >= 0; i--) {
            let drop = currencyDrops[i];
            if (Date.now() - drop.spawnTime > 6000) {
                currencyDrops.splice(i, 1);
                continue;
            }
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
            if (drop.type === "dollar") {
                ctx.fillStyle = "green";
                ctx.fillText("$", drop.x, drop.y);
            }
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
            else if (drop.type === "treasure") {
                // Boss treasure
                ctx.fillStyle = "gold";
                ctx.font = "28px serif";
                ctx.fillText("★", drop.x, drop.y);
                ctx.font = "20px sans-serif";
            }
        }
        ctx.restore();
    }

    // ---------------------
    // GUN / WEAPON LOGIC
    // ---------------------
    const baseMachineGunFireInterval = 100;
    const baseMiniGunFireInterval = 50;

    // ADDED: Knockback per weapon
    const weaponKnockback = {
        pistol: 1,
        pistolDouble: 1,
        machineGun: 2,
        miniGun: 5,
        shotgun: 7,
        flamethrower: 0.2,
        crossbow: 0.4,
        laser: 0.3,
        rocketLauncher: 10,
        sniperRifle: 3,
        revolver: 3,
        plasmaRifle: 0.5,
        freezeCannon: 0.5,
        lightningGun: 0.5,
        bfg9000: 2.0,
        acidGun: 0.4,
        grenadeLauncher: 1,
        dualUzis: 1
    };

    function applyKnockback(angle, weaponName) {
        let kb = weaponKnockback[weaponName] || 0.2;
        player.x -= Math.cos(angle) * kb;
        player.y -= Math.sin(angle) * kb;
    }

    function activatePowerUp(type) {
        if (type === "machineGun" || type === "shotgun") {
            if (type === "machineGun") {
                player.activeGun = {
                    type: "machineGun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 50
                };
                player.weapon = "machineGun";
            } else {
                player.activeGun = {
                    type: "shotgun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 20
                };
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
                        playZombieKillSound();
                        z.dying = true;
                        z.deathTimer = 60;
                        z.initialDeathTimer = 60;
                        z.fallAngle = 0;
                        z.fallVector = { dx: 0, dy: 2 };
                        spawnBloodSplatter(z.x, z.y);
                        if (!z.currencyDropped) {
                            maybeDropCurrency(z.x, z.y, z.elite);
                            z.currencyDropped = true;
                        }
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
            case "laser":
                player.weapon = "laser";
                player.laserAmmo = 50;
                break;
            case "sniperRifle":
                player.weapon = "sniperRifle";
                player.activeGun = {
                    type: "sniperRifle",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 10 // or any other default ammo value
                };

                break;
            case "miniGun":
                player.weapon = "miniGun";
                player.activeGun = {
                    type: "miniGun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 100
                };
                break;
            case "revolver":
                player.weapon = "revolver";
                revolveShots = revolveMagazine;
                break;
            case "plasmaRifle":
                player.weapon = "plasmaRifle";
                player.activeGun = {
                    type: "plasmaRifle",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 30
                };
                break;
            case "freezeCannon":
                player.weapon = "freezeCannon";
                player.activeGun = {
                    type: "freezeCannon",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 10
                };
                break;
            case "lightningGun":
                player.weapon = "lightningGun";
                player.activeGun = {
                    type: "lightningGun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 25
                };
                break;
            case "bfg9000":
                player.weapon = "bfg9000";
                player.activeGun = {
                    type: "bfg9000",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 5
                };
                break;
            case "acidGun":
                player.weapon = "acidGun";
                player.activeGun = {
                    type: "acidGun",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 20
                };
                break;
            case "grenadeLauncher":
                player.weapon = "grenadeLauncher";
                player.activeGun = {
                    type: "grenadeLauncher",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 5
                };
                break;
            case "dualUzis":
                player.weapon = "dualUzis";
                player.activeGun = {
                    type: "dualUzis",
                    ammo: (gameMode === "test" || gameMode === "god") ? Infinity : 50
                };
                break;
            default:
                break;
        }
    }

    function getMuzzlePosition(px, py, angle, weapon) {
        let offsetMap = {
            pistol: 35,
            pistolDouble: 35,
            machineGun: 45,
            miniGun: 50,
            shotgun: 30,
            flamethrower: 20,
            crossbow: 25,
            rocketLauncher: 25,
            laser: 30,
            sniperRifle: 35,
            revolver: 20, // slight offset
            plasmaRifle: 25,
            freezeCannon: 25,
            lightningGun: 25,
            bfg9000: 30,
            acidGun: 20,
            grenadeLauncher: 25,
            dualUzis: 20
        };
        let off = offsetMap[weapon] || 20;
        return {
            x: px + Math.cos(angle) * off,
            y: py + Math.sin(angle) * off
        };
    }

    function shootWeapon() {
        if (gameOver || gameState !== "playing") return;
        if (player.weapon === "laser") return; // Laser handled continuously in update

        let angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
        let muzzle = getMuzzlePosition(player.x, player.y, angle, player.weapon);

        let bulletSpeed = 15;
        // ADDED/CHANGED: revolve bullet near-instant
        if (player.weapon === "revolver") {
            bulletSpeed = 30;
        }

        if (player.weapon === "sniperRifle") {
            bulletSpeed = 45; // or any other value you want to set
        }

        // Double Pistol
        if (player.weapon === "pistolDouble") {
            if (player.reloading) return;
            if (!(gameMode === "god" || gameMode === "test") && player.ammo <= 0) {
                reloadGun();
                return;
            }
            let spreadAngle = 0.035;
            let angleLeft = angle - spreadAngle / 2;
            let angleRight = angle + spreadAngle / 2;

            let bulletLeft = {
                x: muzzle.x,
                y: muzzle.y,
                dx: Math.cos(angleLeft) * bulletSpeed,
                dy: Math.sin(angleLeft) * bulletSpeed,
                spawnTime: Date.now(),
                source: "pistolDouble"
            };
            let bulletRight = {
                x: muzzle.x,
                y: muzzle.y,
                dx: Math.cos(angleRight) * bulletSpeed,
                dy: Math.sin(angleRight) * bulletSpeed,
                spawnTime: Date.now(),
                source: "pistolDouble"
            };
            bullets.push(bulletLeft, bulletRight);

            if (!(gameMode === "god" || gameMode === "test")) {
                player.ammo -= 1; // each shot uses 1 ammo
            }
            playGunshotSound();
            applyKnockback(angle, "pistolDouble"); // ADDED: knockback
            // Add screen shake (increase intensity by 2, capped at 10)
            screenShake = Math.min(screenShake + 2, 10);
            player.lastShotTime = Date.now();
            return;
        }

        // Standard pistol
        if (player.weapon === "pistol") {
            if (player.reloading) return;
            if (!(gameMode === "god" || gameMode === "test") && player.ammo <= 0) {
                reloadGun();
                return;
            }
            let bullet = {
                x: muzzle.x,
                y: muzzle.y,
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
            applyKnockback(angle, "pistol");
            // Add screen shake (increase intensity by 2, capped at 10)
            screenShake = Math.min(screenShake + 2, 10);
            player.lastShotTime = Date.now();
        }
        else if (player.weapon === "machineGun") {
            if (!player.activeGun || player.activeGun.ammo <= 0) {
                player.activeGun = { type: null, ammo: 0 };
                player.weapon = "pistol";
                return;
            }
            let bullet = {
                x: muzzle.x,
                y: muzzle.y,
                dx: Math.cos(angle) * bulletSpeed,
                dy: Math.sin(angle) * bulletSpeed,
                spawnTime: Date.now(),
                source: "machineGun"
            };
            bullets.push(bullet);
            if (!(gameMode === "god" || gameMode === "test")) {
                player.activeGun.ammo--;
            }
            playGunshotSound();
            applyKnockback(angle, "machineGun");
            // Add screen shake (increase intensity by 2, capped at 10)
            screenShake = Math.min(screenShake + 2, 10);

            player.lastShotTime = Date.now();
            if (player.activeGun.ammo <= 0) {
                player.activeGun = { type: null, ammo: 0 };
                player.weapon = "pistol";
            }
            player.lastShotTime = Date.now();
        }
        else if (player.weapon === "miniGun") {
            if (!player.activeGun || player.activeGun.ammo <= 0) {
                player.activeGun = { type: null, ammo: 0 };
                player.weapon = "pistol";
                return;
            }
            let bullet = {
                x: muzzle.x,
                y: muzzle.y,
                dx: Math.cos(angle) * bulletSpeed,
                dy: Math.sin(angle) * bulletSpeed,
                spawnTime: Date.now(),
                source: "miniGun"
            };
            bullets.push(bullet);
            if (!(gameMode === "god" || gameMode === "test")) {
                player.activeGun.ammo--;
            }
            playGunshotSound();
            applyKnockback(angle, "miniGun");
            // Add screen shake (increase intensity by 2, capped at 10)
            screenShake = Math.min(screenShake + 2, 10);

            player.lastShotTime = Date.now();
            if (player.activeGun.ammo <= 0) {
                player.activeGun = { type: null, ammo: 0 };
                player.weapon = "pistol";
            }
            player.lastShotTime = Date.now();
        }
        else if (player.weapon === "shotgun") {
            if (!player.activeGun || player.activeGun.ammo <= 0) {
                player.activeGun = { type: null, ammo: 0 };
                player.weapon = "pistol";
                return;
            }
            let offsets = [-Math.PI / 16, -Math.PI / 28, 0, Math.PI / 28, Math.PI / 16];
            for (let offset of offsets) {
                let newAngle = angle + offset;
                let bullet = {
                    x: muzzle.x,
                    y: muzzle.y,
                    dx: Math.cos(newAngle) * bulletSpeed,
                    dy: Math.sin(newAngle) * bulletSpeed,
                    spawnTime: Date.now(),
                    source: "shotgun"
                };
                bullets.push(bullet);
            }
            if (!(gameMode === "god" || gameMode === "test")) {
                player.activeGun.ammo--;
            }
            playGunshotSound();
            applyKnockback(angle, "shotgun");
            // Add screen shake (increase intensity by 2, capped at 10)
            screenShake = Math.min(screenShake + 2, 10);

            player.lastShotTime = Date.now();
            if (player.activeGun.ammo <= 0) {
                player.activeGun = { type: null, ammo: 0 };
                player.weapon = "pistol";
            }
            player.lastShotTime = Date.now();
        }
        else if (player.weapon === "rocketLauncher") {
            if (player.rocketAmmo <= 0) {
                player.weapon = "pistol";
                return;
            }
            let rocketSpeed = 10;
            let rocket = {
                x: muzzle.x,
                y: muzzle.y,
                dx: Math.cos(angle) * rocketSpeed,
                dy: Math.sin(angle) * rocketSpeed,
                spawnTime: Date.now(),
                source: "rocket"
            };
            bullets.push(rocket);
            //  player.rocketAmmo--; I removed this
            playRocketLaunchSound();
            applyKnockback(angle, "rocketLauncher");
            // Add screen shake (increase intensity by 2, capped at 10)
            screenShake = Math.min(screenShake + 2, 10);

            player.lastShotTime = Date.now();
            // start of addition - I added this for rocket bullet count
            if (player.activeGun.ammo <= 0) {
                player.activeGun = { type: null, ammo: 0 };
                player.weapon = "pistol";
            }
            // end of addition
            spawnParticle(
                muzzle.x,
                muzzle.y,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                8,
                15,
                "rgba(255,140,0,ALPHA)"
            );
            player.lastShotTime = Date.now();
        }
        else if (player.weapon === "crossbow") {
            if (player.crossbowReloading) return;
            if (player.crossbowAmmo <= 0) return;
            let bulletSpeed = 20;
            let bolt = {
                x: muzzle.x,
                y: muzzle.y,
                dx: Math.cos(angle) * bulletSpeed,
                dy: Math.sin(angle) * bulletSpeed,
                spawnTime: Date.now(),
                source: "crossbow"
            };
            bullets.push(bolt);
            player.crossbowAmmo--;
            player.crossbowReloading = true;
            player.crossbowReloadStart = Date.now();
            setTimeout(() => { player.crossbowReloading = false; }, player.crossbowReloadTime);
            playGunshotSound();
            applyKnockback(angle, "crossbow");
            // Add screen shake (increase intensity by 2, capped at 10)
            screenShake = Math.min(screenShake + 2, 10);

            player.lastShotTime = Date.now();
            player.lastShotTime = Date.now();
        }
        // Now for new guns:
        else if (player.weapon === "revolver") {
            // ADDED/CHANGED: revolveShots usage, near-instant bullet, +1 damage
            if (revolveReloading) return;
            if (revolveShots <= 0) {
                reloadRevolver();
                return;
            }
            // Fire
            let bullet = {
                x: muzzle.x,
                y: muzzle.y,
                dx: Math.cos(angle) * bulletSpeed,
                dy: Math.sin(angle) * bulletSpeed,
                spawnTime: Date.now(),
                source: "revolver",
                penetration: 2 // can pass x zombie
            };
            bullets.push(bullet);
            revolveShots--;
            playGunshotSound();
            applyKnockback(angle, "revolver");
            // Add screen shake (increase intensity by 2, capped at 10)
            screenShake = Math.min(screenShake + 2, 10);
            player.lastShotTime = Date.now();
        }
        // Enhancement: Plasma Rifle Plasma Sphere
        else if (player.weapon === "plasmaRifle") {
            if (!player.activeGun || player.activeGun.ammo <= 0) {
                player.activeGun = { type: null, ammo: 0 };
                player.weapon = "pistol";
                return;
            }
            let plasmaBullet = {
                x: muzzle.x,
                y: muzzle.y,
                dx: Math.cos(angle) * bulletSpeed,
                dy: Math.sin(angle) * bulletSpeed,
                spawnTime: Date.now(),
                source: "plasmaRifle",   // marks this as a plasma rifle bullet
                plasma: true,            // additional flag (if needed later)
                radius: 6                // set the bullet's sphere radius
            };
            bullets.push(plasmaBullet);
            if (!(gameMode === "god" || gameMode === "test")) {
                player.activeGun.ammo--;
            }
            playGunshotSound();
            applyKnockback(angle, "plasmaRifle");
            screenShake = Math.min(screenShake + 1, 10);
            player.lastShotTime = Date.now();
        }
        else if (
            player.weapon === "sniperRifle" ||
            player.weapon === "freezeCannon" || player.weapon === "lightningGun" ||
            player.weapon === "bfg9000" || player.weapon === "acidGun" ||
            player.weapon === "grenadeLauncher" || player.weapon === "dualUzis"
        ) {
            if (!player.activeGun || player.activeGun.ammo <= 0) {
                player.activeGun = { type: null, ammo: 0 };
                player.weapon = "pistol";
                return;
            }
            let bullet = {
                x: muzzle.x,
                y: muzzle.y,
                dx: Math.cos(angle) * bulletSpeed,
                dy: Math.sin(angle) * bulletSpeed,
                spawnTime: Date.now(),
                source: player.weapon
            };
            bullets.push(bullet);
            if (!(gameMode === "god" || gameMode === "test")) {
                player.activeGun.ammo--;
            }
            playGunshotSound();
            applyKnockback(angle, player.weapon);
            // Add screen shake (increase intensity by 2, capped at 10)
            screenShake = Math.min(screenShake + 2, 10);
            player.lastShotTime = Date.now();
        }
    }

    // ADDED: revolve reload
    function reloadRevolver() {
        if (gameMode === "god" || gameMode === "test") return;
        if (!revolveReloading && player.weapon === "revolver" && revolveShots < revolveMagazine) {
            if (revolveAmmo <= 0) return; // no ammo left to reload
            revolveReloading = true;
            revolveReloadStart = Date.now();
            revolveReloadDuration = revolveReloadTime;
            revolvePenaltyActive = false;
            playReloadStartSound();
            // Add screen shake (increase intensity by 2, capped at 10)
            screenShake = Math.min(screenShake + 2, 10);
            player.lastShotTime = Date.now();
        }
    }

    // Attempt quick reload for revolve
    function attemptQuickReloadRevolver() {
        if (!revolveReloading) return;

        let reloadElapsed = Date.now() - revolveReloadStart;
        let progress = reloadElapsed / revolveReloadDuration;
        const QUICK_RELOAD_ZONE_START = 0.3;
        const QUICK_RELOAD_ZONE_END = 0.4;

        if (revolvePenaltyActive) return;

        if (progress >= QUICK_RELOAD_ZONE_START && progress <= QUICK_RELOAD_ZONE_END) {
            // fill revolveShots from revolveAmmo
            let needed = revolveMagazine - revolveShots;
            let toLoad = Math.min(needed, revolveAmmo);
            revolveShots += toLoad;
            revolveAmmo -= toLoad;

            revolveReloading = false;
            revolvePenaltyActive = false;
            playReloadEndSound();
        } else {
            // penalty
            if (progress < QUICK_RELOAD_ZONE_START) {
                revolveReloadStart = Date.now();
                revolveReloadDuration += 500;
            } else if (progress > QUICK_RELOAD_ZONE_END) {
                let targetElapsed = revolveReloadDuration * QUICK_RELOAD_ZONE_START;
                revolveReloadStart = Date.now() - targetElapsed;
                revolveReloadDuration += 1000;
            }
            revolvePenaltyActive = true;
        }
    }

    // For the standard pistol
    function reloadGun() {
        if (gameMode === "god" || gameMode === "test") return;
        if (!player.reloading &&
            (player.weapon === "pistol" || player.weapon === "pistolDouble") &&
            player.ammo < player.magazine
        ) {
            player.reloading = true;
            player.reloadStart = Date.now();
            player.reloadDuration = player.reloadTime;
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

        if (player.penaltyActive) return;

        if (progress >= QUICK_RELOAD_ZONE_START && progress <= QUICK_RELOAD_ZONE_END) {
            player.ammo = player.magazine;
            player.reloading = false;
            player.penaltyActive = false;
            playReloadEndSound();
        } else {
            if (progress < QUICK_RELOAD_ZONE_START) {
                player.reloadStart = Date.now();
                player.reloadDuration += 500;
            } else if (progress > QUICK_RELOAD_ZONE_END) {
                let targetElapsed = player.reloadDuration * QUICK_RELOAD_ZONE_START;
                player.reloadStart = Date.now() - targetElapsed;
                player.reloadDuration += 1000;
            }
            player.penaltyActive = true;
        }
    }

    function attemptQuickReloadRevolver() {
        // placeholder if needed—already defined above
    }

    // ---------------------
    // ZOMBIE SPAWNING
    // ---------------------
    setInterval(spawnZombie, 2000);

    function spawnZombie() {
        if (gameOver || gameState !== "playing") return;

        // ADDED: multiple boss logic
        if (zombieKills >= nextBossKillsThreshold && !isBossAlive()) {
            spawnBossZombie();
            nextBossKillsThreshold += 20;
            return;
        }

        let side = Math.floor(Math.random() * 4);
        let x, y;
        const offset = 30;
        if (side === 0) {
            x = Math.random() * width;
            y = -offset;
        }
        else if (side === 1) {
            x = width + offset;
            y = Math.random() * height;
        }
        else if (side === 2) {
            x = Math.random() * width;
            y = height + offset;
        }
        else {
            x = -offset;
            y = Math.random() * height;
        }

        let speedFactor = 0.8 + 0.1 * Math.floor(zombieKills / 20);
        if (speedFactor > 1) speedFactor = 1;
        let baseSpeed = 0.5 + Math.random() * 2;
        let zombieSpeed = baseSpeed * speedFactor;

        let zombie = {
            x,
            y,
            speed: zombieSpeed,
            radius: 20,
            dying: false,
            deathTimer: 30,
            initialDeathTimer: 30,
            crawling: false,
            walkCycle: Math.random() * Math.PI * 2,
            health: 1,
            headDecapitated: false,
            leftArmDetached: false,
            rightArmDetached: false,
            leftLegDetached: false,
            rightLegDetached: false,
            currencyDropped: false,
            limbs: {
                head: { attached: true, x: 0, y: -15, radius: 10 },
                leftArm: { attached: true, x: -10, y: 0, radius: 5 },
                rightArm: { attached: true, x: 10, y: 0, radius: 5 },
                leftLeg: { attached: true, x: -10, y: 30, radius: 5 },
                rightLeg: { attached: true, x: 10, y: 30, radius: 5 }
            },
            elite: false,
            wanderOffset: (Math.random() - 0.5) * 0.4,
            armSwingAmplitude: 3 + Math.random() * 3,
            leftArmPhase: Math.random() * Math.PI * 2,
            rightArmPhase: Math.random() * Math.PI * 2
        };
        if (Math.random() < 0.1) {
            zombie.elite = true;
            zombie.health = 6;
        }
        else {
            zombie.health = 2;
        }

        zombies.push(zombie);
    }

    function spawnBossZombie() {
        let boss = {
            x: width / 2,
            y: -100,
            speed: 1.2,
            radius: 40,
            dying: false,
            deathTimer: 60,
            initialDeathTimer: 60,
            crawling: false,
            walkCycle: 0,
            health: 20,
            headDecapitated: false,
            currencyDropped: false,
            limbs: {
                head: { attached: true, x: 0, y: -30, radius: 15 },
                leftArm: { attached: true, x: -20, y: 0, radius: 5 },
                rightArm: { attached: true, x: 20, y: 0, radius: 5 },
                leftLeg: { attached: true, x: -15, y: 45, radius: 5 },
                rightLeg: { attached: true, x: 15, y: 45, radius: 5 }
            },
            elite: true,
            wanderOffset: 0,
            armSwingAmplitude: 4,
            leftArmPhase: Math.random() * Math.PI * 2,
            rightArmPhase: Math.random() * Math.PI * 2,
            isBoss: true // ADDED
        };
        zombies.push(boss);
    }

    function spawnCrawlerZombie() {
        let side = Math.floor(Math.random() * 4);
        let x, y;
        const offset = 30;
        if (side === 0) {
            x = Math.random() * width;
            y = -offset;
        }
        else if (side === 1) {
            x = width + offset;
            y = Math.random() * height;
        }
        else if (side === 2) {
            x = Math.random() * width;
            y = height + offset;
        }
        else {
            x = -offset;
            y = Math.random() * height;
        }

        let crawler = {
            x,
            y,
            speed: 0.3,
            radius: 15,
            dying: false,
            deathTimer: 30,
            initialDeathTimer: 30,
            crawling: true,
            walkCycle: Math.random() * Math.PI * 2,
            health: 1,
            headDecapitated: false,
            currencyDropped: false,
            limbs: {
                head: { attached: true, x: 0, y: -10, radius: 8 },
                leftArm: { attached: true, x: -8, y: 0, radius: 4 },
                rightArm: { attached: true, x: 8, y: 0, radius: 4 },
                leftLeg: { attached: false },
                rightLeg: { attached: false }
            },
            elite: false,
            wanderOffset: (Math.random() - 0.5) * 0.4, 
            armSwingAmplitude: 1.5,
            leftArmPhase: Math.random() * Math.PI * 2,
            rightArmPhase: Math.random() * Math.PI * 2,
            isCrawler: true
        };
        zombies.push(crawler);
    }

    setInterval(spawnPowerUp, 10000);
    function spawnPowerUp() {
        if (gameOver || gameState !== "playing") return;
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

        if (powerUps.some(p => p.type === type)) {
            return;
        }

        const margin = 50;
        const x = margin + Math.random() * (width - 2 * margin);
        const y = margin + Math.random() * (height - 2 * margin);
        powerUps.push({ type, x, y, radius: 15, spawnTime: Date.now() });
    }

    // ---------------------
    // UTILITY
    // ---------------------
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    // ---------------------
    // BLOOD SPLATTER
    // ---------------------
    function spawnBloodSplatter(x, y) {
        const count = 10;
        for (let i = 0; i < count; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = Math.random() * 4;
            spawnParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 1.5 + Math.random() * 2, 30, "rgba(220,20,60,ALPHA)");
        }
    }

    // ---------------------
    // ROCKET EXPLOSION
    // ---------------------
    function explodeRocket(rocket) {
        let dx = mouse.x - rocket.x;
        let dy = mouse.y - rocket.y;
        let explosionRadius = Math.min(50 + Math.sqrt(dx * dx + dy * dy) / 10, 150);

        zombies.forEach((z) => {
            if (!z.dying && distance(rocket.x, rocket.y, z.x, z.y) <= explosionRadius + z.radius) {
                zombieKills++;
                playZombieKillSound();
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
                if (!z.currencyDropped) {
                    maybeDropCurrency(z.x, z.y, z.elite);
                    z.currencyDropped = true;
                }
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
    // HUD
    // ---------------------
    function drawHUD() {
        const hudMarginLeft = 20;
        const hudMarginTop = 20;
        const lineHeight = 24;
        let lines = [];
        lines.push("Money: $" + player.money);
        lines.push("Lives: " + player.lives);

        if (player.activeGun && player.activeGun.type) {
            if (player.activeGun.type === "flamethrower") {
                lines.push("Fuel (" + player.activeGun.type + "): " + Math.floor(player.activeGun.fuel));
            } else {
                lines.push("Ammo (" + player.activeGun.type + "): " +
                    (player.activeGun.ammo === Infinity ? "∞" : player.activeGun.ammo));
            }
        } else if (player.weapon === "pistol") {
            lines.push("Ammo: " + player.ammo + " / " + player.magazine);
        } else if (player.weapon === "pistolDouble") {
            lines.push("Ammo (Double Pistol): " + player.ammo + " / " + player.magazine);
        } else if (player.weapon === "crossbow") {
            lines.push("Ammo (Crossbow): " + player.crossbowAmmo + " bolts");
        } else if (player.weapon === "laser") {
            lines.push("Laser Ammo: " + player.laserAmmo);
        } else if (player.weapon === "rocketLauncher") {
            lines.push("Rocket Ammo: " + player.rocketAmmo);
        }
        // ADDED: revolveShots display
        else if (player.weapon === "revolver") {
            lines.push(`Revolver Shots: ${revolveShots}/${revolveMagazine} (Ammo left: ${revolveAmmo})`);
        }

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
    // GAME UPDATE
    // ---------------------
    function update() {

        // Gradually reduce screen shake intensity
        screenShake *= 0.9;
        if (screenShake < 0.1) screenShake = 0;


        if (gameState !== "playing") return;

        if (player.healthRegenRate > 0 && Date.now() - player.lastRegenTime >= 5000) {
            player.lives += player.healthRegenRate;
            player.lastRegenTime = Date.now();
        }

        if (gameMode === "god" || gameMode === "test") {
            player.ammo = player.magazine;
            if (player.activeGun && player.activeGun.type && player.weapon !== "pistol") {
                player.activeGun.ammo = Infinity;
            }
            revolveAmmo = 999; // effectively unlimited in god/test
            revolveShots = revolveMagazine;
        }

        if (gameMode === "god") {
            player.speed = player.baseSpeed * 2;
        } else {
            player.speed = player.baseSpeed * (player.powerUps.speed ? 1.5 : 1);
        }

        let moving = false;
        if (keys['w'] || keys['ArrowUp']) { player.y -= player.speed; moving = true; }
        if (keys['s'] || keys['ArrowDown']) { player.y += player.speed; moving = true; }
        if (keys['a'] || keys['ArrowLeft']) { player.x -= player.speed; moving = true; }
        if (keys['d'] || keys['ArrowRight']) { player.x += player.speed; moving = true; }
        player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
        if (moving) player.walkCycle += 0.15; else player.walkCycle = 0;
        if (player.recoil > 0) player.recoil = Math.max(player.recoil - 1, 0);

        // Pistol reload update
        if (player.reloading && (player.weapon === "pistol" || player.weapon === "pistolDouble")) {
            let reloadElapsed = Date.now() - player.reloadStart;
            if (reloadElapsed >= player.reloadDuration) {
                player.ammo = player.magazine;
                player.reloading = false;
                player.penaltyActive = false;
                playReloadEndSound();
            }
        }

        // Revolver reload update
        if (revolveReloading && player.weapon === "revolver") {
            let reloadElapsed = Date.now() - revolveReloadStart;
            if (reloadElapsed >= revolveReloadDuration) {
                // fill revolveShots
                let needed = revolveMagazine - revolveShots;
                let toLoad = Math.min(needed, revolveAmmo);
                revolveShots += toLoad;
                revolveAmmo -= toLoad;

                revolveReloading = false;
                revolvePenaltyActive = false;
                playReloadEndSound();
            }
        }

        for (let key in player.powerUps) {
            if (gameMode !== "god" && Date.now() > player.powerUps[key]) {
                delete player.powerUps[key];
            }
        }
        for (let i = powerUps.length - 1; i >= 0; i--) {
            const pwr = powerUps[i];
            if (Date.now() - pwr.spawnTime > 20000) {
                powerUps.splice(i, 1);
                continue;
            }
            if (distance(player.x, player.y, pwr.x, pwr.y) < player.radius + pwr.radius) {
                activatePowerUp(pwr.type);
                powerUps.splice(i, 1);
            }
        }

        if (player.weapon === "machineGun" && mouseDown) {
            let fireInterval = baseMachineGunFireInterval / (1 + player.rapidFireLevel * 0.2);
            if (Date.now() - player.lastShotTime >= fireInterval) {
                shootWeapon();
            }
        }
        if (player.weapon === "miniGun" && mouseDown) {
            let fireInterval = baseMiniGunFireInterval / (1 + player.rapidFireLevel * 0.2);
            if (Date.now() - player.lastShotTime >= fireInterval) {
                shootWeapon();
            }
        }
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
        } else {
            if (player.weapon !== "flamethrower" || !mouseDown) {
                stopFlameSound();
            }
        }
        if (player.weapon === "laser" && mouseDown) {
            let laserFireInterval = 100;
            if (Date.now() - player.lastShotTime >= laserFireInterval) {
                if (player.laserAmmo > 0) {
                    player.laserAmmo--;
                    playLaserSound();
                    player.lastShotTime = Date.now();
                    laserBeams.push({
                        x: player.x,
                        y: player.y,
                        angle: player.angle,
                        spawnTime: Date.now(),
                        duration: 100
                    });
                    let beamWidth = 10;
                    let beamLength = Math.sqrt(width * width + height * height);
                    let laserDamage = 0.5 * player.damageMultiplier;

                    for (let i = zombies.length - 1; i >= 0; i--) {
                        let z = zombies[i];
                        if (z.dying) continue;
                        let dx = z.x - player.x;
                        let dy = z.y - player.y;
                        let proj = dx * Math.cos(player.angle) + dy * Math.sin(player.angle);
                        if (proj < 0 || proj > beamLength) continue;
                        let perpDist = Math.abs(-Math.sin(player.angle) * dx + Math.cos(player.angle) * dy);
                        if (perpDist < beamWidth + z.radius) {
                            z.health -= laserDamage;
                            spawnBloodSplatter(z.x, z.y);

                            if (z.health <= 0 && !z.dying) {
                                zombieKills++;
                                playZombieKillSound();
                                z.dying = true;
                                z.deathTimer = 60;
                                z.initialDeathTimer = 60;
                                z.fallAngle = player.angle;
                                z.fallVector = {
                                    dx: Math.cos(player.angle) * 5,
                                    dy: Math.sin(player.angle) * 5
                                };
                                if (!z.currencyDropped) {
                                    maybeDropCurrency(z.x, z.y, z.elite);
                                    z.currencyDropped = true;
                                }
                            }
                        }
                    }
                } else {
                    player.weapon = "pistol";
                }
            }
        }

        // Update bullets
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

            // More smoke for revolver
            let colorMap = {
                pistol: "rgba(60,60,60,ALPHA)",
                pistolDouble: "rgba(60,60,150,ALPHA)",
                machineGun: "rgba(50,50,50,ALPHA)",
                miniGun: "rgba(80,80,80,ALPHA)",
                shotgun: "rgba(139,69,19,ALPHA)",
                crossbow: "rgba(160,82,45,ALPHA)",
                sniperRifle: "rgba(255,0,0,ALPHA)",
                revolver: "rgba(128,0,0,ALPHA)", // dark red for revolver
                plasmaRifle: "rgba(0,255,255,ALPHA)",
                freezeCannon: "rgba(0,255,255,ALPHA)",
                lightningGun: "rgba(255,255,0,ALPHA)",
                bfg9000: "rgba(0,255,0,ALPHA)",
                acidGun: "rgba(0,128,0,ALPHA)",
                grenadeLauncher: "rgba(90,90,90,ALPHA)",
                dualUzis: "rgba(100,100,100,ALPHA)",
                flamethrower: "rgba(255,165,0,ALPHA)",
                rocket: "rgba(255,140,0,ALPHA)"
            };
            let bulletColor = colorMap[b.source] || "rgba(0,0,0,ALPHA)";

            // Denser smoke for revolver bullet
            if (b.source === "revolver") {
                for (let s = 0; s < 3; s++) {
                    spawnParticle(b.x, b.y, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, 2, 15, bulletColor);
                }
            } else {
                spawnParticle(b.x, b.y, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, 1, 15, bulletColor);
            }

            if (b.source === "flamethrower" && distance(b.startX, b.startY, b.x, b.y) > 100) {
                bullets.splice(i, 1);
                continue;
            }
            if (b.x < 0 || b.x > width || b.y < 0 || b.y > height) {
                bullets.splice(i, 1);
            }
        }

        // Update zombies
        for (let i = zombies.length - 1; i >= 0; i--) {
            let z = zombies[i];
            if (!z.dying) {
                let effectiveSpeed = z.speed;
                if (player.powerUps.slowMotion) effectiveSpeed *= 0.5;
                if (freezeEndTime && Date.now() < freezeEndTime) effectiveSpeed *= 0.5;
                if (z.crawling) effectiveSpeed *= 0.3;

                const baseAngle = Math.atan2(player.y - z.y, player.x - z.x);
                z.wanderOffset += (Math.random() - 0.5) * 0.055; // the last value increases the zombie wandering 
                let angle = baseAngle + z.wanderOffset;

                z.walkCycle += effectiveSpeed * 0.03;

                z.x += Math.cos(angle) * effectiveSpeed;
                z.y += Math.sin(angle) * effectiveSpeed;

                // Player collision
                if (distance(z.x, z.y, player.x, player.y) < z.radius + player.radius) {
                    if (Date.now() < (player.invulnerableUntil || 0)) {
                        // no effect
                    } else if (gameMode === "god" || player.powerUps.shield) {
                        if (!z.dying) {
                            zombieKills++;
                            playZombieKillSound();
                            z.dying = true;
                            z.deathTimer = 60;
                            z.initialDeathTimer = 60;
                            z.fallAngle = 0;
                            z.fallVector = { dx: 0, dy: 2 };
                            spawnBloodSplatter(z.x, z.y);
                            if (!z.currencyDropped) {
                                maybeDropCurrency(z.x, z.y, z.elite);
                                z.currencyDropped = true;
                            }
                        }
                    } else if (player.extraArmor > 0) {
                        player.extraArmor--;
                        if (!z.dying) {
                            zombieKills++;
                            playZombieKillSound();
                            z.dying = true;
                            z.deathTimer = 60;
                            z.initialDeathTimer = 60;
                            z.fallAngle = 0;
                            z.fallVector = { dx: 0, dy: 2 };
                            spawnBloodSplatter(z.x, z.y);
                            if (!z.currencyDropped) {
                                maybeDropCurrency(z.x, z.y, z.elite);
                                z.currencyDropped = true;
                            }
                        }
                    } else if (player.lives > 1) {
                        player.lives--;
                        player.invulnerableUntil = Date.now() + 2000;
                        if (!z.dying) {
                            zombieKills++;
                            playZombieKillSound();
                            z.dying = true;
                            z.deathTimer = 60;
                            z.initialDeathTimer = 60;
                            z.fallAngle = 0;
                            z.fallVector = { dx: 0, dy: 2 };
                            spawnBloodSplatter(z.x, z.y);
                            if (!z.currencyDropped) {
                                maybeDropCurrency(z.x, z.y, z.elite);
                                z.currencyDropped = true;
                            }
                        }
                    } else {
                        gameOver = true;
                        showGameOverOverlay();
                    }
                }
            } else {
                // Dying
                z.x += z.fallVector.dx;
                z.y += z.fallVector.dy;
                z.fallVector.dx *= 0.95;
                z.fallVector.dy *= 0.95;
                z.deathTimer--;
                if (z.deathTimer <= 0) {
                    // If boss => drop treasure
                    if (z.isBoss) {
                        dropBossTreasure(z.x, z.y);
                    }
                    if (!z.currencyDropped) {
                        maybeDropCurrency(z.x, z.y, z.elite);
                        z.currencyDropped = true;
                    }
                    zombies.splice(i, 1);
                }
            }
        }

        // Collision with bullets
        for (let i = zombies.length - 1; i >= 0; i--) {
            let z = zombies[i];
            if (!z.dying) {
                for (let j = bullets.length - 1; j >= 0; j--) {
                    let b = bullets[j];

                    // Enhancement: Plasma Rifle Plasma Hit Effect - START
                    if (b.source === "plasmaRifle" && distance(z.x, z.y, b.x, b.y) < z.radius + 5) {
                        // Spawn the plasma hit effect at the bullet's position
                        plasmaEffects.push({
                            x: b.x,
                            y: b.y,
                            startTime: Date.now(),
                            duration: 200,      // Duration of effect in milliseconds
                            maxRadius: 40,      // Maximum effect radius in pixels
                            currentRadius: 0,
                            alpha: 1
                        });
                        // Apply plasma damage (adjust baseDamage as needed)
                        let baseDamage = 2;
                        let damage = baseDamage * player.damageMultiplier;
                        if (Math.random() < player.critChance) damage *= 2;
                        z.health -= damage;
                        if (z.health <= 0 && !z.dying) {
                            zombieKills++;
                            playZombieKillSound();
                            spawnBloodSplatter(z.x, z.y);
                            z.dying = true;
                            z.deathTimer = 60;
                            z.initialDeathTimer = 60;
                            let fallImpactFactor = 0.5;
                            z.fallAngle = Math.atan2(b.dy, b.dx);
                            z.fallVector = { dx: b.dx * fallImpactFactor, dy: b.dy * fallImpactFactor };
                            if (!z.currencyDropped) {
                                maybeDropCurrency(z.x, z.y, z.elite);
                                z.currencyDropped = true;
                            }
                        }
                        // Remove the plasma rifle bullet from the bullets array
                        bullets.splice(j, 1);
                        continue; // Skip further collision checks for this bullet
                    }
                    // Enhancement: Plasma Rifle Plasma Hit Effect - END


                    if (b.source === "flamethrower") {
                        collisionTolerance = 10;
                    } else if (b.source === "revolver") {
                        collisionTolerance = 6; // or some larger number
                    } else {
                        collisionTolerance = 3;
                    }
                    let relativeBulletX = b.x - z.x;
                    let relativeBulletY = b.y - z.y;

                    // Check limbs
                    for (let limbName in z.limbs) {
                        if (!z.limbs.hasOwnProperty(limbName)) continue;
                        let limb = z.limbs[limbName];
                        if (!limb.attached) continue;

                        let limbDistance = distance(relativeBulletX, relativeBulletY, limb.x, limb.y);
                        if (limbDistance < limb.radius + collisionTolerance) {
                            // Limb hit
                            limb.attached = false;
                            if (limbName === "head") z.headDecapitated = true;
                            detachedLimbs.push({
                                type: limbName,
                                x: z.x + limb.x,
                                y: z.y + limb.y,
                                vx: b.dx * 0.8 + (Math.random() - 0.5) * 2,
                                vy: b.dy * 0.8 + (Math.random() - 0.5) * 2,
                                rotation: Math.random() * Math.PI * 2,
                                angularVelocity: (Math.random() - 0.5) * 0.2,
                                life: 120,
                                maxLife: 120
                            });
                            spawnBloodSplatter(z.x + limb.x, z.y + limb.y);

                            let baseDamage = (limbName === "head") ? 2 : 0.5;
                            if (limbName === "head") playZombieHeadshotSound();
                            else playZombieHitSound();

                            // ADDED: revolve bullet does +1 base damage => baseDamage=2 for revolve body, 3 for revolve head
                            if (b.source === "revolver") {
                                baseDamage += 1;
                            }
                            let damage = baseDamage * player.damageMultiplier;
                            if (Math.random() < player.critChance) damage *= 2;
                            z.health -= damage;

                            if (z.health <= 0 && !z.dying) {
                                zombieKills++;
                                playZombieKillSound();
                                spawnBloodSplatter(z.x, z.y);
                                z.dying = true;
                                z.deathTimer = 60;
                                z.initialDeathTimer = 60;
                                let fallImpactFactor = (b.source === "pistol") ? 0.2 : 0.5;
                                z.fallAngle = Math.atan2(b.dy, b.dx);
                                z.fallVector = { dx: b.dx * fallImpactFactor, dy: b.dy * fallImpactFactor };
                                if (!z.currencyDropped) {
                                    maybeDropCurrency(z.x, z.y, z.elite);
                                    z.currencyDropped = true;
                                }
                            }

                            // revolve bullet penetration logic
                            if (b.source === "revolver") {
                                if (b.penetration > 0) {
                                    b.penetration -= 1;
                                    if (b.penetration <= 0) {
                                        bullets.splice(j, 1);
                                    }
                                } else {
                                    bullets.splice(j, 1);
                                }
                            } else {
                                bullets.splice(j, 1);
                            }

                            if (!z.limbs.leftLeg.attached && !z.limbs.rightLeg.attached) {
                                z.crawling = true;
                            }
                            break;
                        }
                    }




                    // Body hit check
                    if (distance(z.x, z.y, b.x, b.y) < z.radius + collisionTolerance) {
                        playZombieHitSound();
                        let baseDamage = 1;
                        // revolve bullet +1 damage
                        if (b.source === "revolver") {
                            baseDamage = 2;
                        }

                        let damage = baseDamage * player.damageMultiplier;
                        if (Math.random() < player.critChance) damage *= 2;
                        z.health -= damage;

                        if (z.health <= 0 && !z.dying) {
                            zombieKills++;
                            playZombieKillSound();
                            spawnBloodSplatter(z.x, z.y);
                            z.dying = true;
                            z.deathTimer = 60;
                            z.initialDeathTimer = 60;
                            let fallImpactFactor = (b.source === "pistol") ? 0.2 : 0.5;
                            z.fallAngle = Math.atan2(b.dy, b.dx);
                            z.fallVector = { dx: b.dx * fallImpactFactor, dy: b.dy * fallImpactFactor };
                            if (!z.currencyDropped) {
                                maybeDropCurrency(z.x, z.y, z.elite);
                                z.currencyDropped = true;
                            }
                        }
                        // revolve bullet penetration
                        if (b.source === "revolver") {
                            if (b.penetration > 0) {
                                b.penetration -= 1;
                                if (b.penetration <= 0) {
                                    bullets.splice(j, 1);
                                }
                            } else {
                                bullets.splice(j, 1);
                            }
                        } else {
                            bullets.splice(j, 1);
                        }
                    }
                }
            }
        }

        // Enhancement: Plasma Rifle Plasma Hit Effect - START
        for (let i = plasmaEffects.length - 1; i >= 0; i--) {
            let effect = plasmaEffects[i];
            let elapsed = Date.now() - effect.startTime;
            let progress = elapsed / effect.duration;
            effect.currentRadius = effect.maxRadius * progress;
            effect.alpha = 1 - progress;
            if (progress >= 1) {
                plasmaEffects.splice(i, 1);
            }
        }
        // Enhancement: Plasma Rifle Plasma Hit Effect - END

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
    // DRAW
    // ---------------------
    function draw() {
        ctx.clearRect(0, 0, width, height);
        // Enhancement: Plasma Rifle Plasma Hit Effect - START
        for (let effect of plasmaEffects) {
            ctx.save();
            // Draw the expanding plasma sphere with a radial gradient
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.currentRadius, 0, Math.PI * 2);

            // Replace the existing gradient stops with bright cyan stops
            let gradient = ctx.createRadialGradient(
                effect.x, effect.y, effect.currentRadius * 0.2,
                effect.x, effect.y, effect.currentRadius
            );
            gradient.addColorStop(0, "rgba(0,255,255," + (effect.alpha * 0.8) + ")"); // bright cyan at the center
            gradient.addColorStop(0.5, "rgba(0,255,255," + (effect.alpha * 0.8) + ")"); // bright cyan in the middle
            gradient.addColorStop(1, "rgba(0,139,139," + (effect.alpha * 0.8) + ")");  // dark cyan at the edges with 20% transparency
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.stroke();
            // Optionally, add a few random lightning-like lines for extra effect
            for (let j = 0; j < 3; j++) { // Adjust the number of lightning-like lines
                ctx.beginPath(); // Start a new path
                let angle = Math.random() * Math.PI * 2; // Random angle
                let len = effect.currentRadius * (0.5 + Math.random() * 0.5); // Random length
                ctx.moveTo(effect.x, effect.y); // Start at the center
                ctx.lineTo(effect.x + Math.cos(angle) * len, effect.y + Math.sin(angle) * len); // Draw a lightning-like line
                ctx.strokeStyle = "rgba(255,255,255," + (effect.alpha * 1) + ")"; // Plasma lightning color with some transparency
                ctx.lineWidth = 0.8; // Adjust the line width
                ctx.stroke();
            }
            ctx.restore();
        }
        // Enhancement: Plasma Rifle Plasma Hit Effect - END

        // Compute a random offset based on the current shake intensity
        let shakeX = (Math.random() - 0.5) * screenShake;
        let shakeY = (Math.random() - 0.5) * screenShake;
        // Save the current state and translate the canvas
        ctx.save();
        ctx.translate(shakeX, shakeY);
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
            if (b.source === "plasmaRifle") { // Enhancement: Plasma Rifle Plasma Sphere drawing
                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.fillStyle = "cyan"; // plasma color
                ctx.beginPath();
                ctx.arc(0, 0, b.radius || 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                continue; // Skip further drawing for this bullet
            }
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

        for (let z of zombies) {
            drawZombie(z);
        }

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

        for (let limb of detachedLimbs) {
            ctx.save();
            ctx.translate(limb.x, limb.y);
            ctx.rotate(limb.rotation);
            ctx.fillStyle = "red";
            ctx.strokeStyle = "darkred";
            ctx.lineWidth = 2;

            if (limb.type === "head") {
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            } else if (limb.type.includes("Arm")) {
                ctx.beginPath();
                ctx.moveTo(0, -3);
                ctx.lineTo(10, -3);
                ctx.lineTo(10, 3);
                ctx.lineTo(0, 3);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            } else if (limb.type.includes("Leg")) {
                ctx.beginPath();
                ctx.moveTo(0, -3);
                ctx.lineTo(12, -3);
                ctx.lineTo(12, 3);
                ctx.lineTo(0, 3);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            ctx.restore();
        }

        drawCurrencyDrops();

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

        // Custom mouse cursor
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.restore();
        ctx.restore();
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
        // Player "head"
        ctx.beginPath();
        ctx.arc(player.x, player.y - 15, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Body
        ctx.beginPath();
        ctx.moveTo(player.x, player.y - 5);
        ctx.lineTo(player.x, player.y + 15);
        ctx.stroke();

        // Left arm
        let leftArmX = player.x - 5;
        let leftArmY = player.y + 10 + Math.sin(player.walkCycle) * 2;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(leftArmX, leftArmY);
        ctx.stroke();

        // Right arm (holding gun)
        const armLength = 15;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(
            player.x + Math.cos(player.angle) * armLength,
            player.y + Math.sin(player.angle) * armLength
        );
        ctx.stroke();

        // Legs
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

        // Gun drawing
        const gunStartX = player.x + Math.cos(player.angle) * (armLength - player.recoil);
        const gunStartY = player.y + Math.sin(player.angle) * (armLength - player.recoil);
        ctx.save();
        ctx.translate(gunStartX, gunStartY);
        ctx.rotate(player.angle);

        // Simple switch for different weapon draws
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
            ctx.beginPath();
            ctx.moveTo(gunLength, -gunThickness);
            ctx.lineTo(gunLength, gunThickness);
            ctx.stroke();
        } else if (player.weapon === "laser") {
            const gunLength = 30;
            const gunThickness = 6;
            ctx.fillStyle = "cyan";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        } else if (player.weapon === "pistolDouble") {
            const gunLength = 20;
            const gunThickness = 8;
            ctx.fillStyle = "darkblue";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        } else if (player.weapon === "machineGun") {
            const gunLength = 25;
            const gunThickness = 8;
            ctx.fillStyle = "darkgray";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.fillStyle = "black";
            ctx.fillRect(gunLength, -gunThickness / 4, 5, gunThickness / 2);
        } else if (player.weapon === "miniGun") {
            const gunLength = 30;
            const gunThickness = 10;
            ctx.fillStyle = "gray";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.beginPath();
            ctx.arc(gunLength + 3, 0, gunThickness / 2, 0, Math.PI * 2);
            ctx.stroke();
        } else if (player.weapon === "sniperRifle") {
            const gunLength = 40;
            const gunThickness = 4;
            ctx.fillStyle = "maroon";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.beginPath();
            ctx.arc(10, -6, 3, 0, Math.PI * 2);
            ctx.stroke();
        } else if (player.weapon === "revolver") {
            const gunLength = 20;
            const gunThickness = 6;
            ctx.fillStyle = "silver";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.beginPath();
            ctx.arc(6, 0, gunThickness / 2, 0, Math.PI * 2);
            ctx.stroke();
        } else if (player.weapon === "plasmaRifle") {
            const gunLength = 25;
            const gunThickness = 8;
            ctx.fillStyle = "cyan";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.beginPath();
            ctx.arc(gunLength + 2, 0, 4, 0, Math.PI * 2);
            ctx.stroke();
        } else if (player.weapon === "freezeCannon") {
            const gunLength = 25;
            const gunThickness = 8;
            ctx.fillStyle = "lightblue";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        } else if (player.weapon === "lightningGun") {
            const gunLength = 25;
            const gunThickness = 8;
            ctx.fillStyle = "yellow";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        } else if (player.weapon === "bfg9000") {
            const gunLength = 35;
            const gunThickness = 12;
            ctx.fillStyle = "green";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        } else if (player.weapon === "acidGun") {
            const gunLength = 20;
            const gunThickness = 7;
            ctx.fillStyle = "limegreen";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        } else if (player.weapon === "grenadeLauncher") {
            const gunLength = 25;
            const gunThickness = 8;
            ctx.fillStyle = "darkgrey";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.beginPath();
            ctx.arc(gunLength, 0, gunThickness / 1.5, 0, Math.PI * 2);
            ctx.stroke();
        } else if (player.weapon === "dualUzis") {
            const gunLength = 20;
            const gunThickness = 6;
            ctx.fillStyle = "grey";
            ctx.fillRect(0, -gunThickness, gunLength, gunThickness);
            ctx.strokeRect(0, -gunThickness, gunLength, gunThickness);
            ctx.fillRect(0, 0, gunLength, gunThickness);
            ctx.strokeRect(0, 0, gunLength, gunThickness);
        } else {
            // Default pistol
            const gunLength = 20;
            const gunThickness = 6;
            ctx.fillStyle = "darkgray";
            ctx.fillRect(0, -gunThickness / 2, gunLength, gunThickness);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, -gunThickness / 2, gunLength, gunThickness);
        }
        ctx.restore();

        // Reload bar for pistol
        if (
            player.reloading &&
            (player.weapon === "pistol" || player.weapon === "pistolDouble")
        ) {
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

        // Reload bar for revolve
        if (player.weapon === "revolver" && revolveReloading) {
            let reloadElapsed = Date.now() - revolveReloadStart;
            let progress = Math.min(reloadElapsed / revolveReloadDuration, 1);
            let barWidth = 50;
            let barHeight = 8;
            let barX = player.x - barWidth / 2;
            let barY = player.y - 40;

            ctx.strokeStyle = "black";
            ctx.strokeRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = revolvePenaltyActive ? "grey" : "green";
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
    }

    function drawZombie(z) {
        ctx.strokeStyle = z.elite ? "purple" : "#330000";
        ctx.lineWidth = 2;
        ctx.save();
        ctx.translate(z.x, z.y);
        if (z.dying) {
            ctx.rotate(z.fallAngle);
            ctx.globalAlpha = z.deathTimer / z.initialDeathTimer;
        }

        // Boss HP bar & belly
        if (z.isBoss) {
            // HP bar
            let barWidth = 80;
            let barHeight = 8;
            let maxHealth = 20; // from spawnBossZombie
            let healthRatio = z.health / maxHealth;
            ctx.save();
            ctx.translate(-barWidth / 2, -(z.radius + 30));
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, 0, barWidth, barHeight);
            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, barWidth * healthRatio, barHeight);
            ctx.restore();

            // Belly
            ctx.beginPath();
            ctx.ellipse(0, 10, 20, 15, 0, 0, 2 * Math.PI);
            ctx.fillStyle = "rgb(86, 22, 81)";
            ctx.fill();
            ctx.stroke();
        }

        // Head
        if (z.limbs.head.attached) {
            ctx.beginPath();
            ctx.arc(z.limbs.head.x, z.limbs.head.y, z.limbs.head.radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Body
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(0, 15);
        ctx.stroke();

        // Arms
        if (z.limbs.leftArm.attached) {
            let leftArmSwing = z.armSwingAmplitude * Math.sin(z.walkCycle + z.leftArmPhase);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(z.limbs.leftArm.x + leftArmSwing, z.limbs.leftArm.y);
            ctx.stroke();
        }
        if (z.limbs.rightArm.attached) {
            let rightArmSwing = z.armSwingAmplitude * Math.sin(z.walkCycle + z.rightArmPhase);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(z.limbs.rightArm.x + rightArmSwing, z.limbs.rightArm.y);
            ctx.stroke();
        }

        // Legs
        if (z.crawling) {
            ctx.beginPath();
            ctx.moveTo(0, 15);
            ctx.lineTo(-5, 20);
            ctx.moveTo(0, 15);
            ctx.lineTo(5, 20);
            ctx.stroke();
        } else {
            if (z.limbs.leftLeg.attached) {
                let leftLegOffset = Math.sin(z.walkCycle) * 5;
                ctx.beginPath();
                ctx.moveTo(0, 15);
                ctx.lineTo(z.limbs.leftLeg.x + leftLegOffset, z.limbs.leftLeg.y);
                ctx.stroke();
            }
            if (z.limbs.rightLeg.attached) {
                let rightLegOffset = Math.sin(z.walkCycle + Math.PI) * 5;
                ctx.beginPath();
                ctx.moveTo(0, 15);
                ctx.lineTo(z.limbs.rightLeg.x + rightLegOffset, z.limbs.rightLeg.y);
                ctx.stroke();
            }
        }

        ctx.restore();
        ctx.globalAlpha = 1;
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
})();
