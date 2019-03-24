

[Link to game](http://ski.hirejeff.co)

I found this game online, and modified it to work a bit better. There were some bugs, and the code was written procedurally.

Deciding on an approach to take was the hardest part. I debated different approaches in my head. In the end, I turned the application into a VueJS project with a Laravel backend.

Probably the hardest part was making the code work in an OO format, and remembering to bind(this) to anonymous functions.

Since the game was pretty solid, and I'm not a gameplay expert, my goals were to re-architect the game without major surgery.

I had someeone QA the game to make sure the big bugs were caught.

Changelog:

* Migrate code to a VueJS component with a Laravel backend
   * Turn code into an OO pattern
* Add scoring to the game (counts game loops and then divide by the skier's speed)
* Score is persisted to an sqlite database on the server. When the skier crashes, the score is sent to the Laravel application via an AJAX call
* Added a nav bar menu that lets you restart the game as well as get the top scores
  * You can pull up the top 10 scores as well as the 10 most recent scores
  * Added a 'play again' button
* The skier's speed is increased by two steps at certain score thresholds (100, 200, 300, 400, 500, 600, 700, 800, 900)
* Found the bug mentioned above that crashes the game. The fix was to make sure the skierDirection never goes below 0 or above 5.
* UI improvement - after you crash you can hit the down arrow to restart the game
* Found a bug in the calculateOpenPosition method where it kept placing the same object in the same place and we ended up in recursion hell and the game would crash. Not sure if that's related to the changes I made with Vue, or a different version of lowdash generating the same random numbers, but I fixed it by changing the seed

___

What can be improved:

* The scoring algorithm is a bit janky. The score is calculated every time it hits gameLoop() and could be made more efficient
* Add unit tests
* If the game got more complex, then we should break the game logic into modules. Maybe a skier module, an obstacle module, and a gameplay module. I think it's ok the way it is given how simple the game currently is.
