const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const emptyText = document.getElementById("emptyText");
const nextBtn = document.getElementById("nextBtn");

let selectedImage = null;

imageInput.addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (!file) return;

    selectedImage = file;

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;
        const img = new Image();

img.onload = function(){

    const maxWidth = 600;

    const scale = maxWidth / img.width;

    canvas.width = maxWidth;
    canvas.height = img.height * scale;

    ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
    );

    canvas.style.display = "block";

};

img.src = e.target.result;
        previewImage.style.display = "block";

        emptyText.style.display = "none";

        nextBtn.disabled = false;

    };

    reader.readAsDataURL(file);

});

nextBtn.addEventListener("click", function () {

    alert("Sprint 2 selesai 🎉\n\nSelanjutnya kita akan mengubah gambar menjadi Color by Number.");

});
