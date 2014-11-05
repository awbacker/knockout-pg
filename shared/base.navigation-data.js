var topNavData = {
    title: "Knockout Test Stuff",
    links: [
        { text: "Home", url: "index.html" },
        { text: "Punches!", url: "punches.html" }
    ]
}
$(function() {
    ko.applyBindings(topNavData, document.getElementById("top-nav"));
});