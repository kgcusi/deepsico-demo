// setHomepage.js
const fs = require("fs")
const path = require("path")

const packageJsonPath = path.join(__dirname, "package.json")

function setHomepage(homepage) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  if (homepage) {
    // Ensure we're setting a string without extra quotes
    packageJson.homepage = homepage.replace(/['"]+/g, "")
  } else {
    delete packageJson.homepage
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n")
  console.log(`Homepage set to: ${homepage || "null"}`)
}

// Remove the extra single quotes that might be passed as part of the command line argument
const homepage = process.argv[2].replace(/['"]+/g, "")
setHomepage(homepage)
