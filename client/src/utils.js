const newErrorMsg = (setter, msg) => {
  setter(msg)
  setTimeout(() => {
    setter('')
  }, 1000 * 5)
}

module.exports = {
  newErrorMsg,
}
