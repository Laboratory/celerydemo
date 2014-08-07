Celery JS Client
=========
-----------
An example of how to set the queue in [RabbitMQ] treated [Celery].


Run
--------------

```sh
git clone [git-repo-url] folder
cd folder
npm install
bower install
--run grunt
grunt 
--run local server
node server.js
--run task
cd celery/ && celery -A tasks worker --loglevel=debug
```

Licentse
----
MIT


**Free Software**

[Celery]:http://www.celeryproject.org/
[RabbitMQ]:http://www.rabbitmq.com/