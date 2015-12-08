alias cl='clear'
alias emacs='emacs -nw'
alias em='emacs -nw'
#alert with given message. i.e.:
# (sleep 100; alert "Check Cookies") &
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)"'
#alert with process name and optional message
alias alertp='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)""$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'
#custom alert shortcuts
alias wow='(sleep 1h; alert "Remember") &'
#python stuffs
alias ipy='jupython notebook &'
#show installed kernals
alias specialk='dpkg -l linux-image-\* | grep ^ii'
#change to fish shell
alias chfish='chsh -s /usr/bin/fish'
#parallelize make
alias make='make -j 4'
#copy/paste utils
alias pbcopy='xsel --clipboard --input'
alias pbpaste='xsel --clipboard --output'
#list ports in use
alias ports='sudo netstat -plunt'
# Some more useful ALIAS
alias ll='ls -l'
alias tmux='TERM=xterm-256color /usr/bin/tmux'
alias serve='python -m SimpleHTTPServer'
alias prettyjson='python -m json.tool'
#alias unusedkernals=' dpkg -l 'linux-*' | sed '/^ii/!d;/'"$(uname -r | sed "s/\(.*\)-\([^0-9]\+\)/\1/")"'/d;s/^[^ ]* [^ ]* \([^ ]*\).*/\1/;/[0-9]/!d''
alias log='git log --graph --decorate'
