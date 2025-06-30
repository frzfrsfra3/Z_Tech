#!/bin/bash
# Install PHP and Composer
sudo apt-get update && sudo apt-get install -y php-cli php-mbstring php-xml php-zip unzip
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# Run Laravel setup
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan migrate --seed