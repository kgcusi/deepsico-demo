// setHomepage.js
const fs = require("fs")
const path = require("path")

const packageJsonPath = path.join(__dirname, "package.json")

function setHomepage(homepage) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  if (homepage) {
    packageJson.homepage = homepage
  } else {
    delete packageJson.homepage
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n")
  console.log(`Homepage set to: ${homepage || "null"}`)
}

const homepage = process.argv[2] // Pass the homepage URL as a command line argument
setHomepage(homepage)
