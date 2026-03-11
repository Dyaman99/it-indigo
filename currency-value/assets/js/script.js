async function showCurrencyChart() {
    "use strict";

    // Get a reference to the form - Use the ID of the form
    let form = $("#myform");

    // If all of the form elements are valid, then get the form values
    if (form.valid()) {

        let fromCurr = document.getElementById("fromCurrency").value;
        let toCurr = document.getElementById("toCurrency").value;
        let apiKey = "ISZvkPTwZSR8TAgQl3pw7BUxSkOoUAAa";
        let FromDate = document.getElementById("FromDate").value;
        let ToDate = document.getElementById("ToDate").value;

        // Create the forex ticker pair
        let forexTicker = "C:" + fromCurr + toCurr;

        /* URL for AJAX Call */
        let myURL = "https://api.polygon.io/v2/aggs/ticker/" 
            + forexTicker
            + "/range/1/day/"
            + FromDate
            + "/"
            + ToDate
            + "?adjusted=true&sort=asc&limit=5000&apiKey="
            + apiKey;

        /* Make the AJAX call */
        let msgObject = await fetch(myURL);

        /* Check the status */
        if (msgObject.status >= 200 && msgObject.status <= 299) {

            let msgJSONText = await msgObject.text();
            let msg = JSON.parse(msgJSONText);

            let currencyDate = [];
            let currencyValue = [];

            let numDays = 0;
            if (msg.results) {
                numDays = msg.results.length;
            }

            if (numDays > 0) {
                for (let i = 0; i < numDays; i++) {
                    currencyValue[i] = msg.results[i].c;

                    let tempDate = new Date(msg.results[i].t);
                    currencyDate[i] = tempDate.toLocaleDateString();
                }

                let canvas = document.getElementById("chart-currency");
                let context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);

                let myChart = new Chart(canvas, {
                    "type": "line",
                    "data": {
                        "labels": currencyDate,
                        "datasets": [{
                            "label": fromCurr + " to " + toCurr,
                            "data": currencyValue,
                            "fill": false,
                            "borderColor": "rgb(75, 192, 192)",
                            "lineTension": 0.1
                        }]
                    },
                    "options": {
                        responsive: false,
                        maintainAspectRatio: true
                    }
                });
            }
            else {
                alert("No currency data found for that date range.");
            }
        }
        else {
            alert("Currency data not found - Status: " + msgObject.status);
            return;
        }
    }
}

function ClearForm() {
    "use strict";

    document.getElementById("fromCurrency").value = "";
    document.getElementById("toCurrency").value = "";
    document.getElementById("FromDate").value = "";
    document.getElementById("FromDateError").innerHTML = "";
    document.getElementById("ToDate").value = "";
    document.getElementById("ToDateError").innerHTML = "";

    let canvas = document.getElementById("chart-currency");
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}