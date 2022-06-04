set nocompatible

syntax on
set number
set mouse=a
filetype on
filetype indent on
filetype plugin on

" Auto install of vim-plug
let data_dir = has('nvim') ? stdpath('data') . '/site' : '~/.vim'
if empty(glob(data_dir . '/autoload/plug.vim'))
  silent execute '!curl -fLo '.data_dir.'/autoload/plug.vim --create-dirs  https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

call plug#begin('~/.vim/plugged')

Plug 'tpope/vim-sensible'
Plug 'junegunn/seoul256.vim'
Plug '/usr/local/fzf'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }

call plug#end()

" Plugin Specific Configs
colo seoul256

let mapleader=","

" Keybindings
imap jj <Esc>
noremap <C-x> :update<CR>
vnoremap <C-x> <C-C>:update<CR>
inoremap <C-x> <C-O>:update<CR>

