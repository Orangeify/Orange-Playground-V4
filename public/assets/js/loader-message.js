const messages = [
      "Life gave me oranges. Now I'm here.",
      "I don't sell oranges at the store.",
      "I'm on YouTube.",
      "I'm not a good gamer.",
      "Planning on changing my favorite color.",
      "I'm on Twitch.",
      "Just Click Anything! OKAY?",
      "Please Wait...",
      "I used to have a TikTok.",
      "I heard Discord was nice!",
      "I made a gaming site.",
      "NO MORE BRAINROT.",
      "A Plane just hit the North Tower!",
      "My friend likes bread.",
      "This is not a PC.",
      "I am a Simpsons Addict.",
      "I watch Family Guy sometimes.",
      "Keep Refreshing. I dare you.",
      "I'm a Githubber. (Sometimes).",
      "Sometimes I question myself.",
      "Tragic events in history.",
      "Notepad = Life.",
      "Ahhhhh. Refreshing. (Sorry)",
      "Porgremz",
      "Nuh Uh.",
      "Nope, it can't run Doom.",
      "This way if you're gay.",
      "Okay, time to sleep.",
      "You just want to find every message..."
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    document.getElementById("message").textContent = messages[randomIndex];
