module.exports = {
    generate: function(name){
        return `
            <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>

             <div>Welcome to my spam list. Please visit tiny-spark.soloxs.com to meet with hot Nigerian princes who are ready to share their fortune with you.</div>
             <div style="display:flex; align-items:center; background-color:red; width:50px; height:50px; border:1px black solid;"></div>
             <p>${name}</p>
            </html>
        `
    },
    generatePlainText: function(name){
      return `
          Hi !
          Here we have the plaintext version that will be sent along the HTML version for a fallback.
          ${name}
      `
    }
}
