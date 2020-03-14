var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
  var cmdLine = document.querySelector(cmdLineContainer)
  var output = document.querySelector(outputContainer)

  const COMMANDS = [
    'help', 'clear', 'date', 'ls', 'cat'
  ]

  const FILES = [
    'resume.txt', 'about.txt', 'contact.txt', 'source.txt'
  ]
  const FILES_OUTPUT = {
    'resume.txt': 'My resume looks best as a pdf! <a href="https://www.jonas-scholz.me/Jonas_Scholz_Resume_2019.pdf" target="_blank"> You can check it out here </a>',
    'about.txt': `Hey there, nice to meet you! My name is Jonas, my friends usually call me Marty though.<br><br>
    I am a 19 year old computer science student at KIT (Karlsruhe, Germany) and a software engineering freelancer.<br>
    My focus lies on the backend site of things.
    I love building secure, efficient and scalable infrastructure for businesses.<br><br>
    I have experience in developing scalable APIs, website-backends and online fraud detection systems, (non-)relational databases (MongoDB, SQL) and micro services to improve <i>your</i> business processes.<br>
    Most of my bigger projects are written in Go, JavaScript or Python and are hosted with Google Cloud / AWS / Digitalocean. Often times with docker && CI/CD to make the development and scaling easier!
    <br><br>              
    Code quality and high productivity are important to me. I value good tests, clean code and CI/CD pipelines that make my teams life easier.
    <br>
    If you're not sure if I am the right fit for your project, take a look at my resume or just hit me up and we can chat about your plans!
    <br><br>
    Cheers, Jonas<br><br><br>
    PS: Use "cat resume.txt" to see my resume, or "cat contact.txt" for my contact details!`,
    'contact.txt': 'Feel free to reach out! You can <a href="mailto:info@jonas-scholz.me">send me a mail</a> or DM me on <a href="https://twitter.com/MartyInTheCloud" target="_blank">Twitter</a>. I also have a <a href="https://github.com/Code42Cate">GitHub profile</a>',
    'source.txt': 'This website was inspired by <a href="https://codepen.io/AndrewBarfield" target="_blank">Andrew Barfield</a>. You can find my fork/source on <a href="https://github.com/Code42Cate/personal-website" target="_blank">GitHub</a>'
  }
  // global vars
  const history = []
  let historyPos = 0
  let historyTemp = 0

  window.addEventListener('click', (e) => {
    cmdLine.focus()
  }, false)

  cmdLine.addEventListener('keydown', historyHandler, false)
  cmdLine.addEventListener('keydown', processNewCommand, false)



  // keydown 
  function historyHandler (e) {
    if (history.length == 0) return // Don't do anything if there's no history

    if (e.keyCode == 38 || e.keyCode == 40) { // Arrow up/down?
      if (history[historyPos]) {
        history[historyPos] = this.value
      } else {
        historyTemp = this.value
      }
    }

    // increment decrement historyPos
    if (e.keyCode == 38) { // up
      historyPos += -1
      if (historyPos < 0) {
        historyPos = 0
      }
    } else if (e.keyCode == 40) { // down
      historyPos += 1
      if (historyPos > history.length) {
        historyPos = history.length
      }
    }

    if (e.keyCode == 38 || e.keyCode == 40) { // Array up/down? No set the actual cmd line value
      this.value = history[historyPos] ? history[historyPos] : historyTemp
    }

  }

  function processNewCommand (e) {
    if (e.keyCode == 9) { // Tab
      e.preventDefault()
    } else if (e.keyCode == 13) { // Enter
      if (this.value) { // Save shell history if value exists
        history[history.length] = this.value
        historyPos = history.length
      }

      // Duplicate current input and append to output section.
      const line = this.parentNode.parentNode.cloneNode(true)
      line.removeAttribute('id')
      line.classList.add('line')
      // OLD input line.
      const input = line.querySelector('input.cmdline')
      input.autofocus = false
      input.readOnly = true

      output.appendChild(line)

      if (this.value && this.value.trim()) {
        var args = this.value.split(/\s/)
        var cmd = args[0].toLowerCase()
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'cat':
          const url = args.join(' ')
          if (!url) {
            writeOutput('Usage: cat resume.txt')
            break
          }
          writeOutput(FILES_OUTPUT[url] !== undefined ? FILES_OUTPUT[url]: `cat: ${url}: No such file or directory`)
          break
        case 'clear':
          output.innerHTML = ''
          this.value = ''
          writeOutput(`Jonas Scholz | Terminal</h2><p>${new Date()}</p><p>Enter "help" for more information!</p>`)  // Basically new init()
          return
        case 'date':
          writeOutput(new Date())
          break
        case 'help':
          writeOutput(`<div class="ls-files">${COMMANDS.join('<br>')}</div>`)
          break
        case 'ls':
          writeOutput(`<div class="ls-files">${FILES.join('<br>')}</div>`)
          break
        default:
          if (cmd) {
            writeOutput(`${cmd}: command not found`)
          }
      }
      // Scroll down if needed
      window.scrollTo(0, document.body.scrollHeight)
      // Reset
      this.value = ''
    }
  }

  function writeOutput (html) {
    output.insertAdjacentHTML('beforeEnd', `<p>${html}</p>`)
  }

  return {
    init: function () {
      writeOutput(`Jonas Scholz | Terminal</h2><p id="date">${new Date()}</p><p>Enter "help" for more information! <a href="text.html">Text only version</a></p>`)
      setInterval(function () {
        document.getElementById("date").innerHTML = new Date();
      }, 1000);
    }
  }
}
