=== no npm installed

Push gh-pages(first)
git branch -v gh-pages && git checkout gh-pages && cd gulp && sudo npm install .  && gulp minify && gulp gh-pages && cd ../ && git add -A && git commit -m 'Minify js、html, fix gh-pages path bug.' && git push origin gh-pages --force && git checkout master

Push gh-pages(not first)
git branch -D gh-pages && git branch -v gh-pages && git checkout gh-pages && cd gulp && npm install .  && gulp minify && gulp gh-pages && cd ../ && git add -A && git commit -m 'Minify js、html, fix gh-pages path bug.' && git push origin gh-pages --force && git checkout master

=== has npm installed

Push gh-pages(first)
git branch -v gh-pages && git checkout gh-pages && cd gulp && gulp minify && gulp gh-pages && cd ../ && git add -A && git commit -m 'Minify js、html, fix gh-pages path bug.' && git push origin gh-pages --force && git checkout master

Push gh-pages(not first)
git branch -D gh-pages && git branch -v gh-pages && git checkout gh-pages && cd gulp && gulp minify && gulp gh-pages && cd ../ && git add -A && git commit -m 'Minify js、html, fix gh-pages path bug.' && git push origin gh-pages --force && git checkout master