<html>
	<head>
	    <meta charset="utf-8">
		<script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
		<script src="popcorn-complete.min.js"></script>
		<script src="popcorn-popup.js"></script>
		<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
		<script>
			// ensure the web page (DOM) has loaded
			document.addEventListener("DOMContentLoaded", function () {

				// Create a popcorn instance by calling Popcorn("#id-of-my-video")
				var pop = Popcorn("#ourvideo");

				pop.footnote({
	               start: 1,
	               end: 5,
	               target: "footnote",
	               text: "Pop!<br/>pop <b>poniżej</b>"
	            });
				pop.popup({
					start: 2,
					end: 10,
					title: "Pop!",
					text: "Sample text here",
					closeable: false
				});
				pop.popup({
					start: 3,
					end: 7,
					text: "Pop 2",
					title: "Sample",
					left: "10px",
					top: "200px",
					pauseOnShow: true
				});

				// play the video right away
				pop.play();

				document.getElementById('pause').onclick = function(){
					pop.pause();
				};
				document.getElementById('play').onclick = function(){
					pop.play();
				};

			}, false);
		</script>
		<style>
			a#play {
				position: absolute;
				left: 200px;
				top: 200px;
				z-index: 10;
			}
			a#pause {
				position: absolute;
			}
		</style>

	</head>
	<body>
		<video id="ourvideo" controls>
			<source src="http://www.quirksmode.org/html5/videos/big_buck_bunny.webm">
		</video>
		<a href="#" id="pause">Pause now!</a>
		<a href="#" id="play">Play again!</a>
		<div id="footnote" />
	</body>
</html>	