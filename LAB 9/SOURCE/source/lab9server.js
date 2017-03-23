
var express = require('express');
var app = express();
var request = require('request');
app.get('/getdata/:id', function (req, res) {
    var result={
        'body': []
    };

    request('http://www.omdbapi.com/?t='+req.params.id, function (error,response,body) {
        if(error){
            return console.log('Error:', error);
        }

        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }
        body = JSON.parse(body);
        movie = body;
		
		plot = movie.Plot;
		
		
		request('http://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=ff8c7dbafb87432f8284e8b151aa3cea&query='+req.params.id, function (error,response,body12) {
        if(error){
            return console.log('Error:', error);
        }

        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }
        body12 = JSON.parse(body12);
        nytimes = body12;
		
		nytimes = nytimes.results[0].link.url;

        request('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20151023T145251Z.bf1ca7097253ff7e.c0b0a88bea31ba51f72504cc0cc42cf891ed90d2&text='+plot+'&lang=en-es&[format=plain]&[options=1]&[callback=set]', function (error, response, body1) {

            if (error) {
                return console.log('Error:', error);
            }

            if (response.statusCode !== 200) {
                return console.log('Invalid Status Code Returned:', response.statusCode);
            }

            body1 = JSON.parse(body1);
            transl = body1;

                result.body.push({"Title": movie.Title,"Released": movie.Released,"Genre": movie.Genre,"Plot": movie.Plot,"Plot_in_Spanish":transl.text[0],"Country":movie.Country,"Rating":movie.imdbRating,"Votes":movie.imdbVotes,"NYTimes":nytimes});

            res.contentType('application/json');
            res.write(JSON.stringify(result));
            res.end();

        });
    });
	});

})
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

})