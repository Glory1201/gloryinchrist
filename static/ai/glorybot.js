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
<li>Church History</li>
<li>Christian Living</li>
</ul>

I'm still a baby bot and learning new things with every article added to my knowledge base.

<br><br>

If I don't know an answer yet, don't give up on me!

<br><br>

May God bless you as you seek truth in Christ.
`;
let knowledge = [];

// Load knowledge base
fetch("knowledge.json")
    .then(response => response.json())
    .then(data => {
        knowledge = data.knowledge;
        console.log(
            `Loaded ${knowledge.length} topics`
        );
    })
    .catch(error => {
        console.error(
            "Failed to load knowledge base:",
            error
        );
    });

// Similar to Python's SequenceMatcher
function similarity(str1, str2) {

    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    if (str1 === str2) {
        return 1;
    }

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
        .filter(word =>
            longer.includes(word)
        )
        .length;

    return matches /
        shorter.split(" ").length;
}

function askBot() {

    const input =
        document.getElementById("question");

    const question =
        input.value.trim().toLowerCase();

    if (!question) {
        return;
    }

    addMessage(
        "You:",
        input.value,
        "user"
    );

    let found = false;

    for (const item of knowledge) {

        for (const keyword of item.keywords) {

            const similarityScore =
                similarity(
                    question,
                    keyword.toLowerCase()
                );

            const keywordWords =
                keyword
                    .toLowerCase()
                    .split(" ");

            const keywordMatch =
                keywordWords.every(
                    word =>
                        question.includes(word)
                );

            if (
                similarityScore > 0.7 ||
                keywordMatch
            ) {

                let answer =
                    item.answer;

                // Resources
                if (
                    item.resources &&
                    item.resources.length > 0
                ) {

                    answer +=
                        "<br><br><strong>📖 Further Reading:</strong><br>";

                    item.resources.forEach(
                        resource => {

                            answer += `
                                <a href="${resource.url}"
                                   target="_blank"
                                   rel="noopener noreferrer">
                                   ${resource.title}
                                </a><br>
                            `;
                        }
                    );
                }

                // Related Questions
                if (
                    item.related &&
                    item.related.length > 0
                ) {

                    answer +=
                        "<br><br><strong>🤔 You may also be interested in:</strong><ul>";

                    item.related.forEach(
                        relatedQuestion => {

                            answer +=
                                `<li>${relatedQuestion}</li>`;
                        }
                    );

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

        if (found) {
            break;
        }
    }

    if (!found) {

        addMessage(
            "Bot:",
            "I'm sorry, I don't have an answer for that question yet. I'm still learning! Please try asking something else.",
            "bot"
        );
    }

    input.value = "";
}
