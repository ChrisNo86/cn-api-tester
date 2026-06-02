const method =
    document.querySelector("#method");

const urlInput =
    document.querySelector("#urlInput");

const bodyInput =
    document.querySelector("#bodyInput");

const responseOutput =
    document.querySelector("#responseOutput");

const statusOutput =
    document.querySelector("#statusOutput");

const timeOutput =
    document.querySelector("#timeOutput");

const sizeOutput =
    document.querySelector("#sizeOutput");

const sendBtn =
    document.querySelector("#sendBtn");

const exampleBtn =
    document.querySelector("#exampleBtn");

const clearBtn =
    document.querySelector("#clearBtn");

const copyBtn =
    document.querySelector("#copyBtn");

initialize();

function initialize() {
updateMethodColor();
    bindEvents();
}

function bindEvents() {

    sendBtn.addEventListener(
        "click",
        sendRequest
    );

    exampleBtn.addEventListener(
        "click",
        loadExample
    );

    method.addEventListener(
    "change",
    () => {

        updateMethodColor();
        updateExample();

    }
);

    clearBtn.addEventListener(
        "click",
        clearForm
    );

    copyBtn.addEventListener(
        "click",
        copyResponse
    );
}

async function sendRequest() {

    try {

        const start =
            performance.now();

        const options =
            buildRequestOptions();

        const response =
            await fetch(
                urlInput.value,
                options
            );

        const text =
    await response.text();

const data =
    text
        ? JSON.parse(text)
        : {};

        const end =
            performance.now();

        renderResponse(data);

        renderStats(
            response,
            data,
            end - start
        );

    } catch (error) {

    console.error(error);

    responseOutput.textContent =
        "Request failed.";

    statusOutput.className =
        "status-badge status-error";

    statusOutput.textContent =
        "ERROR";
}
}

function buildRequestOptions() {

    const options = {

        method:
            method.value
    };

    if (
        method.value !== "GET" &&
        bodyInput.value.trim()
    ) {

        options.headers = {
            "Content-Type":
                "application/json"
        };

        options.body =
            bodyInput.value;
    }

    return options;
}

function renderResponse(data) {

    responseOutput.innerHTML =
        createHighlightedJson(data);
}

function renderStats(
    response,
    data,
    time
) {
statusOutput.className =
    "status-badge";

if (response.ok) {

    statusOutput.classList.add(
        "status-success"
    );

} else {

    statusOutput.classList.add(
        "status-error"
    );
}

statusOutput.textContent =
    `${response.status}`;

    timeOutput.textContent =
        `${Math.round(time)} ms`;

    sizeOutput.textContent =
        `${JSON.stringify(data).length} bytes`;
}

function updateExample() {

    if (method.value === "GET") {

        urlInput.value =
            "https://jsonplaceholder.typicode.com/posts/1";

        bodyInput.value = "";

        return;
    }

    if (method.value === "POST") {

        urlInput.value =
            "https://jsonplaceholder.typicode.com/posts";

        bodyInput.value =
`{
  "title": "CN API Tester",
  "body": "Testing",
  "userId": 1
}`;

        return;
    }

    if (method.value === "PUT") {

        urlInput.value =
            "https://jsonplaceholder.typicode.com/posts/1";

        bodyInput.value =
`{
  "id": 1,
  "title": "Updated Post",
  "body": "Updated Content",
  "userId": 1
}`;

        return;
    }

    if (method.value === "DELETE") {

        urlInput.value =
            "https://jsonplaceholder.typicode.com/posts/1";

        bodyInput.value = "";
    }
}

function loadExample() {

    updateExample();
}

function clearForm() {

    urlInput.value = "";

    bodyInput.value = "";

    responseOutput.textContent =
        "Waiting...";

    statusOutput.textContent = "-";

    timeOutput.textContent = "-";

    sizeOutput.textContent = "-";
}

async function copyResponse() {

    await navigator.clipboard.writeText(
        responseOutput.textContent
    );
}

function updateMethodColor() {

    method.className =
        "method-select";

    const methodName =
        method.value.toLowerCase();

    method.classList.add(
        `method-${methodName}`
    );
}

function createHighlightedJson(data) {

    const json =
        JSON.stringify(data, null, 2);

    return json
        .replace(
            /"([^"]+)":/g,
            '<span class="json-key">"$1"</span>:'
        )
        .replace(
            /: "([^"]*)"/g,
            ': <span class="json-string">"$1"</span>'
        )
        .replace(
            /: (\d+)/g,
            ': <span class="json-number">$1</span>'
        )
        .replace(/\n/g, "<br>")
        .replace(/ {2}/g, "&nbsp;&nbsp;");
}