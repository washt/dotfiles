set nocompatible

syntax on
set number
set mouse=a
filetype on
filetype indent on
filetype plugin on

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

