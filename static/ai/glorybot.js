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

I'm still a baby bot and learning new things with every article added to my knowledge base, so if I don't know an answer yet, don't give up on me!

<br><br>

May God bless you as you seek truth in Christ. 🙏
`;

let knowledge = [];

fetch("knowledge.json")
    .then(response => response.json())
    .then(data => {
        knowledge = data.knowledge;
        console.log(`Loaded ${knowledge.length} topics`);
    })
    .catch(error => {
        console.error(
            "Failed to load knowledge base:",
            error
        );
    });

function addMessage(sender, text, className) {

    const chat =
        document.getElementById("chat");

    const div =
        document.createElement("div");

    div.className = className;

    div.innerHTML =
        `<strong>${sender}</strong> ${text}`;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}

function normalise(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, "");
}

function buildAnswer(item) {

    let answer = item.answer;

    if (
        item.resources &&
        item.resources.length > 0
    ) {

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

    if (
        item.related &&
        item.related.length > 0
    ) {

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

    const search = normalise(question);

    // Pass 1 - Exact keyword match
    for (const item of knowledge) {

        for (const keyword of item.keywords) {

            if (
                search === normalise(keyword)
            ) {

                console.log(
                    "Exact Match:",
                    item.topic
                );

                return item;
            }
        }
    }

    // Pass 2 - Keyword contained in question
    for (const item of knowledge) {

        for (const keyword of item.keywords) {

            const cleanKeyword =
                normalise(keyword);

            if (
                search.includes(cleanKeyword)
            ) {

                console.log(
                    "Contains Match:",
                    item.topic
                );

                return item;
            }
        }
    }

    // Pass 3 - Topic contained in question
    for (const item of knowledge) {

        const topic =
            normalise(item.topic);

        if (
            search.includes(topic) ||
            topic.includes(search)
        ) {

            console.log(
                "Topic Match:",
                item.topic
            );

            return item;
        }
    }

    return null;
}

function askBot() {

    const input =
        document.getElementById("question");

    const question =
        input.value.trim();

    if (!question) {
        return;
    }

    addMessage(
        "You:",
        question,
        "user"
    );

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
    .addEventListener(
        "keypress",
        function (e) {

            if (e.key === "Enter") {
                askBot();
            }
        }
    );

window.onload = function () {

    addMessage(
        "GloryBot:",
        welcomeMessage,
        "bot"
    );
};
