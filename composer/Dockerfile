FROM php:8.1.16-alpine

ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_HOME /tmp

RUN apk add --no-cache libpng-dev libzip-dev zlib-dev curl

RUN docker-php-ext-install gd zip

RUN curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php

RUN php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer 

CMD ["composer"]