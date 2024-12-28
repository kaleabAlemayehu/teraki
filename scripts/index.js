const audioElement = document.querySelector("#audioElement");

async function playAudioFromStream(readableStream) {
	const mediaSource = new MediaSource();

	audioElement.src = URL.createObjectURL(mediaSource);

	mediaSource.addEventListener("sourceopen", () => {
		const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg"); // or the MIME type of your audio
		const reader = readableStream.getReader();

		function pushDataToSourceBuffer() {
			reader.read().then(({ value, done }) => {
				if (done) {
					mediaSource.endOfStream();
					return;
				}
				sourceBuffer.appendBuffer(value);
				pushDataToSourceBuffer();
			}).catch((err) => {
				console.error(
					"Error reading from the stream",
					err,
				);
			});
		}

		pushDataToSourceBuffer();
	});
}

const url = "https://api.play.ht/api/v2/tts/stream";
const options = {
	method: "POST",
	headers: {
		accept: "audio/mpeg",
		"content-type": "application/json",
		AUTHORIZATION: "SECRET_KEY",
		"X-USER-ID": "USER_ID",
	},
	body: JSON.stringify({
		text: "It works and that is great!",
		voice: "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
		quality: "draft",
		output_format: "mp3",
		speed: 1,
		sample_rate: 24000,
		seed: null,
		temperature: null,
		voice_engine: "PlayDialog",
		emotion: "female_happy",
		voice_guidance: 3,
		style_guidance: 20,
		text_guidance: 1,
		language: "english",
		voice_2: "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
		turn_prefix: "Country Mouse:",
		turn_prefix_2: "Town Mouse:",
		prompt: "string",
		prompt_2: "string",
		voice_conditioning_seconds: 20,
		voice_conditioning_seconds_2: 20,
	}),
};

fetch(url, options)
	.then((res) => res.body)
	.then((rs) => playAudioFromStream(rs))
	.catch((err) => console.error(err));
