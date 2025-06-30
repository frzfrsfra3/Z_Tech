FROM richarvey/nginx-php-fpm:3.1.6

# RUN git clone https://github.com/frzfrsfra3/backend_devteam.git /tmp/backend && mv /tmp/backend/{*,.*} .
RUN git clone https://github.com/frzfrsfra3/backend_devteam.git /tmp/repo && \
    cp -RTf /tmp/repo/ . && \
    rm -rf /tmp/repo
RUN ls -la  

# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG true
ENV APP_NAME test


# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

CMD ["/start.sh"]
# ENV APP_URL https://yourprojecturl.onrender.com/
# ENV DB_CONNECTION someValue
# ENV DB_HOST someValue
# ENV DB_PORT someValue
# ENV DB_DATABASE someValue
# ENV DB_USERNAME someValue
# ENV DB_PASSWORD someValue
# ENV BROADCAST_CONNECTION log
# ENV MAIL_MAILER someValue
# ENV MAIL_HOST someValue
# ENV MAIL_PORT someValue
# ENV MAIL_USERNAME someValue
# ENV MAIL_PASSWORD someValue
# ENV MAIL_ENCRYPTION someValue
# ENV MAIL_FROM_ADDRESS "someValue"
# ENV MAIL_FROM_NAME "someValue"
# ENV JWT_SECRET someValue
# ENV QUEUE_CONNECTION databas
# # Allow composer to run as root
# ENV COMPOSER_ALLOW_SUPERUSER 1

# CMD ["/start.sh"]