var util = util || {}
util.toArray = function (list) {
  return Array.prototype.slice.call(list || [], 0)
}

var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem

  var cmdLine_ = document.querySelector(cmdLineContainer)
  var output_ = document.querySelector(outputContainer)

  const CMDS_ = [
    'help', 'clear', 'date', 'ls', 'cat'
  ]

  const FILES_ = [
    'resume.txt', 'about.txt', 'contact.txt', 'source.txt'
  ]

  var fs_ = null
  var cwd_ = null
  var history_ = []
  var histpos_ = 0
  var histtemp_ = 0

  window.addEventListener('click', function (e) {
    cmdLine_.focus()
  }, false)

  cmdLine_.addEventListener('click', inputTextClick_, false)
  cmdLine_.addEventListener('keydown', historyHandler_, false)
  cmdLine_.addEventListener('keydown', processNewCommand_, false)

  function inputTextClick_ (e) {
    this.value = this.value
  }

  function historyHandler_ (e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value
        } else {
          histtemp_ = this.value
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--
        if (histpos_ < 0) {
          histpos_ = 0
        }
      } else if (e.keyCode == 40) { // down
        histpos_++
        if (histpos_ > history_.length) {
          histpos_ = history_.length
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  function processNewCommand_ (e) {
    if (e.keyCode == 9) { // tab
      e.preventDefault()
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value
        histpos_ = history_.length
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true)
      line.removeAttribute('id')
      line.classList.add('line')
      var input = line.querySelector('input.cmdline')
      input.autofocus = false
      input.readOnly = true
      output_.appendChild(line)

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function (val, i) {
          return val
        })
        var cmd = args[0].toLowerCase()
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'cat':
          var url = args.join(' ')
          if (!url) {
            output('Usage: ' + cmd + ' resume.txt')
            break
          }
          switch (url) {
            case 'source.txt':
              output('This website was inspired by <a href="https://codepen.io/AndrewBarfield" target="_blank">Andrew Barfield</a>. You can find my fork/source on <a href="https://github.com/Code42Cate/personal-website" target="_blank">GitHub</a>')
              break
            case 'resume.txt':
              output('My resume looks best as a pdf! <a href="https://www.jonas-scholz.me/Jonas_Scholz_Resume_2019.pdf" target="_blank"> You can check it out here </a>')
              break
            case 'contact.txt':
              output('Feel free to reach out! You can <a href="mailto:info@jonas-scholz.me">send me a mail</a> or DM me on <a href="https://twitter.com/MartyInTheCloud" target="_blank">Twitter</a>. I also have a <a href="https://github.com/Code42Cate">GitHub profile</a>')
              break
            case 'about.txt':
              output(`Hey there, nice to meet you! My name is Jonas, my friends usually call me Marty though.<br><br>
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
              PS: Use "cat resume.txt" to see my resume, or "cat contact.txt" for my contact details!
              `)
              break
            default:
              output('cat: ' + url + ': No such file or directory')
          }
          break
        case 'clear':
          output_.innerHTML = ''
          this.value = ''
          output('Jonas Scholz | Terminal</h2><p>' + new Date() + '</p><p>Enter "help" for more information!</p>')
          return
        case 'date':
          output(new Date())
          break
        case 'help':
          output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>')
          break
        case 'ls':
          output('<div class="ls-files">' + FILES_.join('<br>') + '</div>')
          break
        default:
          if (cmd) {
            output(cmd + ': command not found')
          }
      }

      window.scrollTo(0, getDocHeight_())
      this.value = ''; // Clear/setup line for next input.
    }
  }

  function output (html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>')
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_ () {
    var d = document
    return Math.max(
      Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
      Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
      Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    )
  }

  return {
    init: function () {
      output('Jonas Scholz | Terminal</h2><p>' + new Date() + '</p><p>Enter "help" for more information!</p>');    },
    output: output
  }
}
