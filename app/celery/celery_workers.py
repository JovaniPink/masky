from . import celery


@celery.task(bind=True)
def test_celery(self):
    self.update_state(state="PENDING")

    # Set a timer here!

    # Update that the function was completed.
    self.update_state(state="SUCCESS")

    return "Successful!"
