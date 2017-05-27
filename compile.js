const os = require('os');
const fs = require('fs');
const exec = require('child_process').exec;
const destDir = `${os.homedir()}/aws-launcher`; 

urlsFixing = {
  "Lightsail": "https://lightsail.aws.amazon.com/ls/webapp/create/instance",
  "QuickSight": "https://us-east-1.quicksight.aws.amazon.com/sn/console"
}

namespacesFixing = {
  "CertificateManager": "acm",
  "ElasticCache": "elasticache",
  "Shield": "waf",
  "Snowball": "importexport",
  "StepFunctions": "states",
  "WorkDocs": "zocalo",
  "X-Ray": "xray",
}

// Create destination folder
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);  
}

// Create shortcuts
files = fs.readdirSync('icons');
files.forEach((file, index) => {
  file = file.replace(/\.[^/.]+$/, "");
  console.log(`Compiling ${file}`);
  const namespace = namespacesFixing[file] || file.toLowerCase();
  const url = urlsFixing[file] || `https://console.aws.amazon.com/${namespace}/home`;
  fs.writeFileSync(`${destDir}/${file}.url`, `[InternetShortcut]\nURL=${url}`);
  exec(`fileicon set ${destDir}/${file}.url icons/${file}.png`, function(error, stdout, stderr) {
    console.log(error || stdout);
    if (!error) {
      exec(`SetFile -a E ${destDir}/${file}.url`, function(error, stdout, stderr) {
        if (!error && index === files.length - 1) {
          exec(`open ${destDir}`);      
        }
      });
    }
  });
})
