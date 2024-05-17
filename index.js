function populateVoiceList() {
    voices = speechSynthesis.getVoices();
    return voices.length > 0 ? voices[0] : null; // Select the first available voice
}

speechSynthesis.onvoiceschanged = populateVoiceList;

document.getElementById('speak-button').addEventListener('click', function() {
    const text = document.getElementById('text-input').value;
    const speech = new SpeechSynthesisUtterance(text);
    const selectedVoice = populateVoiceList();
    
    if (selectedVoice) {
        speech.voice = selectedVoice;
    }
    
    speechSynthesis.speak(speech);
});

document.getElementById('recognize-button').addEventListener('click', function() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = true; // Keep recognition running continuously
    recognition.interimResults = true; // Show interim results

    recognition.start();

    recognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        document.getElementById('text-input').value = finalTranscript + interimTranscript;
    };

    recognition.onerror = function(event) {
        document.getElementById('recognition-result').textContent = `Error occurred in recognition: ${event.error}`;
    };
});
