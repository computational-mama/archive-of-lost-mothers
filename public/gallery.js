const options = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  // body: JSON.stringify(promptdata)
};

fetch("/gallery", options)
  .then((response) => {
    console.log(response);
    return response.text();
  })
  .then((data) => {
    // console.log(data)
    const obj = JSON.parse(data);
    Object.keys(obj).forEach((key) => {
      if (obj[key].caption !== "test" && obj[key].caption !== undefined) {
        let imageDiv = document.createElement("div")
        imageDiv.classList.add("imageDiv")
        let link = obj[key].link;
        let c_data = link.replace(/"/g, "");
        var aimg = document.createElement("img");
        aimg.src = c_data;
        aimg.classList.add("galleryImg")
        imageDiv.appendChild(aimg)

        let caption = obj[key].caption;
        var acap = document.createElement("p");
        acap.innerHTML = caption
        acap.classList.add("galleryCap")
        imageDiv.appendChild(acap);

        document.getElementById("gallerypush").appendChild(imageDiv);

        // // let cap_data = caption.replace(/"/g, '');
        // var acap = document.createElement("p");
        // console.log(caption)
        // acap.innerHTML = caption
        // document.getElementById('gallerypush').appendChild(acap);
        // Get the modal
        var modal = document.getElementById("myModal");

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        //   var img = document.getElementById("myImg");
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        aimg.onclick = function () {
          modal.style.display = "block";
          modalImg.src = this.src;
          captionText.innerHTML = caption;
        };

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
          modal.style.display = "none";
        };
      }
    });

    //   return data;
  })
  .catch((ex) => {
    console.error(ex);
  });
