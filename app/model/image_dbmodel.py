# """
# Although this example shows how to serve images from both a database and from the filesystem,
# it is generally thought to be better to serve images from the
# filesystem in the interest of application performance.
# Filesystems are designed for that sort of thing. Nonetheless,
# there are situations where it may be necessary to store an image (or a file in general) in the database,
# hence the existence of that feature in this demo application.
# """

# from datetime import datetime
# from app import db, ma
# from marshmallow import fields


# class Image(db.Model):
#     __tablename__ = "images"

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String())
#     img_filename = db.Column(db.String())
#     img_data = db.Column(db.LargeBinary)

#     def __repr__(self):
#         return "<image id={},name={}>".format(self.id, self.name)


# def get_image(the_id):
#     # return Image.query.filter(Image.id == the_id).first()
#     return Image.query.get_or_404(the_id)


# def get_images(params=None):
#     if not params:
#         return Image.query.all()
#     else:
#         raise Exception("Filtering not implemented yet.")


# def add_image(image_dict):
#     new_image = Image(
#         name=image_dict["name"],
#         img_filename=image_dict["img_filename"],
#         img_data=image_dict["img_data"],
#     )
#     db.session.add(new_image)
#     db.session.commit()


# class PersonSchema(ma.SQLAlchemyAutoSchema):
#     class Meta:
#         model = Image
#         sqla_session = db.session
