{% extends 'layout.swig' %}

{% block title %}{{ title }}{% endblock %}

{% block head %}
  {% parent %}
{% endblock %}

{% block scripts %}
  {% parent %}
{% endblock %}

{% block contents %}
{{ contents | safe }}
{% endblock %}
