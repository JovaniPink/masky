# # Import the dependencies.
# # OpenCV
# import cv2

# # TensorFlow and tf.keras
# import tensorflow as tf
# from tensorflow.keras.models import Sequential, load_model

# import numpy as np


# # Load in once of the well performing models from the checkpoints directory.
# model = load_model("./model/model-009.model")
# # Load in the face detection classifier for CV2
# face_clsfr = cv2.CascadeClassifier("./model/haarcascade_frontalface_default.xml")

# # Label and color in RGB for the frame
# labels_dict = {0: "Yes", 1: "No"}
# color_dict = {0: (0, 255, 0), 1: (0, 0, 255)}

# # Prediction Function
# # Needs to be CONVERTED to an API style module.
# # Generate a prediction with loaded model
# def predictor(requestedImage):
#     img = cv2.imread(requestedImage)
#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#     faces = face_clsfr.detectMultiScale(gray, 1.3, 5)

#     for (x, y, w, h) in faces:

#         # Find face, resize the shape, pass into model
#         face_img = gray[y : y + w, x : x + w]
#         resized = cv2.resize(face_img, (100, 100))
#         normalized = resized / 255.0
#         reshaped = np.reshape(normalized, (1, 100, 100, 1))
#         result = model.predict(reshaped)

#         label = np.argmax(result, axis=1)[0]

#         # Draw the rectangle around the face of the person in frame
#         # Passed in the color and text dicts from the previous cell
#         cv2.rectangle(img, (x, y), (x + w, y + h), color_dict[label], 2)
#         cv2.rectangle(img, (x, y - 40), (x + w, y), color_dict[label], -1)
#         cv2.putText(
#             img,
#             labels_dict[label],
#             (x, y - 10),
#             cv2.FONT_HERSHEY_SIMPLEX,
#             0.8,
#             (255, 255, 255),
#             2,
#         )

#     # write image back to file
#     cv2.imwrite("requestedImage", img)
#     # close the window
#     cv2.destroyAllWindows()

#     return {"msg": "success", "size": 20}
