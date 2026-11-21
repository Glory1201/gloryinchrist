const welcomeMessage = `
Hi, I'm GloryBot! 🤖

<br><br>

Think of me as a very enthusiastic theology student who's still in primary school!

<br><br>

I was created to help you explore the articles and resources on Glory in Christ.

<br><br>

Ask me about:

<ul>
<li>Jesus</li>
<li>The Trinity</li>
<li>Islam</li>
<li>The Bible</li>
<li>Salvation</li>
</ul>

I'm still a baby bot and learning new things with every article added to my knowledge base, so if don't know an answer yet, don't give up on me! 

<br><br>

May God bless you as you seek truth in Christ.🙏
`;

let knowledge = [];

fetch("knowledge.json")
    .then(response => response.json())
    .then(data => {
        knowledge = data.knowledge;
        console.log(`Loaded ${knowledge.length} topics`);
    })
    .catch(error => {
        console.error("Failed to load knowledge base:", error);
    });

function addMessage(sender, text, className) {

    const chat = document.getElementById("chat");

    const div = document.createElement("div");

    div.className = className;

    div.innerHTML = `<strong>${sender}</strong> ${text}`;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}

function similarity(str1, str2) {

    const stopWords = [
        "what",
        "is",
        "the",
        "a",
        "an",
        "why",
        "how",
        "do",
        "does",
        "did",
        "can",
        "should",
        "would",
        "could",
        "tell",
        "me",
        "about",
        "explain"
    ];

    const words1 = str1
        .toLowerCase()
        .split(/\s+/)
        .filter(word => !stopWords.includes(word));

    const words2 = str2
        .toLowerCase()
        .split(/\s+/)
        .filter(word => !stopWords.includes(word));

    if (words1.length === 0 || words2.length === 0) {
        return 0;
    }

    const matches = words2.filter(word =>
        words1.includes(word)
    ).length;

    return matches / words2.length;
}

function buildAnswer(item) {

    let answer = item.answer;

    if (item.resources && item.resources.length > 0) {

        answer +=
            "<br><br><strong>📖 Further Reading:</strong><br>";

        item.resources.forEach(resource => {

            answer += `
                <a href="${resource.url}"
                   target="_blank"
                   rel="noopener noreferrer">
                    ${resource.title}
                </a><br>
            `;
        });
    }

    if (item.related && item.related.length > 0) {

        answer +=
            "<br><br><strong>🤔 Related Questions:</strong><ul>";

        item.related.forEach(question => {
            answer += `<li>${question}</li>`;
        });

        answer += "</ul>";
    }

    return answer;
}

function findBestMatch(question) {

    const stopWords = [
        "what",
        "is",
        "the",
        "a",
        "an",
        "why",
        "how",
        "do",
        "does",
        "did",
        "can",
        "should",
        "would",
        "could",
        "tell",
        "me",
        "about",
        "explain"
    ];

    const search = question
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, "");

    let bestMatch = null;
    let bestScore = 0;

    for (const item of knowledge) {

        for (const keyword of item.keywords) {

            const cleanKeyword = keyword
                .toLowerCase()
                .trim()
                .replace(/[^\w\s]/g, "");

            // Exact match
            if (search === cleanKeyword) {
                console.log("Exact match:", item.topic);
                return item;
            }

            const questionWords = search
                .split(" ")
                .filter(word =>
                    !stopWords.includes(word)
                );

            const keywordWords = cleanKeyword
                .split(" ")
                .filter(word =>
                    !stopWords.includes(word)
                );

            if (keywordWords.length === 0) {
                continue;
            }

            const matches = keywordWords.filter(word =>
                questionWords.includes(word)
            ).length;

            const score = matches / keywordWords.length;

            if (score > bestScore) {
                bestScore = score;
                bestMatch = item;
            }
        }
    }

    console.log(
        "Best Match:",
        bestMatch?.topic,
        "Score:",
        bestScore
    );

    return bestScore >= 0.75
        ? bestMatch
        : null;
}
    const item =
        findBestMatch(question);

    if (item) {

        addMessage(
            "Bot:",
            buildAnswer(item),
            "bot"
        );
    }
    else {

        addMessage(
            "Bot:",
            "I'm still learning and don't know the answer to that question yet.",
            "bot"
        );
    }

    input.value = "";
}

document
    .getElementById("question")
    .addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
            askBot();
        }
    });

window.onload = function () {

    addMessage(
        "GloryBot:",
        welcomeMessage,
        "bot"
    );
};
