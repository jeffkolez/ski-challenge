# Ceros Ski Code Challenge

Welcome to the Ceros Code Challenge - Ski Edition!

For this challenge, we have included some base code for Ceros Ski, our version of the classic Windows game SkiFree. If
you've never heard of SkiFree, Google has plenty of examples. Better yet, you can play our version here: 
[http://ceros-ski.herokuapp.com/ ](http://ceros-ski.herokuapp.com/ ) 

We understand that everyone has varying levels of free time, so take a look through the requirements below and let us 
know when you will have something for us to look at (we also get to see how well you estimate and manage your time!). 
Previous candidates have taken about 8 hours to complete our challenge. We feel this gives us a clear indicator of your
technical ability and a chance for you to show us how much you give a shit (one of Ceros's core values!) about the position
you're applying for. If anything is unclear, don't hesitate to reach out.

Requirements:

* The base game that we've sent you is not what we would consider production ready code. In fact, it's pretty far from
  it. As part of our development cycle, all code must go through a review. We would like you to perform a review
  on the base code and fix/refactor it. Is the codebase maintainable, unit-testable, and scalable? What design patterns 
  could we use? 
  
  **We will be judging you based upon how you update the code & architecture.**
  
* There is a bug in the game. Well, at least one bug that we know of. Use the following bug report to debug the code
  and fix it.
  * Steps to Reproduce:
    1. Load the game
    1. Crash into an obstacle
    1. Press the left arrow key
  * Expected Result: The skier gets up and is facing to the left
  * Actual Result: Giant blizzard occurs causing the screen to turn completely white (or maybe the game just crashes!)
* The game's a bit boring as it is. Add a new feature to the game to make it more enjoyable. We've included some ideas for
  you below (or you can come up with your own new feature!). You don't need to do all of them, just pick something to show 
  us you can solve a problem on your own. 
  * Implement jumps. The asset file for jumps is already included. All you gotta do is make the guy jump. We even included
      some jump trick assets if you wanted to get really fancy!
  * Add a score. How will you know that you're the best Ceros Skier if there's no score? Maybe store that score
      somewhere so that it is persisted across browser refreshes.
  * Feed the hungry Rhino. In the original Ski Free game, if you skied for too long, a yeti would chase you
      down and eat you. In Ceros Ski, we've provided assets for a Rhino to catch the skier.
* Update this README file with your comments about your work; what was done, what wasn't, features added & known bugs.
* Provide a way for us to view the completed code and run it, either locally or through a cloud provider
* Be original. Don’t copy someone else’s game implementation!

Bonus:

* Provide a way to reset the game once the game is over
* Provide a way to pause and resume the game
* Skier should get faster as the game progresses
* Deploy the game to a server so that we can play it without setting something up ourselves. We've included a 
  package.json and web.js file that will enable this to run on Heroku. Feel free to use those or use your own code to 
  deploy to a cloud service if you want.
* Write unit tests for your code

And don't think you have to stop there. If you're having fun with this and have the time, feel free to add anything else
you want and show us what you can do! 

We are looking forward to see what you come up with!

___

Here's what I came up with for this challenge.

I found the challenge interesting. At first it was a challenging; what do I know about writing an in-browser video game? But once I got into the details of it, I figured things out.

The approach to take was the hardest part. I debated different approaches in my head. In the end, I turned the application into a VueJS project with a Laravel backend. I've been doing a lot of Laravel lately, so it seemed like an obvious approach. I was also congnisant of the phrase "when you have a hammer, everything looks like a nail", but I was also curious if I would be able to pull it off.

With that said, it went relatively smoothly. The game is running in a VueJS framework. Probably the hardest part was making the code work in an OO format, and remembering to bind(this) to anonymous functions.

Since the game was pretty solid, and I'm not a gameplay expert, my goals were to rearchitect the game without major surgery.

Changelog:

* Migrate code to a VueJS component with a Laravel backend
   * Turn code into an OO pattern
* Add scoring to the game (counts game loops and then divide by the skier's speed)
* Score is persisted to an sqlite database on the server. When the skier crashes, the score is sent to the Laravel application via an AJAX call
* Added a nav bar menu that lets you restart the game as well as get the top scores
  * You can pull up the higest 10 scores as well as the 10 most recent scores
  * Added a 'play again' button
* The skier's speed is increased at certain score thresholds (100, 200, 300, 400, 500, 600, 700, 800, 900)
* Found the bug mentioned above that crashes the game. The fix was to make sure the skierDirection never goes below 0 or above 5.
* UI improvement - after you crash you can hit the down arrow to restart the game
* Found a bug in the calculateOpenPosition method where it kept placing the same object in the same place and we ended up in recusion hell and the game would crash. Not sure if that's related to the changes I made with Vue, or a different version of lowdash generating the same random numbers, but I fixed it by changing the seed

I ended up spending a bit more time than the 8 hour budget, but I wanted to impress y'all :)

___

What can be improved:

* The scoring algorithm is a bit janky. The score is calculated every time it hits gameLoop() and could be made more efficient
* Add unit tests - I'm not super familiar with unit testing games since a lot of the methods rely on random events, so that would need some research on my part
* If the game got more complex, then we should break the game logic into modules. Maybe a skier module, an obsticle module, and a gameplay module. I think it's ok the way it is given how simple the game currently is.
* The game could probably use a once-over by QA to make sure we caught all the bugs. There's always bugs.
