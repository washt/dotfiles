#!/usr/bin/env bash

git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim;
cp -f .inputrc ~/.inputrc;
cp -f .bashrc ~/.bashrc;
cp -f .bash_aliases ~/.bash_aliases;
cp -f .vimrc ~/.vimrc;
mkdir -f ~/.vim;
cp -rf .vim ~/vim;
