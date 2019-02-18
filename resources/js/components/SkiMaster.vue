<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light" id="navbar">
            <div class="collapse navbar-collapse" id="navbarHeader">
                <a class="navbar-brand" href="">Rhino-Ski</a>
                <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li class="nav-item">
                        <a href="#" class="nav-link" v-on:click="playAgain($event)" v-if="showNavButtons">Play Again</a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" v-on:click="viewTop($event)" v-if="showNavButtons">Show Top Scores</a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" v-on:click="viewLatest($event)" v-if="showNavButtons">Show Latest Scores</a>
                    </li>
                </ul>
                <strong>SCORE:</strong> {{ calculatedScore }}
            </div>
        </nav>
        <div id="gameContainer"></div>
        <div id="modals">
            <b-modal ref="scoreDisplayModal" hide-footer :title="modalTitle">
                <div>
                    <b-table striped hover :items="modalData" :fields="modalFields" />
                </div>
            </b-modal>
        </div>
    </div>
</template>

<script src="../modules/SkiMaster.js"></script>