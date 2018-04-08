require("dotenv").config();

var Spotify = require("node-spotify-api");
var Twitter = require('twitter');
var stuffINeed = require("./keys.js");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(stuffINeed.spotify);
var client = new Twitter(stuffINeed.twitter);

var command = process.argv[2];
var song = "";
var longName = "";
var doWhat = false;

if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        var dataArr = data.split(",");
        command = dataArr[0];
        song = dataArr[1];
        longName = dataArr[1];
        doWhat = true;      
        spot();
        tweet();
        mov();
      });
}

var tweet = function(){
    if (command === "my-tweets") {
        var params = { screen_name: 'teachgoestech', count: 20 };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (var j = 0; j < tweets.length; j++) {
                    console.log("\n=================================");
                    console.log(tweets[j].created_at);
                    console.log(tweets[j].text);
                }
            }
        });
    }
}

var spot = function(){
    if (command === "spotify-this-song") {
        // console.log("Made it this far");
        if (process.argv.length === 3 && doWhat === false) {
            song = "The Sign Ace of Base";
            console.log("You did not include a song, so we'll pick one for you!  Enjoy!");
        }
        else {
            for (var i = 3; i < process.argv.length; i++) {
                song = song + process.argv[i] + " ";
            }
        }
        spotify.search({ type: "track", query: song, limit: 1 }, function (err, data) {
            if (err) {
                return console.log("Error occured: " + err);
            }
            // console.log(JSON.stringify(data, null, 2));
            console.log(JSON.stringify(data.tracks.items[0].artists[0].name));
            console.log(JSON.stringify(data.tracks.items[0].name));
            console.log(JSON.stringify(data.tracks.items[0].preview_url));
            console.log(JSON.stringify(data.tracks.items[0].album.name));
        });
    }
}

var mov = function(){
    if (command === "movie-this") {
        if (process.argv.length === 3 && doWhat === false) {
            longName = "Mr. Nobody";
        }
        else {
            for (var i = 3; i < process.argv.length; i++) {
                if (i === 3) {
                    longName = longName + process.argv[i];
                }
                else {
                    longName = longName + "+" + process.argv[i];
                }
            }
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + longName + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                // console.log(JSON.parse(body));
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        });
    }
}

spot();
tweet();
mov();

