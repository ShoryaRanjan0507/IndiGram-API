const fs = require('fs');
const readline = require('readline');

async function peekCsv() {
  const filePath = './data.csv/MA_2022_06122023.csv';
  if (!fs.existsSync(filePath)) {
    console.error('CSV not found');
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let count = 0;
  console.log('Peeking at MA_2022_06122023.csv:');
  for await (const line of rl) {
    console.log(line);
    count++;
    if (count >= 5) break;
  }
}

peekCsv();
