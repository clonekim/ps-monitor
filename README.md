# PS-Monitor

## Skills
 - React
 - Go

## Features
 - dark theme
 - grid/table view supports
 - configable for process's
 - configable for logs's 
 - adjustable calling api's period

### config.yml

```yaml
server:
  port: 4900
  debug: true

program:
  match: 1
  ratioformat: "%.3f"
  processes:
    # label,command,user,color,bgColor
    - VI,nvim,bonjour,,
    - IntelliJ,idea,,#d53636de,#261e1e
    - Emacs,Emacs,,,

logs:
  - 0,tail -n%d /var/log/system.log | awk '$0 ~ /login/'
  - 1,/var/log/daily.out
```

## Screens

### Process View 

![](img/list.png)

### Process Detail

![](img/detail.png)

### Log Viewer

![](img/log.png)


## Build

### Front
```
yarn build
```

### Server

```
GOOS=linux GOARCH=amd64 go build server.go
```
for windows
```
GOOS=windows GOARCH=amd64
```

for Mac
```
GOOS=darwin GOARCH=amd64 or arm64
```

## Using precompiled binary

download appropriate binary file from deploy directory  
and copy config.yml
