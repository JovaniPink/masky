"""
This is the image api module and supports all the REST actions for image uploads
"""


def allowed_image(filename):

    # We only want files with a . in the filename
    if not "." in filename:
        return False

    # Split the extension from the filename
    ext = filename.rsplit(".", 1)[1]

    # Check if the extension is in ALLOWED_IMAGE_EXTENSIONS
    if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
        return True
    else:
        return False


def test_formdata_file_upload():
    uploaded_file = connexion.request.files["file"]

    if uploaded_file.fileName == "":
        return {"status": 415}

    if uploaded_file and allowed_image(uploaded_file.filename):
        filename = secure_filename(uploaded_file.filename)
        uploaded_file.save(os.path.join(app.config["IMAGE_UPLOADS"], filename))
        return {"status": 200}
