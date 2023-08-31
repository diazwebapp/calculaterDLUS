
function processText(line) {
    line = line.trim()
    line = line.replace(/\t/g, ' ')
    const genderMatch = line.match(/^(MR\.|MS\.|MRS\.)/);
    const dobMatch = line.match(/\d{2}\/\d{2}\/\d{4}/);
    const ssnMatch = line.match(/\d{3}-\d{2}-\d{4}|\d{9}/);
    const zipMatch = line.match(/\d{5}$/);


    const gender =  genderMatch ? (genderMatch[0] === 'MR.' ? 'M' : 'F') : '';
    const dob = dobMatch ? dobMatch[0] : '';
    const ssn = ssnMatch ? ssnMatch[0] : '';
    const zip = zipMatch ? zipMatch[0] : '';

    personData = { gender, dob, ssn, zip }
    let newLine = line;
    newLine = genderMatch ? newLine.replace(genderMatch[0], '') : '';
    newLine = newLine.replace(dob, '');
    newLine = newLine.replace(ssn, '');
    newLine = newLine.replace(zip, '');
    newLine = newLine.replace(/\t/g, '')
    newLine = newLine.trim()
    return { personData, newLine }
}

module.exports = processText
