# Rails

[![Join the chat at https://gitter.im/vscode-rails/Lobby](https://badges.gitter.im/vscode-rails/Lobby.svg)](https://gitter.im/vscode-rails/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Ruby on Rails support for Visual Studio Code

## Features

- Ruby on Rails "Asset Helpers" and "Tag Helpers" snippets.
- .erb syntax highlights.
- Navigation between related files through command.
- Go to Definition.
- View path suggestion 、Model's static method suggestion and Model's field suggestion.
- Open online document to the side through command.

#### [Snippets](https://github.com/bung87/vscode-rails/blob/master/snippets)

![feature X](https://github.com/bung87/vscode-rails/raw/master/./images/vscode-rails.gif)

#### Navigation between related files.

![screenshot](https://github.com/bung87/vscode-rails/raw/master/./images/rails-nav.png)

## Default keybinding

### Navigation

- <kbd>Alt + .</kbd>
- <kbd>Opt + .</kbd> (on Mac)

### Open online document to the side

- <kbd>Alt + F1</kbd>
- <kbd>Opt + F1</kbd> (on Mac)

## Known Issues

This extension is not fully implemented form_helpers of rails edge version ,exclude "select" families,"fields_for".
[Form Helpers](http://edgeguides.rubyonrails.org/form_helpers.html)

## Development

### About current stage

Current stage of this extension,aims for using simple regular expression to implements intelligent completion 、"go to definition" and using glob pattern for file navigation in project source files.The lack of variable's and instance method call's definition and completion may implements in next stage.

Notice: Since I'm not a regex pro and rails pro these codes of current stage may needs improvement.will leave it to contributors until I really have plenty of free time.I will use mine free time to merge PRs if has any.

about testing: Manually testing in 2 exsits rails projects.

### Todo for next stage

The next stage of this extension will fill the lack of previews stage may implements a long running process for collection all symbols(module,class,method and etc) in gems for completion and "go to definition",detect ruby env and may interact with [vscode-ruby](https://github.com/rubyide/vscode-ruby) ,caching all completion and definition infomations.

## Contribution

This extension made by mine free time,contributions are welcome!

---

**Enjoy!**
