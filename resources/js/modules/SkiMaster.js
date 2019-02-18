export default {
    data: function() {
        return {
            gameWidth: window.innerWidth,
            gameHeight: window.innerHeight,
            obstacles: [],
            ctx: null,
            loadedAssets: {},
            skierDirection: 5,
            skierMapX: 0,
            skierMapY: 0,
            skierSpeed: 8,
            score: [],
            calculatedScore: 1,
            loopCount: 0,
            gameOverFlag: false,
            modalTitle: "",
            modalData: [],
            modalFields: [
                {
                    key: 'created_at',
                    label: 'Date'
                }, 'score'
            ],
            obstacleTypes: [
                'tree',
                'treeCluster',
                'rock1',
                'rock2'
            ],
            assets: {
                'skierCrash' : '/img/skier_crash.png',
                'skierLeft' : '/img/skier_left.png',
                'skierLeftDown' : '/img/skier_left_down.png',
                'skierDown' : '/img/skier_down.png',
                'skierRightDown' : '/img/skier_right_down.png',
                'skierRight' : '/img/skier_right.png',
                'tree' : '/img/tree_1.png',
                'treeCluster' : '/img/tree_cluster.png',
                'rock1' : '/img/rock_1.png',
                'rock2' : '/img/rock_2.png'
            }
        }
    },
    computed: {
        getSkierAsset: function() {
            if (this.skierDirection < 0) {
                this.skierDirection = 0;
            }
            if (this.skierDirection > 5) {
                this.skierDirection = 5;
            }
            switch(this.skierDirection) {
                case 0:
                    return 'skierCrash';
                case 1:
                    return 'skierLeft';
                case 2:
                    return 'skierLeftDown';
                case 3:
                    return 'skierDown';
                case 4:
                    return 'skierRightDown';
                case 5:
                    return 'skierRight';
            };
        },
        showNavButtons: function() {
            if (this.gameOverFlag) {
                return true;
            }
            if (this.calculatedScore == 0) {
                return true;
            }
        }
    },
    mounted() {
        this.initializeGame();
    },
    methods: {
        initializeGame: function() {
            var canvas = $('<canvas></canvas>')
                .attr('width', this.gameWidth * window.devicePixelRatio)
                .attr('height', (this.gameHeight * window.devicePixelRatio) - $("#navbar").outerHeight() - 2)
                .css({
                    width: '100%',
                    height: '100%'
                });
            $('#gameContainer').append(canvas);
            this.ctx = canvas[0].getContext('2d');

            this.setupKeyhandler();
            this.loadAssets().then(function() {
                this.startGame();
            }.bind(this));
        },
        initializeGameValues: function() {
            this.obstacles = [];
            this.skierDirection = 5;
            this.skierMapX = 5;
            this.skierMapY = 5;
            this.skierSpeed = 8;
            this.calculatedScore = 0;
            this.score = [];
            this.score[this.skierSpeed] = 0;
            this.loopCount = 0;
            this.gameOverFlag = false;
        },
        gameLoop: function() {
            this.ctx.save();
            // Retina support
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            this.clearCanvas();
            this.moveSkier();
            this.checkIfSkierHitObstacle();
            this.drawSkier();
            this.drawObstacles();
            this.ctx.restore();
            if (this.skierDirection == 0) {
                this.gameOver();
                return;
            }
            
            if (! _.includes([1, 5], this.skierDirection)) { //5, 1 = up. No scoring
                this.score[this.skierSpeed] = this.score[this.skierSpeed] + 1;
            }
            this.calculatedScore = this.calculateScore();
            if ((_.includes([100, 200, 300, 400, 500, 600, 700, 800, 900], this.calculatedScore)) 
                    && (Math.round(this.score[this.skierSpeed] / this.skierSpeed)) != 0) { //prevent a supersonic loop
                this.skierSpeed++;
                this.score[this.skierSpeed] = 1;
            }
            requestAnimationFrame(this.gameLoop);
        },
        calculateScore: function() {
            var total = 0;
            for (var speed in this.score) {
                if (speed === 0) {
                    continue;
                }
                total += Math.round(this.score[speed] / speed);
            }
            return total;
        },
        viewLatest: function(event) {
            event.preventDefault();
            this.modalTitle = "Latest Scores";
            this.fetchDataShowModal("/score/latest");
        },
        viewTop: function(event) {
            event.preventDefault();
            this.modalTitle = "Top Scores";
            this.fetchDataShowModal("/score/best");
        },
        fetchDataShowModal: function(path) {
            axios.get(path)
                .then(function(response) {
                    this.modalData = response.data;
                    this.$refs.scoreDisplayModal.show();
                }.bind(this));
        },
        playAgain: function(event) {
            event.preventDefault();
            this.startGame();
        },
        startGame: function() {
            this.initializeGameValues();
            this.clearCanvas();
            this.placeInitialObstacles();
            requestAnimationFrame(this.gameLoop);
        },
        gameOver: function() {
            this.gameOverFlag = true;
            var data = {
                score: this.calculatedScore
            };
            axios.post('/score', { data })
                .then(function(response) {
                    console.log("DONE UPDATING SERVER");
                }.bind(this));
        },
        clearCanvas: function() {
            this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        },
        drawSkier: function() {
            var skierImage = this.loadedAssets[this.getSkierAsset];
            var x = (this.gameWidth - skierImage.width) / 2;
            var y = (this.gameHeight - skierImage.height) / 2;
            this.ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height);
        },
        moveSkier: function() {
            switch(this.skierDirection) {
                case 2:
                    this.skierMapX -= Math.round(this.skierSpeed / 1.4142);
                    this.skierMapY += Math.round(this.skierSpeed / 1.4142);
                    this.placeNewObstacle(this.skierDirection);
                    break;
                case 3:
                    this.skierMapY += this.skierSpeed;
                    this.placeNewObstacle(this.skierDirection);
                    break;
                case 4:
                    this.skierMapX += this.skierSpeed / 1.4142;
                    this.skierMapY += this.skierSpeed / 1.4142;
                    this.placeNewObstacle(this.skierDirection);
                    break;
            }
        },
        drawObstacles: function() {
            var newObstacles = [];
            _.each(this.obstacles, function(obstacle) {
                var obstacleImage = this.loadedAssets[obstacle.type];
                var x = obstacle.x - this.skierMapX - obstacleImage.width / 2;
                var y = obstacle.y - this.skierMapY - obstacleImage.height / 2;
                if(x < -100 || x > this.gameWidth + 50 || y < -100 || y > this.gameHeight + 50) {
                    return;
                }
                this.ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);
                newObstacles.push(obstacle);
            }.bind(this));
            this.obstacles = newObstacles;
        },
        placeInitialObstacles: function() {
            var numberObstacles = Math.ceil(_.random(5, 7) * (this.gameWidth / 800) * (this.gameHeight / 500));

            var minX = -50;
            var maxX = this.gameWidth + 50;
            var minY = this.gameHeight / 2 + 100;
            var maxY = this.gameHeight + 50;

            for(var i = 0; i < numberObstacles; i++) {
                this.placeRandomObstacle(minX, maxX, minY, maxY);
            }

            this.obstacles = _.sortBy(this.obstacles, function(obstacle) {
                var obstacleImage = this.loadedAssets[obstacle.type];
                return obstacle.y + obstacleImage.height;
            }.bind(this));
        },
        placeRandomObstacle: function(minX, maxX, minY, maxY) {
            var obstacleIndex = _.random(0, this.obstacleTypes.length - 1);

            var position = this.calculateOpenPosition(minX, maxX, minY, maxY);

            this.obstacles.push({
                type : this.obstacleTypes[obstacleIndex],
                x : position.x,
                y : position.y
            })
        },
        placeNewObstacle: function(direction) {
            var shouldPlaceObstacle = _.random(1, 8);
            if(shouldPlaceObstacle !== 8) {
                return;
            }
            var leftEdge = this.skierMapX;
            var rightEdge = this.skierMapX + this.gameWidth;
            var topEdge = this.skierMapY;
            var bottomEdge = this.skierMapY + this.gameHeight;
            switch(direction) {
                case 1: // left
                    this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                    break;
                case 2: // left down
                    this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                    this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                    break;
                case 3: // down
                    this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                    break;
                case 4: // right down
                    this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                    this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                    break;
                case 5: // right
                    this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                    break;
                case 6: // up
                    this.placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
                    break;
            }
        },
        calculateOpenPosition: function(minX, maxX, minY, maxY) {
            var x = _.random(minX, maxX);
            var y = _.random(minY, maxY);
            if (this.obstacles.length == 0) {
                return {
                    x: x,
                    y: y
                }
            }
            var foundCollision = _.find(this.obstacles, function(obstacle) {
                return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
            });
            if(foundCollision) {
                //Getting an overflow error here. Try changing the seed a bit, then recalculate.
                return this.calculateOpenPosition(minX - 5, maxX - 5, minY - 5, maxY - 5);
            }
            return {
                x: x,
                y: y
            }
        },
        checkIfSkierHitObstacle: function() {
            var skierAssetName = this.getSkierAsset;
            var skierImage = this.loadedAssets[skierAssetName];
            var skierRect = {
                left: this.skierMapX + this.gameWidth / 2,
                right: this.skierMapX + skierImage.width + this.gameWidth / 2,
                top: this.skierMapY + skierImage.height - 5 + this.gameHeight / 2,
                bottom: this.skierMapY + skierImage.height + this.gameHeight / 2
            };

            var collision = _.find(this.obstacles, function(obstacle) {
                var obstacleImage = this.loadedAssets[obstacle.type];
                var obstacleRect = {
                    left: obstacle.x,
                    right: obstacle.x + obstacleImage.width,
                    top: obstacle.y + obstacleImage.height - 5,
                    bottom: obstacle.y + obstacleImage.height
                };

                return this.intersectRect(skierRect, obstacleRect);
            }.bind(this));

            if(collision) {
                this.skierDirection = 0;
            }
        },
        intersectRect: function(r1, r2) {
            return !(r2.left > r1.right ||
                r2.right < r1.left ||
                r2.top > r1.bottom ||
                r2.bottom < r1.top);
        },
        loadAssets: function() {
            var assetPromises = [];
            _.each(this.assets, function(asset, assetName) {
                var assetImage = new Image();
                var assetDeferred = new $.Deferred();
                assetImage.onload = function() {
                    assetImage.width /= 2;
                    assetImage.height /= 2;
                    this.loadedAssets[assetName] = assetImage;
                    assetDeferred.resolve();
                }.bind(this);
                assetImage.src = asset;
                assetPromises.push(assetDeferred.promise());
            }.bind(this));
            return $.when.apply($, assetPromises);
        },
        setupKeyhandler: function() {
            $(window).keydown(function(event) {
                if (this.skierDirection === 0) {
                    if (event.which === 40) {
                        //we've crashed and the user's pushed down. Restart the game.
                        this.startGame();
                        event.preventDefault();
                    }
                    return;
                }
                switch(event.which) {
                    case 37: // left
                        if(this.skierDirection === 1) {
                            this.skierMapX -= this.skierSpeed;
                            this.placeNewObstacle(this.skierDirection);
                        }
                        else {
                            this.skierDirection--;
                        }
                        break;
                    case 39: // right
                        if(this.skierDirection === 5) {
                            this.skierMapX += this.skierSpeed;
                            this.placeNewObstacle(this.skierDirection);
                        }
                        else {
                            this.skierDirection++;
                        }
                        break;
                    case 38: // up
                        if(this.skierDirection === 1 || this.skierDirection === 5) {
                            this.skierMapY -= this.skierSpeed;
                            this.placeNewObstacle(this.skierDirection);
                        }
                        break;
                    case 40: // down
                        this.skierDirection = 3;
                        break;
                }
                event.preventDefault();
            }.bind(this));
        }
    }
};
