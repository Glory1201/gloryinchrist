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

I'm still a baby bot and learning new things with every article added to my knowledge base.
<br><br>
If I don't know an answer yet, don't give up on me!
<br><br>
May God bless you as you seek truth in Christ.
`;
let knowledge = [];

fetch("knowledge.json")
    .then(response => response.json())
    .then(data => {
        knowledge = data.knowledge;
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
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    if (str1 === str2) return 1;

    const longer =
        str1.length > str2.length
            ? str1
            : str2;

    const shorter =
        str1.length > str2.length
            ? str2
            : str1;

    const matches = shorter
        .split(" ")
        .filter(word => longer.includes(word))
        .length;

    return matches / shorter.split(" ").length;
}

function askBot() {

    const input =
        document.getElementById("question");

    const question =
        input.value.trim();

    if (!question) return;

    addMessage(
        "You:",
        question,
        "user"
    );

    const lowerQuestion =
        question.toLowerCase();

    let found = false;

    for (const item of knowledge) {

        for (const keyword of item.keywords) {

            const score =
                similarity(
                    lowerQuestion,
                    keyword.toLowerCase()
                );

            const keywordWords =
                keyword.toLowerCase().split(" ");

            const keywordMatch =
                keywordWords.every(
                    word =>
                        lowerQuestion.includes(word)
                );

            if (
                score > 0.7 ||
                keywordMatch
            ) {

                let answer =
                    item.answer;

                if (item.resources) {

                    answer +=
                        "<br><br><strong>📖 Further Reading:</strong><br>";

                    item.resources.forEach(resource => {

                        answer +=
                            `<a href="${resource.url}" target="_blank">${resource.title}</a><br>`;
                    });
                }

                if (item.related) {

                    answer +=
                        "<br><br><strong>🤔 Related Questions:</strong><ul>";

                    item.related.forEach(q => {
                        answer += `<li>${q}</li>`;
                    });

                    answer += "</ul>";
                }

                addMessage(
                    "Bot:",
                    answer,
                    "bot"
                );

                found = true;
                break;
            }
        }

        if (found) break;
    }

    if (!found) {

        addMessage(
            "Bot:",
            "I'm still learning and don't know the answer to that question yet.",
            "bot"
        );
    }

    input.value = "";
}
