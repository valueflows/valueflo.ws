<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{% block title %}Value Flows{% endblock %}</title>

    {% block head %}
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="/css/index.css">
    {% endblock %}
  </head>
  <body>
    <main>
      {% block contents %}{% endblock %}
    </main>
    {% block scripts %}
    {% endblock %}
  </body>
</html>
