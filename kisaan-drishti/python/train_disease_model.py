"""Optional: train a leaf-disease classifier on the PlantVillage dataset.
Dataset: https://www.kaggle.com/datasets/emmarex/plantdisease  (folder per class)
Run:  pip install -r requirements.txt && python train_disease_model.py
Then convert for the browser:  tensorflowjs_converter --input_format keras model.h5 web_model/
"""
import tensorflow as tf

DATA_DIR = "PlantVillage"      # path to extracted dataset
IMG = (224, 224)

train = tf.keras.utils.image_dataset_from_directory(DATA_DIR, validation_split=0.2, subset="training", seed=42, image_size=IMG, batch_size=32)
val = tf.keras.utils.image_dataset_from_directory(DATA_DIR, validation_split=0.2, subset="validation", seed=42, image_size=IMG, batch_size=32)
classes = train.class_names

base = tf.keras.applications.MobileNetV2(input_shape=IMG + (3,), include_top=False, weights="imagenet")
base.trainable = False
model = tf.keras.Sequential([
    tf.keras.layers.Rescaling(1 / 127.5, offset=-1),
    base,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(len(classes), activation="softmax"),
])
model.compile("adam", "sparse_categorical_crossentropy", metrics=["accuracy"])
model.fit(train, validation_data=val, epochs=5)
model.save("model.h5")
print("Classes:", classes)
