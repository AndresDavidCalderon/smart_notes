function removeAttachments(text) {
  let newText = text;
  let index = newText.indexOf('@');
  while (index < newText.length && index !== -1) {
    if (!Number.isNaN(parseFloat(newText[index + 1]))) {
      newText = `${newText.substring(0, index)}${newText.substring(index + 2)}`;
    } else {
      index += 1;
    }
    index = newText.indexOf('@', index);
  }
  return newText;
}

function removeBBCode(text) {
  let newText = text;
  let index = newText.indexOf('[');
  while (index < newText.length && index !== -1) {
    const closingIndex = newText.indexOf(']', index);
    newText = `${newText.substring(0, index)}${newText.substring(closingIndex + 1)}`;
    index = newText.indexOf('[', index);
  }
  return newText;
}

module.exports = {
  removeAttachments,
  removeBBCode,
};
