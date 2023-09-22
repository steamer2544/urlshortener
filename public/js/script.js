function copyLink(shortUrl) {
    const linkToCopy = `${shortUrl}`;
    const textArea = document.createElement("textarea");
    textArea.value = linkToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert("Link copied to clipboard: " + linkToCopy);
}