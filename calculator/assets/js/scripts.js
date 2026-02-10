function calculate() {
    "use strict";
    /* Make sure that the form is valid */
    if ($( "#calculator-form" ).valid()) {
        
        /* get the operands from the form */
        let operand1 = document.getElementById("input1").value;
        let operand2 = document.getElementById("input2").value;
        
        /* convert the operands from string to floating point */
        let operand1fp = parseFloat (operand1);
        let operand2fp = parseFloat (operand2);
        
        /* figure out which operator was checked and place the value in operator */
        let operator;
        if (document.getElementById("addition").checked) {
            operator = document.getElementById("addition").value;
        }
        if (document.getElementById("subtract").checked) {
            operator = document.getElementById("subtract").value;
        }
        if (document.getElementById("multiply").checked) {
            operator = document.getElementById("multiply").value;
        }
        if (document.getElementById("divide").checked) {
            operator = document.getElementById("divide").value;
        }

        let result;
        
        /* if the operator was "Min" then set result to the minimum */
        if (operator == "+") {
            result = operand1fp + operand2fp;
        }
 
        /* if the operator was "Max" then set result to the maximum */
        if (operator == "-") {
            result = operand1fp - operand2fp;
        }

        /* if operator was "Avg" the calcualute the average of 3 operands */
        if (operator == "*") {
            result = operand1fp * operand2fp;
        }

        if (operator == "/") {
            result = operand1fp / operand2fp;
        }
        
        /* convert the result to a string and display it */
        document.getElementById("result").innerHTML = result.toString();
    }
}

function clearForm() {
    
    /* Set all of the form values to blank or false */
    document.getElementById("input1").value = "";
    document.getElementById("input2").value = "";
    document.getElementById("input1-error").innerHTML = "";
    document.getElementById("input2-error").innerHTML = "";


    document.getElementById("addition").checked = false;
    document.getElementById("subtract").checked = false;
    document.getElementById("multiply").checked = false;
    document.getElementById("divide").checked = false;

    document.getElementById("operatorError").innerHTML = "";

    document.getElementById("result").innerHTML = "";
}

/* Form Validation */
$( "#calculator-form" ).validate({});
