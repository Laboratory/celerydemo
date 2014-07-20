# celery -A tasks worker --loglevel=info
from celery import Celery

celery = Celery('tasks', broker='amqp://guest:guest@localhost:5672//')

celery.conf.update(
    CELERY_RESULT_BACKEND="amqp",
    CELERY_RESULT_SERIALIZER="json"
)

@celery.task
def add(x, y):
    print x, y
    return x + y


@celery.task
def sleep(x):
    import time
    time.sleep(x)
    return x


@celery.task
def time():
    import time

    return time.time()
