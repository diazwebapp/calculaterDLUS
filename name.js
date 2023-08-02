let input = "ANGEL MASON V2 4695 EDGEMOOR ST d ORLANDO FL";
let parts = input.split(" ");
let fullName = "";
let remainingText = "";

for (let i = 0; i < parts.length; i++) {
    if (i < 2 || (i === 2 && isNaN(parts[i]))) {
        fullName += parts[i] + " ";
    } else {
        remainingText += parts[i] + " ";
    }
}

fullName = fullName.trim();
remainingText = remainingText.trim();

console.log("Full name: " + fullName);
console.log("Remaining text: " + remainingText);
