set nocompatible
filetype off 

set rtp+=~/.vim/bundle/Vundle.vim
"---------Vundle---------------
call vundle#begin()

Plugin 'gmarik/Vundle.vim'
"Plugin 'altercation/vim-colors-solarized'
Plugin 'flazz/vim-colorschemes'
Plugin 'bling/vim-airline'
Plugin 'jnurmine/Zenburn'
Plugin 'scrooloose/nerdtree'
Plugin 'scrooloose/nerdcommenter'
Plugin 'jistr/vim-nerdtree-tabs'
Plugin 'tmhedberg/SimpylFold'

"Python Stuff
Plugin 'scrooloose/syntastic'
Plugin 'nvie/vim-flake8'
Plugin 'hdima/python-syntax'
Plugin 'vim-scripts/indentpython.vim'
Bundle 'Valloric/YouCompleteMe'

" More syntax highlighting
Plugin 'elixir-lang/vim-elixir'
Plugin 'elmcast/elm-vim'

call vundle#end()

"--------------General Settings-------------
filetype plugin indent on

let g:SimpylFold_docstring_preview=1
let g:airline_powerline_fonts = 1
let g:airline_detect_paste=1
let g:airline#extensions#tabline#enables = 1
let g:nerdtree_tabs_open_on_console_startup = 0
let NERDTreeIgnore = ['\.pyc$','\#$','\~$','\.o$']
let g:syntastic_python_checkers = ['flake8']
let python_highlight_all=0
syntax on 
let mapleader=","

colorscheme molokai

set backspace=indent,eol,start
set ruler
set number
set showcmd
set incsearch
set hlsearch
set encoding=utf-8
set foldmethod=indent
set backspace=indent,eol,start
set background=dark
set mouse=a
set foldlevel=99
set clipboard=unnamed " Use system clipboard instead of vim's
set laststatus=2      " Always show status bar

" Extra Highlighting
highlight BadWhitespace ctermbg=red guibg=red

" File specific spacing
au BufNewFile,BufRead *.js, *.html, *.css set tabstop=2
au BufNewFile,BufRead *.js, *.html, *.css set softtabstop=2
au BufNewFile,BufRead *.js, *.html, *.css set shiftwidth=2

"au BufNewFile,BufRead *.py set tabstop=4
"au BufNewFile,BufRead *.py set softtabstop=4
"au BufNewFile,BufRead *.py set shiftwidth=4
"au BufNewFile,BufRead *.py set textwidth=79
"au BufNewFile,BufRead *.py set expandtab
"au BufNewFile,BufRead *.py set autoindent
"au BufNewFile,BufRead *.py set fileformat=unix

" Keybindings
imap jj <Esc>
nmap <silent> <leader>t :NERDTreeTabsToggle<CR>
nmap <silent> <leader>/ :!clear;python %<CR>
nnoremap <space> za
noremap <C-x> :update<CR>
vnoremap <C-x> <C-C>:update<CR>
inoremap <C-x> <C-O>:update<CR>
