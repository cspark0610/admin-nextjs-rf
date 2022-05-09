export const exportCsv = (csv: BlobPart) => {
  var downloadLink = document.createElement('a')
  var blob = new Blob(['\ufeff', csv])
  var url = URL.createObjectURL(blob)
  downloadLink.href = url
  downloadLink.download = 'red-leaf-families.csv'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}
