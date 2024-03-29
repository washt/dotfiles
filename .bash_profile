if [ -f $(brew --prefix)/etc/bash_completion ]; then
  . $(brew --prefix)/etc/bash_completion
fi

export NVM_DIR="$HOME/.nvm"

. "/usr/local/opt/nvm/nvm.sh"

source ~/.bashrc

# added by Miniconda2 installer
export PATH="/Users/tuckerwash/miniconda2/bin:$PATH"

export PATH="$HOME/.cargo/bin:$PATH"
